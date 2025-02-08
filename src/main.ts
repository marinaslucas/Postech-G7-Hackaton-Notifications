import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { applyGlobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multipart from '@fastify/multipart';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(multipart, {
    attachFieldsToBody: true,
    limits:{
      fileSize: 100 * 1024 * 1024, // 100 MB
    }
  });

  const config = new DocumentBuilder()
    .setTitle('FIAP - Fase 5: Hackaton')
    .setDescription('Video Processing')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Informar token JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'bearer',
      type: 'http',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app); //interceptors
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
