import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-refresh-jwt.repository';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtValidGuard implements CanActivate {
  constructor(
    private BlacklistJwtRepository: BlacklistJwtRepository,
    private AuthService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['refreshToken'];
    if (token) {
      const verify = await this.AuthService.validRefreshJWT(token);
      const checkInBL = await this.BlacklistJwtRepository.findJWT(token);
      if (!verify || checkInBL) {
        throw new HttpException(
          {
            message: [
              {
                message:
                  'JWT refreshToken inside cookie is missing, expired or incorrect',
                field: 'JWT',
              },
            ],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return true;
  }
}
