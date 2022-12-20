import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { UserType } from '../types/types';

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserType) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    if (user.roles === Role.Admin) {
      can(Action.MANAGE, 'all');
      cannot(
        Action.CREATE,
        'User',
        ({ orgId }) => orgId !== user.orgId,
      ).because('Because different organizations');
    } else {
      console.log(user, typeof user);
      can(Action.READ, 'all');
      can(Action.CREATE, 'all');
      can(Action.UPDATE, 'all', ({ id }) => id === user.id);
      can(Action.DELETE, 'all', ({ id }) => id === user.id);
      cannot(Action.UPDATE, 'all', ({ orgId }) => orgId !== user.orgId);
      cannot(Action.CREATE, 'all', ({ orgId }) => orgId !== user.orgId);
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
