import { Injectable, NestMiddleware, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // const body = req.body;
    // const params = req.params;
    // const query = req.query;
    // console.log('body: ', body);
    // console.log('params: ', params);
    // console.log('query: ', query);
    console.log('Request...');
    next();
  }
}
