import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, body, headers } = request;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const getResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = getResponse['message'];

    const errorLog = {
      method,
      url: originalUrl,
      status,
      message,
      body,
      headers: {
        'user-agent': headers['user-agent'],
        'x-forwarded-for': headers['x-forwarded-for'],
      },
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    // if (status >= 500) {
    //   this.logger.error(
    //     `${method} ${originalUrl} ${status} ${message}`,
    //     errorLog,
    //   );
    // } else if (status >= 400) {
    //   if (originalUrl !== '/log') {
    //     this.logger.warn(
    //       `${method} ${originalUrl} ${status} ${message}`,
    //       errorLog,
    //     );
    //   }
    // }

    response.status(status).json(getResponse);
  }
}
