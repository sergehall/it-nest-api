import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Role } from '../auth/roles/role.enum';
import { Action } from '../auth/roles/action.enum';
import { UserIdEntity } from '../comments/entities/userId.entity';
import { PostsIdEntity } from '../posts/entities/postsId.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { BlogIdEntity } from '../blogs/entities/blogsId.entity';

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UsersEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    if (user.roles === Role.Admin) {
      can(Action.MANAGE, 'all');
      cannot(
        Action.CREATE,
        'User',
        ({ orgId }) => orgId !== user.orgId,
      ).because('Because different organizations');
    } else {
      can(Action.READ, 'all');
      can(Action.CREATE, 'all');
      can(Action.UPDATE, 'all', ({ id }) => id === user.id);
      can(Action.DELETE, 'all', ({ id }) => id === user.id);
      cannot(Action.UPDATE, 'all', ({ orgId }) => orgId !== user.orgId);
      cannot(Action.CREATE, 'all', ({ orgId }) => orgId !== user.orgId);
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
  createForBlog(blog: BlogIdEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    can(Action.READ, 'all');
    can(Action.CREATE, 'all');
    can(Action.UPDATE, 'all', ({ id }) => id === blog.id);
    can(Action.DELETE, 'all', ({ id }) => id === blog.id);
    return build({ conditionsMatcher: lambdaMatcher });
  }
  createForPost(post: PostsIdEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    can(Action.READ, 'all');
    can(Action.CREATE, 'all');
    can(Action.UPDATE, 'all', ({ id }) => id === post.id);
    can(Action.DELETE, 'all', ({ id }) => id === post.id);
    return build({ conditionsMatcher: lambdaMatcher });
  }
  createForComments(user: UserIdEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    can(Action.READ, 'all');
    can(Action.CREATE, 'all');
    can(Action.UPDATE, 'all', ({ id }) => id === user.id);
    can(Action.DELETE, 'all', ({ id }) => id === user.id);
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
