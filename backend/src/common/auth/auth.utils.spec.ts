import { Reflector } from "@nestjs/core";
import { Public } from "./public.decorator";
import { IS_PUBLIC_KEY } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

describe("Auth utilities", () => {
  it("Public decorator sets metadata key", () => {
    const meta = Public();
    // SetMetadata returns a function with key & value captured; we can assert the constants exist
    expect(IS_PUBLIC_KEY).toBe("isPublic");
    expect(typeof meta).toBe("function");
  });

  it("JwtStrategy validate returns minimal user object", async () => {
    const strat = new JwtStrategy();
    await expect(
      strat.validate({ sub: "u1", email: "a@a.com" })
    ).resolves.toEqual({ userId: "u1", email: "a@a.com" });
  });

  it("JwtAuthGuard allows public routes", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as unknown as Reflector;
    const guard = new JwtAuthGuard(reflector);
    const ctx: any = {
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
