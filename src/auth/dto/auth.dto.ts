import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthSignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthEmailDto {
  @IsEmail()
  email: string;
}
