import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";

export class FindInsightsDto {
  @IsLatitude()
  @IsNotEmpty()
  readonly lat: number;

  @IsLongitude()
  @IsNotEmpty()
  readonly lon: number;
}
