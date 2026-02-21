import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
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

  const credentialsJson = config.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
  const credentialsPath = config.get<string>('GOOGLE_APPLICATION_CREDENTIALS_PATH');

  if (!admin.apps.length) {
    if (credentialsJson) {
      console.log('[Firebase Admin] Inicializando desde JSON en variable de entorno');
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(credentialsJson) as admin.ServiceAccount),
      });
    } else if (credentialsPath) {
      console.log('[Firebase Admin] Inicializando desde archivo local');
      const serviceAccount = JSON.parse(
        fs.readFileSync(credentialsPath, 'utf8'),
      ) as admin.ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      throw new Error(
        '[Firebase Admin] No se encontraron credenciales. Define GOOGLE_APPLICATION_CREDENTIALS (JSON completo) o GOOGLE_APPLICATION_CREDENTIALS_PATH (ruta al archivo).',
      );
    }
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
