import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";
import { UUID } from "crypto";

export class FindRecentTopicsDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: UUID;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number;
}
