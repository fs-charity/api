import { PrismaService } from '@app/db';
import { hashPassword } from '@app/utils/password.utils';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = hashPassword(createUserDto.password);
    return new User(
      await this.prismaService.user.create({
        data: createUserDto,
      }),
    );
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
