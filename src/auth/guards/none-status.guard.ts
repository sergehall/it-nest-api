import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-refresh-jwt.repository';

@Injectable()
export class NoneStatusGuard implements CanActivate {
  constructor(
    private AuthService: AuthService,
    private BlacklistJwtRepository: BlacklistJwtRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers || !request.headers.authorization) {
      return true;
    }
    const token = request.headers.authorization.split(' ')[1];
    const checkInBL = this.BlacklistJwtRepository.findJWT(token);
    if (!checkInBL) {
      request.user = await this.AuthService.validAccessJWT(token);
    }
    return true;
  }
}
