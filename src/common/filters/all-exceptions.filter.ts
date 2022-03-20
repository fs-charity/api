import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        let target: string = (exception.meta as any)?.target?.toString() ?? [];
        message = `Unique constraint failed on: ${target}`;
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      error:
        exception?.response?.error ?? exception.error ?? exception.code ?? null,
      message:
        message ?? exception?.response?.message ?? exception.message ?? null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
