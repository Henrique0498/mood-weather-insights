import { CreateUserDto } from "@/user/dto/create-user.dto";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  confirmPassword: string;
}
