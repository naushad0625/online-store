import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import IsValidPassword from 'src/utils/password.validator';

@Injectable()
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPassword()
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly role: string;
}
