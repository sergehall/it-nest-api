import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
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
    if (responseBody.message.length !== 0 && status === 400) {
      response.status(status).json({
        errorsMessages: responseBody.message,
      });
    } else if (responseBody.message.length !== 0 && status === 401) {
      response.status(status);
    } else if (status === 404) {
      response.status(status).json();
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
