import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { User } from '../users/schemas/user.schema';

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    if (user.roles === Role.Admin) {
      can(Action.MANAGE, 'all');
      cannot(
        Action.MANAGE,
        'User',
        ({ orgId }) => orgId !== user.orgId,
      ).because('Because different organizations');
    } else {
      console.log(user, typeof user, '----CaslAbilityFactory---');
      can(Action.READ, 'all');
      can(Action.CREATE, 'all');
      can(Action.UPDATE, 'User', ({ id }) => id === user.id);
      can(Action.DELETE, 'User', ({ id }) => id === user.id);
      cannot(Action.UPDATE, 'User', ({ orgId }) => orgId !== user.orgId);
      cannot(Action.DELETE, 'User', ({ orgId }) => orgId !== user.orgId);
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
