import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { UUID } from "crypto";
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 12,
      timeCost: 12,
      parallelism: 1,
    });

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findOne(id: UUID) {
    const exists = await this.verifyExists(id);

    if (!exists) {
      throw new BadRequestException("User not found");
    }

    return exists;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const exists = await this.verifyExists(id);

    if (!exists) {
      throw new BadRequestException("User not found");
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: UUID) {
    const exists = await this.verifyExists(id);

    if (!exists) {
      throw new BadRequestException("User not found");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return;
  }

  async verifyExists(id: UUID) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async verifyExistsByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async verifyPassword(plainPassword: string, userId: UUID) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return argon2.verify(user.password, plainPassword);
  }
}
