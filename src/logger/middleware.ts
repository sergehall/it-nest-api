import { Injectable, Logger, NestMiddleware, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpExceptionFilter } from '../exception-filter/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    req.on('finish: ', () => {
      const { statusCode } = req;
      const contentLength = req.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    // const params = req.params;
    // const query = req.query;
    // console.log('body: ', body);
    // console.log('params: ', params);
    // console.log('query: ', query);
    console.log('Logger', method, originalUrl);
    next();
  }
}
