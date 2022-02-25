import { Prisma, Role } from '@prisma/client';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsRoleArray } from 'src/common/validators';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @ArrayMinSize(1)
  @IsRoleArray()
  roles?: Prisma.UserCreaterolesInput | Prisma.Enumerable<Role> = [Role.USER];
}
