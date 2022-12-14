import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Role } from '../../auth/roles/role.enum';
import { Action } from '../../auth/roles/action.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { User } from '../../types/types';

type Subjects = InferSubjects<typeof UserEntity> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);
    if (user.roles === Role.Admin) {
      can(Action.Manage, 'all'); // read-write access to everything
      cannot(Action.Manage, User, { orgId: { $ne: user.orgId } });
    } else {
      can(Action.Read, 'all');
      can(Action.Update, User, { id: user.id });
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
