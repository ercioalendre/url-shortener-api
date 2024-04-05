import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { MainExceptionFilter } from '@common/filters';

interface AppErrorObject {
  code: string;
  message: string;
}

@Catch(HttpException)
export class HttpExceptionFilter
  extends MainExceptionFilter
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    Sentry.captureException(exception);

    const context = host.switchToHttp();

    const contextResponse = context.getResponse();

    const contextRequest = context.getRequest();

    const exceptionStatusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse() as AppErrorObject;

    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message;

    this.responseException(contextResponse, {
      statusCode: exceptionStatusCode,
      errorCode: exceptionResponse.code || `E${exceptionStatusCode}`,
      message: errorMessage,
      path: contextRequest.url,
    });
  }
}
