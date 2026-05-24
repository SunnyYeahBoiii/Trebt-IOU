import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.setGlobalPrefix('v1');

  if (!isProduction) {
    app.set('trust proxy', true);
  }

  const fromEnv = parseCorsOrigins(configService.get<string>('CORS_ORIGIN'));
  const devDefaults = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];
  const deployedFrontends = ['https://trebt-iou.vercel.app'];
  // Include localhost in all environments so a local UI can call a hosted API
  // (e.g. VITE_API_URL=https://trebt-iou-api.onrender.com while NODE_ENV=production on Render).
  const origin = [
    ...new Set([...devDefaults, ...deployedFrontends, ...fromEnv]),
  ];

  app.enableCors({
    origin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
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
