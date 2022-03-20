import { SetMetadata } from '@nestjs/common';
import { CHECK_POLICIES_KEY, PolicyHandler } from '.';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
