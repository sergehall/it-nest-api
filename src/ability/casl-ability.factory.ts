import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { User } from '../types/types';

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    if (user.roles === Role.Admin) {
      can(Action.Manage, 'all');
      cannot(Action.Manage, User, ({ orgId }) => orgId !== user.orgId);
    } else {
      can(Action.Read, 'all');
      can(Action.Create, 'all');
      can(Action.Update, User, ({ id }) => id === user.id);
      cannot(Action.Delete, User).because('Only admins!');
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
