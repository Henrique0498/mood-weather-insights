import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";

export class FindWeatherDto {
  @IsLatitude()
  @IsNotEmpty()
  readonly lat: number;

  @IsLongitude()
  @IsNotEmpty()
  readonly lon: number;
}
