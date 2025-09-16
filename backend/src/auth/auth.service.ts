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

    return this.generateTokens(user);
  }

  async register(dto: CreateUserDto) {
    const existing = await this.userService.verifyExistsByEmail(dto.email);

    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const { default: argon2 } = await import("argon2");
    const password = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 12,
      timeCost: 12,
      parallelism: 1,
    });

    const user = await this.userService.create({
      ...dto,
      password,
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
