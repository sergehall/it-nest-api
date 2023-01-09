import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlacklistJwtRepository } from '../infrastructure/blacklist-jwt.repository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private blacklistJwtRepository: BlacklistJwtRepository) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers || request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      const checkInBL = this.blacklistJwtRepository.findJWT(token);
      checkInBL.then((success) => {
        if (success) {
          throw new HttpException(
            {
              message: [
                {
                  message:
                    'JWT refreshToken inside headers.authorization is missing, expired or incorrect',
                  field: 'JWT',
                },
              ],
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      });
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
