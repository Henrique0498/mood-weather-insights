import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";

describe("App (e2e)", () => {
  let app: INestApplication<App>;
  let jwt: JwtService;
  let authHeader: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          create: jest.fn(),
          findMany: jest.fn().mockResolvedValue([]), // used by controller
          findUnique: jest.fn(), // not needed by guard strategy here
          update: jest.fn(),
          delete: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwt = app.get(JwtService);
    const testUserId = randomUUID();
    const testEmail = "test@example.com";
    const token = await jwt.signAsync({ sub: testUserId, email: testEmail });
    authHeader = `Bearer ${token}`;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /users", async () => {
    await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", authHeader)
      .expect(200)
      .expect({ data: [] });
  });
});
