import { RefreshToken, User } from '@prisma/client';
import { PrismaAbility, Subjects, PrismaQuery, Model } from '@casl/prisma';

export class SubjectRecord {
  User: User;
  RefreshToken: RefreshToken;
  all: 'all';
}

export type AppAbility = PrismaAbility<
  [CaslAction, Subjects<SubjectRecord>],
  PrismaQuery
>;

export enum CaslAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
