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

    if (responseBody.message.length !== 0) {
      response.status(status).json({
        errorsMessages: responseBody.message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        errorResponse: exception.getResponse(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
