import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/user/user.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

jest.mock("argon2", () => ({
  __esModule: true,
  default: {
    argon2id: 2,
    hash: jest.fn().mockResolvedValue("hashed"),
  },
}));

describe("AuthService", () => {
  let service: AuthService;
  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as any;
  const users = {
    verifyExistsByEmail: jest.fn(),
    verifyPassword: jest.fn(),
    verifyExists: jest.fn(),
    create: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwt },
        { provide: UserService, useValue: users },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe("login", () => {
    it("returns tokens and user when password ok", async () => {
      const user = { id: "u1", email: "a@a.com", name: "Alice" };
      users.verifyExistsByEmail.mockResolvedValue(user);
      users.verifyPassword.mockResolvedValue(true);
      jwt.signAsync
        .mockResolvedValueOnce("access-token")
        .mockResolvedValueOnce("refresh-token");

      await expect(
        service.login({ email: user.email, password: "plain" })
      ).resolves.toEqual({
        user,
        refreshToken: "refresh-token",
        accessToken: "access-token",
      });
    });

    it("throws Unauthorized when password invalid", async () => {
      const user = { id: "u1", email: "a@a.com", name: "Alice" };
      users.verifyExistsByEmail.mockResolvedValue(user);
      users.verifyPassword.mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: "bad" })
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });

    it("throws Unauthorized when user not found", async () => {
      users.verifyExistsByEmail.mockResolvedValue(undefined);
      await expect(
        service.login({ email: "missing@a.com", password: "x" })
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(users.verifyPassword).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("issues new tokens when refresh token valid", async () => {
      jwt.verifyAsync.mockResolvedValue({ sub: "u1", email: "a@a.com" });
      users.verifyExists.mockResolvedValue({
        id: "u1",
        email: "a@a.com",
        name: "Alice",
      });
      jwt.signAsync
        .mockResolvedValueOnce("access-token")
        .mockResolvedValueOnce("refresh-token");

      await expect(service.refresh("good-token")).resolves.toEqual({
        user: { id: "u1", email: "a@a.com", name: "Alice" },
        refreshToken: "refresh-token",
        accessToken: "access-token",
      });
    });

    it("throws Unauthorized when token invalid", async () => {
      jwt.verifyAsync.mockRejectedValue(new Error("bad"));
      await expect(service.refresh("bad-token")).rejects.toThrow();
    });

    it("throws Unauthorized when user does not exist anymore", async () => {
      jwt.verifyAsync.mockResolvedValue({ sub: "u1", email: "gone@a.com" });
      users.verifyExists.mockResolvedValue(null);
      await expect(service.refresh("token")).rejects.toBeInstanceOf(
        UnauthorizedException
      );
    });
  });

  describe("register", () => {
    it("creates user and returns tokens", async () => {
      users.verifyExistsByEmail.mockResolvedValue(undefined);
      users.create.mockResolvedValue({
        id: "u1",
        email: "a@a.com",
        name: "Alice",
      });
      jwt.signAsync
        .mockResolvedValueOnce("access-token")
        .mockResolvedValueOnce("refresh-token");

      await expect(
        service.register({
          name: "Alice",
          email: "a@a.com",
          password: "x",
          confirmPassword: "x",
        })
      ).resolves.toEqual({
        user: { id: "u1", email: "a@a.com", name: "Alice" },
        refreshToken: "refresh-token",
        accessToken: "access-token",
      });
    });

    it("rejects when email already exists", async () => {
      users.verifyExistsByEmail.mockResolvedValue({ id: "u1" });
      await expect(
        service.register({
          name: "Alice",
          email: "a@a.com",
          password: "x",
          confirmPassword: "x",
        })
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it("rejects when passwords mismatch", async () => {
      users.verifyExistsByEmail.mockResolvedValue(undefined);
      await expect(
        service.register({
          name: "Alice",
          email: "a@a.com",
          password: "x",
          confirmPassword: "y",
        })
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(users.create).not.toHaveBeenCalled();
    });
  });
});
