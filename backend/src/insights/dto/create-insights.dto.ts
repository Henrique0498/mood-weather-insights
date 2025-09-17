import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FindWeatherDto } from "./find-weather.dto";

export class CreateInsightsDto extends FindWeatherDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsUUID()
  @IsNotEmpty()
  userId: UUID;
}
