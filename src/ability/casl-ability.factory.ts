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
      can(Action.Manage, 'all');
      cannot(
        Action.Manage,
        'User',
        ({ orgId }) => orgId !== user.orgId,
      ).because('Because different organizations');
    } else {
      console.log(user, typeof user);
      can(Action.Read, 'all');
      can(Action.Create, 'all');
      can(Action.Update, 'User', ({ id }) => id === user.id);
      can(Action.Delete, 'User', ({ id }) => id === user.id);
      cannot(Action.Update, 'User', ({ orgId }) => orgId !== user.orgId);
      cannot(Action.Delete, 'User', ({ orgId }) => orgId !== user.orgId);
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
