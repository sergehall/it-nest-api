import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from './abilities.decorator';
import { ForbiddenError } from '@casl/ability';
import { currentUser } from '../current-user/current-user';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY,
      context.getHandler() || [],
    );
    // const {currentUser} = context.switchToHttp().getRequest();
    console.log(currentUser, 'context User');
    console.log(rules, 'rules');
    const ability = this.caslAbilityFactory.createForUser(currentUser);
    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}