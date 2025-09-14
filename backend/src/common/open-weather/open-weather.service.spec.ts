import { Test, TestingModule } from "@nestjs/testing";
import { OpenWeatherService } from "./open-weather.service";
import axios from "axios";
import { BadGatewayException } from "@nestjs/common";

jest.mock("axios", () => {
  const get = jest.fn();
  return {
    __esModule: true,
    default: {
      create: () => ({ get }),
    },
  };
});

describe("OpenWeatherService", () => {
  let service: OpenWeatherService;
  const axiosMock = axios as any;

  beforeEach(async () => {
    axiosMock.create().get.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenWeatherService],
    }).compile();

    service = module.get<OpenWeatherService>(OpenWeatherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("returns data on success", async () => {
    const payload = {
      weather: [{ description: "clear sky" }],
      main: { temp: 25 },
    } as any;
    axiosMock.create().get.mockResolvedValueOnce({ data: payload });

    await expect(service.findByLocation(-23.5, -46.6)).resolves.toEqual(
      payload
    );
    expect(axiosMock.create().get).toHaveBeenCalledWith("/weather", {
      params: { lat: -23.5, lon: -46.6 },
    });
  });

  it("throws BadGatewayException with upstream message", async () => {
    axiosMock.create().get.mockRejectedValueOnce({
      response: { data: { message: "city not found" } },
    });

    try {
      await service.findByLocation(0, 0);
      fail("Expected to throw");
    } catch (e) {
      expect(e).toBeInstanceOf(BadGatewayException);
      expect(String((e as Error).message)).toContain("city not found");
    }
  });
});
