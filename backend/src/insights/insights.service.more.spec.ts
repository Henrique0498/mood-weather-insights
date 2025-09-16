import { Test, TestingModule } from "@nestjs/testing";
import { CacheModule, CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { InsightsService } from "./insights.service";
import { PrismaService } from "@/common/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { OpenAiService } from "@/common/open-ai/open-ai.service";
import { OpenWeatherService } from "@/common/open-weather/open-weather.service";
import { BadGatewayException } from "@nestjs/common";

describe("InsightsService more coverage", () => {
  let service: InsightsService;
  let cache: Cache;
  const prisma = {
    insight: {
      groupBy: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  } as any;
  const users = { verifyExists: jest.fn() } as any;
  const ai = { fourOMini: jest.fn() } as any;
  const weather = { findByLocation: jest.fn() } as any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 1000 })],
      providers: [
        InsightsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UserService, useValue: users },
        { provide: OpenAiService, useValue: ai },
        { provide: OpenWeatherService, useValue: weather },
      ],
    }).compile();

    service = module.get(InsightsService);
    cache = module.get(CACHE_MANAGER);
    users.verifyExists.mockResolvedValue({
      id: "u1",
      email: "a@a.com",
      name: "A",
    });
  });

  describe("findTopics", () => {
    it("returns latest insight per topic ordered by recency", async () => {
      prisma.insight.groupBy.mockResolvedValue([
        { topic: "t1", _max: { createdAt: new Date("2025-09-01") } },
        { topic: "t2", _max: { createdAt: new Date("2025-09-02") } },
      ]);
      prisma.insight.findFirst
        .mockResolvedValueOnce({
          id: "i2",
          topic: "t1",
          createdAt: new Date("2025-09-01"),
        })
        .mockResolvedValueOnce({
          id: "i3",
          topic: "t2",
          createdAt: new Date("2025-09-02"),
        });

      const result = await service.findTopics({
        userId: "u1" as any,
        limit: 2,
      });
      expect(result).toEqual([
        { id: "i2", topic: "t1", createdAt: new Date("2025-09-01") },
        { id: "i3", topic: "t2", createdAt: new Date("2025-09-02") },
      ]);
      expect(prisma.insight.groupBy).toHaveBeenCalled();
      expect(prisma.insight.findFirst).toHaveBeenCalledTimes(2);
    });
  });

  describe("findAll", () => {
    it("verifies user and returns insights filtered", async () => {
      prisma.insight.findMany.mockResolvedValue([
        { id: "i1", topic: "t", content: "c", createdAt: new Date() },
      ]);
      const res = await service.findAll({ userId: "u1" as any, topic: "t" });
      expect(res.length).toBe(1);
      expect(prisma.insight.findMany).toHaveBeenCalledWith({
        where: { userId: "u1" as any, topic: "t" },
        orderBy: { createdAt: "desc" },
        select: { id: true, topic: true, content: true, createdAt: true },
      });
    });
  });

  describe("create", () => {
    it("returns cached insight when exists (topic+weather+user cache)", async () => {
      const cached = {
        id: "i1",
        topic: "t",
        content: "cached",
        createdAt: new Date(),
      };
      const key = `topic:t:weather:sunny:user:u1`;

      const weatherKey = `weather:${Number(-23.5).toFixed(2)}:${Number(
        -46.6
      ).toFixed(2)}`;
      await cache.set(
        weatherKey,
        { weather: [{ description: "sunny" }], main: { temp: 25 } } as any,
        1000
      );
      await cache.set(key, cached as any, 1000);

      const res = await service.create({
        userId: "u1" as any,
        topic: "t",
        lat: -23.5,
        lon: -46.6,
      });
      expect(res).toEqual(cached);
      expect(ai.fourOMini).not.toHaveBeenCalled();
      expect(prisma.insight.create).not.toHaveBeenCalled();
    });

    it("creates new insight when cache empty, persists and caches result", async () => {
      weather.findByLocation.mockResolvedValue({
        weather: [{ description: "cloudy" }],
        main: { temp: 20 },
      });
      ai.fourOMini.mockResolvedValue({
        choices: [{ message: { content: "generated" } }],
      });
      const created = {
        id: "i9",
        topic: "t9",
        content: "generated",
        createdAt: new Date(),
        weather: { ok: true },
      } as any;
      prisma.insight.create.mockResolvedValue(created);

      const res = await service.create({
        userId: "u1" as any,
        topic: "t9",
        lat: 1,
        lon: 1,
      });
      expect(res).toEqual({
        id: created.id,
        topic: created.topic,
        content: created.content,
        createdAt: created.createdAt,
      });
      expect(prisma.insight.create).toHaveBeenCalled();
    });
  });

  describe("findOne/remove/verifyExists", () => {
    it("findOne delegates to verifyExists and returns entity", async () => {
      prisma.insight.findUnique.mockResolvedValue({ id: "iid", ok: true });
      await expect(service.findOne("iid" as any)).resolves.toEqual({
        id: "iid",
        ok: true,
      });
    });

    it("verifyExists throws when not found", async () => {
      prisma.insight.findUnique.mockResolvedValue(null);
      await expect(
        (service as any).verifyExists("missing" as any)
      ).rejects.toBeInstanceOf(BadGatewayException);
    });

    it("remove deletes after verifyExists", async () => {
      prisma.insight.findUnique.mockResolvedValue({ id: "iid" });
      prisma.insight.delete.mockResolvedValue({});
      await expect(service.remove("iid" as any)).resolves.toBeUndefined();
      expect(prisma.insight.delete).toHaveBeenCalledWith({
        where: { id: "iid" as any },
      });
    });
  });
});
