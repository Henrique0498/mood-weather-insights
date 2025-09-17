import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import { User } from "@prisma/client";
import { UserService } from "@/user/user.service";
import { UUID } from "crypto";
import { RegisterDto } from "./dto/register.dto";

export interface TypeGenerateTokens
  extends Omit<User, "password" | "createdAt" | "updatedAt" | "isActive"> {}

export type TypeJwtPayload = {
  sub: UUID;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(dto: LoginDto) {
    const response = await this.userService.verifyExistsByEmail(dto.email);

    if (!response) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValidAuth = await this.userService.verifyPassword(
      dto.password,
      response.id as UUID
    );

    if (!isValidAuth) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateTokens(response);
  }

  async refresh(token: string) {
    const decoded = await this.jwtService.verifyAsync<TypeJwtPayload>(token);

    const user = await this.userService.verifyExists(decoded.sub);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.generateTokens(user);
  }

  async register({ confirmPassword, ...dto }: RegisterDto) {
    if (dto.password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const existing = await this.userService.verifyExistsByEmail(dto.email);

    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const user = await this.userService.create({
      ...dto,
    });

    return this.generateTokens(user);
  }

  private async generateTokens(user: TypeGenerateTokens) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
    });

    return {
      user,
      refreshToken,
      accessToken,
    };
  }
}
