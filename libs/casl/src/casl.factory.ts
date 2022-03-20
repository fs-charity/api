import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { AppAbility, CaslAction, SubjectRecord } from '.';
import { JwtPayloadWithRefreshToken } from 'src/auth/entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: JwtPayloadWithRefreshToken) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PrismaAbility as AbilityClass<AppAbility>,
    );

    can(CaslAction.Read, 'User');

    if (user.roles.includes(Role.ADMIN)) {
      can(CaslAction.Manage, 'all'); // read-write access to everything
    } else if (user.roles.includes(Role.USER)) {
      can(CaslAction.Update, 'User', { id: user.sub });
      can(CaslAction.Update, 'RefreshToken', { userId: user.sub });
      can(CaslAction.Delete, 'RefreshToken', { userId: user.sub });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<
          Subjects<SubjectRecord>
        >,
    });
  }
}
