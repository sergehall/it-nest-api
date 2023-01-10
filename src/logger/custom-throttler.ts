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
    if (originalUrl.slice(0, 5) === '/auth') {
      console.log(originalUrl, 'originalUrl');
      const userAgent = req.get('user-agent') || '';
      const message = `More than 5 attempts from one IP<${ip}> during 10 seconds.`;
      const count = await this.last10secReqRepository.addAndCountByIpAndTimeLog(
        ip,
        originalUrl,
        userAgent,
      );
      console.log(count, 'count');
      if (count > maxAttempts.FIVE) {
        throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
      }
    }
    next();
  }
}
