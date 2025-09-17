import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class DeleteTopicDto {
  @IsUUID()
  @IsNotEmpty()
  userId: UUID;

  @IsString()
  @IsNotEmpty()
  topic: string;
}
