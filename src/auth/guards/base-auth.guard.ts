import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { statusCode } from '../../logger/status-code.enum';
import * as process from 'process';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const exceptedAuthInput = 'Basic ' + process.env.BASIC_AUTH;
    if (!request.headers || !request.headers.authorization) {
      throw new UnauthorizedException([{ message: 'No any auth headers' }]);
    } else {
      if (request.headers.authorization != exceptedAuthInput) {
        throw new HttpException(
          {
            message: [
              {
                message: 'Login or password invalid',
                field: 'auth headers',
              },
            ],
          },
          statusCode.UNAUTHORIZED,
        );
      }
      return true;
    }
  }
}
