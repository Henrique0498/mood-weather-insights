import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import axios from "axios";
import { FindInsightsDto } from "./dto/find-insights.dto";
import { OpenWeatherMapResponse } from "./types";

@Injectable()
export class InsightsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private readonly openWeatherKey = process.env.OPENWEATHER_KEY;
  private readonly openWeatherBaseUrl = process.env.OPENWEATHER_BASE_URL;

  private readonly apiClient = axios.create({
    baseURL: this.openWeatherBaseUrl,
    params: {
      appid: this.openWeatherKey,
      units: "metric",
      lang: "pt_br",
    },
  });

  async findWeather({ lat, lon }: FindInsightsDto) {
    const latKey = Number(lat).toFixed(2);
    const lonKey = Number(lon).toFixed(2);
    const key = `weather:${latKey}:${lonKey}`;
    const cached = await this.cache.get<OpenWeatherMapResponse>(key);

    if (cached) {
      return cached;
    }

    const res = await this.apiClient
      .get<OpenWeatherMapResponse>("/weather", {
        params: {
          lat,
          lon,
        },
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        throw new BadGatewayException(
          error.response?.data?.message || "Failed to fetch weather data"
        );
      });

    const data = res.data;

    await this.cache.set(key, data, 5 * 60 * 1000);

    return data;
  }
}
