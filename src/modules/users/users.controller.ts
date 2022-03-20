import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CaslPoliciesGuard,
  CheckPolicies,
  UserCreatePolicy,
  UserReadPolicy,
  UserUpdatePolicy,
} from '@app/casl';
import { Public } from 'src/common/decorators/public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  // @UseGuards(CaslPoliciesGuard)
  // @CheckPolicies(UserCreatePolicy())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(CaslPoliciesGuard)
  @CheckPolicies(UserReadPolicy())
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(CaslPoliciesGuard)
  @CheckPolicies(UserReadPolicy())
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(CaslPoliciesGuard)
  @CheckPolicies(UserUpdatePolicy())
  updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(CaslPoliciesGuard)
  @CheckPolicies(UserUpdatePolicy())
  removeOne(@Param('id') id: string) {
    return this.usersService.removeOne(+id);
  }
}
