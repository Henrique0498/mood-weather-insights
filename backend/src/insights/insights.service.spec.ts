import { Test, TestingModule } from "@nestjs/testing";
import { InsightsService } from "./insights.service";
import { CacheModule, CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { BadGatewayException } from "@nestjs/common";
import { OpenWeatherService } from "@/common/open-weather/open-weather.service";
import { PrismaService } from "@/common/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { OpenAiService } from "@/common/open-ai/open-ai.service";

describe("InsightsService (findWeather with cache + OpenWeatherService)", () => {
  let service: InsightsService;
  let cache: Cache;
  let openWeather: { findByLocation: jest.Mock };

  const callFindWeather = (args: any) => (service as any)["findWeather"](args);

  beforeEach(async () => {
    openWeather = { findByLocation: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 5 * 60 * 1000 })],
      providers: [
        InsightsService,
        { provide: OpenWeatherService, useValue: openWeather },
        { provide: PrismaService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: OpenAiService, useValue: {} },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch and cache by rounded lat/lon key", async () => {
    openWeather.findByLocation.mockResolvedValueOnce({ weather: "sunny" });

    const dto = { lat: -23.55052, lon: -46.633308 } as any;

    const first = await callFindWeather(dto);
    expect(first).toEqual({ weather: "sunny" });
    expect(openWeather.findByLocation).toHaveBeenCalledTimes(1);

    const dto2 = { lat: -23.551, lon: -46.6337 } as any;
    const second = await callFindWeather(dto2);

    expect(second).toEqual({ weather: "sunny" });

    expect(openWeather.findByLocation).toHaveBeenCalledTimes(1);

    const key = `weather:${Number(dto.lat).toFixed(2)}:${Number(
      dto.lon
    ).toFixed(2)}`;
    await expect(cache.get(key)).resolves.toEqual({ weather: "sunny" });
  });

  it("throws BadGatewayException with upstream message when provided", async () => {
    openWeather.findByLocation.mockRejectedValueOnce(
      new BadGatewayException("city not found")
    );

    await expect(
      callFindWeather({ lat: 1, lon: 1 } as any)
    ).rejects.toBeInstanceOf(BadGatewayException);
    await callFindWeather({ lat: 1, lon: 1 } as any).catch(
      (e: BadGatewayException) => {
        expect(String(e.message)).toContain("city not found");
      }
    );
  });

  it("throws BadGatewayException with default message on generic failure", async () => {
    openWeather.findByLocation.mockRejectedValueOnce(
      new BadGatewayException("Failed to fetch weather data")
    );

    await expect(
      callFindWeather({ lat: 4, lon: 4 } as any)
    ).rejects.toBeInstanceOf(BadGatewayException);
    await callFindWeather({ lat: 4, lon: 4 } as any).catch(
      (e: BadGatewayException) => {
        expect(String(e.message)).toContain("Failed to fetch weather data");
      }
    );
  });
});
