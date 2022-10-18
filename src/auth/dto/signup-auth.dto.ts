import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpAuthDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
