import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
/**
 * 2023/03/09 한영광
 * 서버 로깅 미들웨어
 */
import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = request;
    const reqAddress = `${request.headers['x-forwarded-for'] || request.socket.remoteAddress}`;
    response.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');
      // if (statusCode >= 500) {
      // } else if (statusCode >= 400 && statusCode < 500) {
      // } else {
      // }
      let durationMsg;
      if(duration >= 5000){
        durationMsg = '#5000up'
        this.logger.warn(`${method} ${originalUrl} ${statusCode} ${contentLength} ${statusMessage} took ${duration}ms #5000up`);
      }else{
        this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} ${statusMessage} took ${duration}ms`);
      }
    });
    next();
  }
}
