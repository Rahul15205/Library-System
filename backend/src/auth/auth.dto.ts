import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
