import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../exception-filter/http-exception.filter';
import { Last10secReqRepository } from '../auth/infrastructure/last10sec-req..repository';
import { Request, Response, NextFunction } from 'express';
import { maxAttempts } from '../auth/count-attempts.constants';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CustomThrottler implements NestMiddleware {
  constructor(private last10secReqRepository: Last10secReqRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { ip, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    if (originalUrl.slice(0, 5) === '/auth') {
      const count = await this.last10secReqRepository.addAndCountIpLast10Sec(
        ip,
        originalUrl,
        userAgent,
      );
      console.log('-------------------------------------------');
      console.log(originalUrl);
      console.log(count);
      console.log('-------------------------------------------');
      if (count > maxAttempts.FIVE) {
        throw new HttpException(
          `More than 5 attempts from one IP<${ip}> during 10 seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
    next();
  }
}
