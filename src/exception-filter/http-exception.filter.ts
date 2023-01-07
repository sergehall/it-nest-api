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
    if (
      responseBody.message.length !== 0 &&
      (status === HttpStatus.BAD_REQUEST ||
        status === HttpStatus.TOO_MANY_REQUESTS)
    ) {
      response.status(status).json({
        errorsMessages: responseBody.message,
      });
    } else if (
      responseBody.message.length !== 0 &&
      (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.NOT_FOUND)
    ) {
      response.status(status).json();
    } else if (
      responseBody.message.length !== 0 &&
      status === HttpStatus.FORBIDDEN
    ) {
      response.status(status).json({
        errorsMessages: {
          message: responseBody.message,
          field: responseBody.message.split('{')[1].split(':')[0],
        },
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: responseBody.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
