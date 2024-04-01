import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as Sentry from '@sentry/node';
import { MainExceptionFilter } from './main.exception.filter';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  extends MainExceptionFilter
  implements ExceptionFilter
{
  public catch(exception: any, host: ArgumentsHost) {
    Sentry.captureException(exception);

    const context = host.switchToHttp();

    const contextResponse = context.getResponse();

    const contextRequest = context.getRequest();

    this.responseException(contextResponse, {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      errorCode: `E${HttpStatus.SERVICE_UNAVAILABLE}`,
      message: 'Service unavailable.',
      path: contextRequest.url,
    });
  }
}
