import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-jwt.repository';
import { jwtCookiesIncorrect } from '../../exception-filter/errors-messages';

@Injectable()
export class CookiesJwtVerificationGuard implements CanActivate {
  constructor(
    private blacklistJwtRepository: BlacklistJwtRepository,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['refreshToken'];
    if (token) {
      const verify = await this.authService.validRefreshJWT(token);
      const checkInBL = await this.blacklistJwtRepository.findJWT(token);
      if (verify && !checkInBL) {
        return true;
      }
    }
    throw new HttpException(
      { message: [jwtCookiesIncorrect] },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
