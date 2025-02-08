import { ServerError } from '../../../../shared/domain/errors/server-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(ServerError)
export class ServerErrorFilter implements ExceptionFilter {
  catch(exception: ServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: exception.message,
    });
  }
}
