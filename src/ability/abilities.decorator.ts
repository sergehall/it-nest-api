import { SetMetadata } from '@nestjs/common';
import { Action } from '../auth/roles/action.enum';
import { Subject } from '@casl/ability';
import { User } from '../current-user/current-user';

export interface RequiredRule {
  action: Action;
  subject: Subject;
}
export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export class ReadUserAbility implements RequiredRule {
  action = Action.Read;
  subject = User;
}

// example in Controller under the decorator @Post, @Get, ...
// @Post
// @UseGuards(AbilitiesGuard)
//@CheckAbilities(new ReadUserAbility())
