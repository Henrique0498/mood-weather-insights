export type OpenWeatherMapResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: TypeWeather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
    country?: string;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

type TypeWeather = {
    id: number;
    main: string;
    description: string;
    icon: string;
};