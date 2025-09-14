import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "@/common/prisma/prisma.service";
import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";

jest.mock("argon2", () => ({
  __esModule: true,
  default: {},
  hash: jest.fn().mockResolvedValue("hashedpw"),
  verify: jest.fn().mockResolvedValue(true),
}));

describe("UserService", () => {
  let service: UserService;
  let prisma: {
    user: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("create should hash password and return sanitized user", async () => {
    const dto = { email: "a@a.com", name: "Alice", password: "secret" } as any;
    const created = {
      id: randomUUID(),
      email: dto.email,
      name: dto.name,
      password: "hashedpw",
    } as any;
    prisma.user.create.mockResolvedValue(created);

    await expect(service.create(dto)).resolves.toEqual({
      id: created.id,
      email: created.email,
      name: created.name,
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: dto.email,
        name: dto.name,
        password: "hashedpw",
      }),
    });
  });

  it("findAll should select only id,email,name", async () => {
    const list = [{ id: randomUUID(), email: "x@x.com", name: "X" }] as any;
    prisma.user.findMany.mockResolvedValue(list);

    await expect(service.findAll()).resolves.toEqual(list);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: { id: true, email: true, name: true },
    });
  });

  it("findOne should use verifyExists (findUnique with select)", async () => {
    const id = randomUUID() as any;
    const entity = { id, email: "b@b.com", name: "B" } as any;
    prisma.user.findUnique.mockResolvedValue(entity);

    await expect(service.findOne(id)).resolves.toEqual(entity);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: { id: true, email: true, name: true },
    });
  });

  it("findOne should throw BadRequestException when not found", async () => {
    const id = randomUUID() as any;
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: { id: true, email: true, name: true },
    });
  });

  it("update should verify existence then delegate to prisma.update", async () => {
    const id = randomUUID() as any;
    const dto = { name: "Bob" } as any;
    const existing = { id, email: "b@b.com", name: "B" } as any;
    const updated = { id, email: "b@b.com", name: "Bob" } as any;
    prisma.user.findUnique.mockResolvedValue(existing);
    prisma.user.update.mockResolvedValue(updated);

    await expect(service.update(id, dto)).resolves.toEqual(updated);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id },
      data: dto,
    });
  });

  it("update should throw BadRequestException when entity does not exist", async () => {
    const id = randomUUID() as any;
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.update(id, { name: "X" } as any)).rejects.toThrow(
      "User not found"
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("remove should verify existence then delete and return void", async () => {
    const id = randomUUID() as any;
    const existing = { id, email: "b@b.com", name: "B" } as any;
    prisma.user.findUnique.mockResolvedValue(existing);
    prisma.user.delete.mockResolvedValue(existing);

    await expect(service.remove(id)).resolves.toBeUndefined();
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it("remove should throw BadRequestException when entity does not exist", async () => {
    const id = randomUUID() as any;
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.remove(id)).rejects.toThrow(BadRequestException);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it("verifyPassword should return true or false based on argon2.verify", async () => {
    const argon2 = require("argon2");

    await expect(service.verifyPassword("hashed", "plain")).resolves.toBe(true);

    argon2.verify.mockResolvedValueOnce(false);
    await expect(service.verifyPassword("hashed", "plain")).resolves.toBe(
      false
    );
  });
});
