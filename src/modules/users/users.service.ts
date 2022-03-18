import { PrismaService } from '@app/db';
import { hashPassword } from '@app/utils/password.utils';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserSelectDefaultValue } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = hashPassword(createUserDto.password);
    return (await this.prismaService.user.create({
      data: createUserDto,
      select: UserSelectDefaultValue,
    })) as User;
  }

  async findAll() {
    return (await this.prismaService.user.findMany({
      select: UserSelectDefaultValue,
    })) as Array<User>;
  }

  async findOne(id: number) {
    return (await this.prismaService.user.findUnique({
      where: { id: id },
      select: UserSelectDefaultValue,
    })) as User;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    return (await this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
      select: UserSelectDefaultValue,
    })) as User;
  }

  async removeOne(id: number) {
    await this.prismaService.user.delete({
      where: { id: id },
      select: { id: true },
    });
    return { message: 'User has been deleted' };
  }
}
