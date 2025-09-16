import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  const auth = {
    login: jest.fn(),
    refresh: jest.fn(),
    register: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();
    controller = module.get(AuthController);
  });

  it("delegates to authService.login", async () => {
    auth.login.mockResolvedValue({ ok: true });
    await expect(
      controller.login({ email: "a@a.com", password: "x" } as any)
    ).resolves.toEqual({ ok: true });
    expect(auth.login).toHaveBeenCalledWith({
      email: "a@a.com",
      password: "x",
    });
  });

  it("delegates to authService.refresh", async () => {
    auth.refresh.mockResolvedValue({ token: "x" });
    await expect(controller.refresh("rt")).resolves.toEqual({ token: "x" });
    expect(auth.refresh).toHaveBeenCalledWith("rt");
  });

  it("delegates to authService.register", async () => {
    auth.register.mockResolvedValue({ ok: true });
    await expect(
      controller.register({
        name: "Alice",
        email: "a@a.com",
        password: "x",
      } as any)
    ).resolves.toEqual({ ok: true });
    expect(auth.register).toHaveBeenCalled();
  });
});
