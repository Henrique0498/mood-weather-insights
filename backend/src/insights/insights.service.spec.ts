import { Test, TestingModule } from '@nestjs/testing';
import { InsightsService } from './insights.service';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { BadGatewayException } from '@nestjs/common';

jest.mock('axios', () => {
  const get = jest.fn();
  return {
    __esModule: true,
    default: {
      create: () => ({ get }),
    },
  };
});

describe('InsightsService with cache', () => {
  let service: InsightsService;
  let cache: Cache;
  const axiosMock = require('axios').default;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    axiosMock.create().get.mockReset();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 5 * 60 * 1000 })],
      providers: [InsightsService],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and cache by rounded lat/lon key', async () => {
    axiosMock.create().get.mockResolvedValueOnce({ data: { weather: 'sunny' } });

    const dto = { lat: -23.55052, lon: -46.633308 } as any;

    const first = await service.findWeather(dto);
    expect(first).toEqual({ weather: 'sunny' });
    expect(axiosMock.create().get).toHaveBeenCalledTimes(1);

    // Slightly different coords but same rounded key
    const dto2 = { lat: -23.551, lon: -46.6337 } as any;
    const second = await service.findWeather(dto2);

    expect(second).toEqual({ weather: 'sunny' });
    // still 1 call due to cache hit
    expect(axiosMock.create().get).toHaveBeenCalledTimes(1);

    // Ensure cache contains the value under the rounded key
    const key = `weather:${Number(dto.lat).toFixed(2)}:${Number(dto.lon).toFixed(2)}`;
    await expect(cache.get(key)).resolves.toEqual({ weather: 'sunny' });
  });

  it('throws BadGatewayException with upstream message when provided', async () => {
    axiosMock.create().get.mockRejectedValueOnce({
      response: { data: { message: 'city not found' } },
    });

    try {
      await service.findWeather({ lat: 1, lon: 1 } as any);
      fail('expected to throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadGatewayException);
      expect(String(e.message)).toContain('city not found');
    }
  });

  it('throws BadGatewayException with default message on generic failure', async () => {
    axiosMock.create().get.mockRejectedValueOnce(new Error('boom'));

    try {
      await service.findWeather({ lat: 4, lon: 4 } as any);
      fail('expected to throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadGatewayException);
      expect(String(e.message)).toContain('Failed to fetch weather data');
    }
  });
});
