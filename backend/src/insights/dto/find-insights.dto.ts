import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class FindInsightsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: UUID;

  @IsString()
  @IsOptional()
  topic?: string;
}
