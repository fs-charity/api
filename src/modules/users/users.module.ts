import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@app/db/prisma.service';
import { CaslAbilityFactory } from '@app/casl';
@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CaslAbilityFactory],
})
export class UsersModule {}
