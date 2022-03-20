import { AppAbility, CaslAction, IPolicyHandler } from '..';

class _UserCreatePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Create, 'User');
  }
}

class _UserReadPolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Read, 'User');
  }
}

class _UserUpdatePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Update, 'User');
  }
}

class _UserDeletePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Delete, 'User');
  }
}

export const UserCreatePolicy = () => new _UserCreatePolicy();
export const UserReadPolicy = () => new _UserReadPolicy();
export const UserUpdatePolicy = () => new _UserUpdatePolicy();
export const UserDeletePolicy = () => new _UserDeletePolicy();
