import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const responseStatusCode = response.statusCode;

    const logString = `Logging HTTP request: -type: ${request.method} -url: ${request.url} -query: ${JSON.stringify(request.params)} -body: ${JSON.stringify(request.body)} -response status: ${responseStatusCode}}`;

    return next.handle().pipe(tap(() => this.loggingService.log(logString)));
  }
}
