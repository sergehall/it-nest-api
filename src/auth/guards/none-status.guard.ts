import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class NoneStatusGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers || !request.headers.authorization) {
      return true;
    }
    const token = request.headers.authorization.split(' ')[1];
    request.user = await this.authService.validAccessJWT(token);
    return true;
  }
}
