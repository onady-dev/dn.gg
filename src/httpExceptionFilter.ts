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
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl } = request;
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const getResponse =
      exception instanceof HttpException ? exception.getResponse() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = getResponse['message'];

    if (status >= 500) {
      this.logger.error(`${method} ${originalUrl} ${status} 
      body: ${JSON.stringify(request.body)}`);
      // 이메일전송 너무 많아서 550 Error: Your mail-counter is over 발생으로 주석처리
      // this.emailService.errorEmailSend(`${method} ${originalUrl} ${status}`, exception['stack']);
    } else if (status >= 400 && status < 500) {
      if (originalUrl !== '/log') {
          this.logger.warn(`${method} ${originalUrl} ${status} 
          ${message} 
          body: ${JSON.stringify(
            request.body
          )}`);
      }
    }
    response.status(status).json(getResponse);
  }
}
