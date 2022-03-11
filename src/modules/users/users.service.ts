import { PrismaService } from '@app/db';
import { hashPassword } from '@app/utils/password.utils';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserSelectDefaultValue } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    createUserDto.password = hashPassword(createUserDto.password);
    return this.prismaService.user.create({
      data: createUserDto,
      select: UserSelectDefaultValue,
    });
  }

  findAll() {
    return this.prismaService.user.findMany({
      select: UserSelectDefaultValue,
    });
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id: id },
      select: UserSelectDefaultValue,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
      select: UserSelectDefaultValue,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: { id: id },
      select: { id: true },
    });
  }
}
