import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-jwt.repository';
import { UsersService } from '../../users/users.service';

@Injectable()
export class NoneStatusGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private blacklistJwtRepository: BlacklistJwtRepository,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers || !request.headers.authorization) {
      return true;
    }
    const token = request.headers.authorization.split(' ')[1];
    const checkInBL = await this.blacklistJwtRepository.findJWT(token);
    const payload = await this.authService.validAccessJWT(token);
    if (!checkInBL && payload) {
      request.user = await this.usersService.findUserByUserId(payload.userId);
    }
    return true;
  }
}
