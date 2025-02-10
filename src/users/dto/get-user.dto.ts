import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  @IsNumber()
  id?: number;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email?: string;
}
