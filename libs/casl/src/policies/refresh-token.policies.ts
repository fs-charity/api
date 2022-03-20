import { IPolicyHandler, AppAbility, CaslAction } from '..';

class _RefreshTokenUpdatePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Update, 'RefreshToken');
  }
}

export const RefreshTokenManagePolicy = () => new _RefreshTokenUpdatePolicy();
