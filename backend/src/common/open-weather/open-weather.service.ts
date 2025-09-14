import { BadGatewayException, Injectable } from "@nestjs/common";
import axios from "axios";
import { OpenWeatherMapResponse } from "./types";

@Injectable()
export class OpenWeatherService {
  private readonly openWeatherKey = process.env.OPENWEATHER_KEY;
  private readonly openWeatherBaseUrl = process.env.OPENWEATHER_BASE_URL;

  private readonly apiOpenWeather = axios.create({
    baseURL: this.openWeatherBaseUrl,
    params: {
      appid: this.openWeatherKey,
      units: "metric",
      lang: "pt_br",
    },
  });

  findByLocation(lat: number, lon: number) {
    return this.apiOpenWeather
      .get<OpenWeatherMapResponse>("/weather", {
        params: {
          lat,
          lon,
        },
      })
      .catch((error) => {
        throw new BadGatewayException(
          error.response?.data?.message || "Failed to fetch weather data"
        );
      })
      .then((response) => response.data);
  }
}
