import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-refresh-jwt.repository';

@Injectable()
export class NoneStatusGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private blacklistJwtRepository: BlacklistJwtRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization, 'request.headers.authorization');
    if (!request.headers || !request.headers.authorization) {
      return true;
    }
    const token = request.headers.authorization.split(' ')[1];
    console.log(token, 'token NoneStatusGuard');
    const checkInBL = this.blacklistJwtRepository.findJWT(token);
    if (!checkInBL) {
      console.log(token, 'NoneStatusGuard');
      request.user = await this.authService.validAccessJWT(token);
    }
    return true;
  }
}
