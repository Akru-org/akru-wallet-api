import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import * as admin from 'firebase-admin';
import type { Connection } from 'mongoose';
import { AppModule } from './app.module';
import { paths } from './paths';

async function bootstrap() {
  let dbError: Error | null = null;

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:8080', 'https://akru-wallet.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  if (admin.apps.length === 0 && config.get('GOOGLE_APPLICATION_CREDENTIALS')) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);

  const connection = app.get<Connection>(getConnectionToken());
  connection.on('error', (err: Error) => {
    dbError = err;
  });
  console.log('Real readyState:', connection.readyState);
  const dbState = connection.readyState;

  const server = app.getHttpServer();
  const address = server.address();
  const listenPort = typeof address === 'object' && address !== null ? (address as { port: number }).port : port;
  const baseUrl = `http://localhost:${listenPort}`;

  console.log('\n--- Akru Wallet API ---');
  console.log(`1. API escuchando en: ${baseUrl} (puerto ${listenPort})`);

  const dbLabel = dbState === 1 ? 'conectada' : dbState === 2 ? 'conectando...' : 'no conectada';
  console.log(`2. Base de datos: ${dbLabel}`);

  console.log('available routes:', paths);
  console.log('------------------------\n');
}

bootstrap();
