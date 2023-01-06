import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Last10secReqRepository } from '../infrastructure/last10sec-req..repository';
import { Promise } from 'mongoose';
import { maxAttempts } from '../count-attempts.constants';

@Injectable()
export class LimitReqGuard implements CanActivate {
  constructor(private last10secReqRepository: Last10secReqRepository) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const message = {
      message: [
        {
          message: `More than 5 attempts from one IP-${request.ip} during 10 seconds.`,
        },
      ],
    };
    return this.last10secReqRepository
      .addAndCountByIpAndTimeLog(
        request.ip,
        request.originalUrl,
        request.get('user-agent'),
      )
      .then((i) => {
        if (i > maxAttempts) {
          throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
      });
  }
}
