import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const isProduction =
    configService.get<string>('NODE_ENV') === 'production';

  app.setGlobalPrefix('v1');

  if (!isProduction) {
    app.set('trust proxy', true);
  }

  app.enableCors({
    origin: configService.get<string>(
      'CORS_ORIGIN',
      'http://localhost:3000',
    ),
    credentials: true,
  });

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('TrebtIOU API')
      .setVersion('1.0.0')
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('v1/docs', app, document);
  }

  const port = configService.get<number>('PORT', 3002);
  await app.listen(port);
}

void bootstrap();
