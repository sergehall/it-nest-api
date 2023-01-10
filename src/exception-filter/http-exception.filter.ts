import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const responseBody: any = exception.getResponse();
    if (HttpStatus.TOO_MANY_REQUESTS) {
      response.status(status).json({
        statusCode: status,
        message: responseBody,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }
    if (
      responseBody.message.length !== 0 &&
      status === HttpStatus.BAD_REQUEST
    ) {
      response.status(status).json({
        errorsMessages: responseBody.message,
      });
      return;
    }
    if (
      responseBody.message.length !== 0 &&
      (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.NOT_FOUND)
    ) {
      response.status(status).json();
      return;
    }
    response.status(status).json({
      statusCode: status,
      message: responseBody.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
