import { IPolicyHandler, AppAbility, CaslAction } from '..';

class _SessionUpdatePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Update, 'Session');
  }
}

export const SessionManagePolicy = () => new _SessionUpdatePolicy();
