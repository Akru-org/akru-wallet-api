import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LedgerModule } from './ledger/ledger.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI') ?? 'mongodb://localhost:27017/akru-wallet';

        console.log('Intentando conectar a MongoDB...');
        console.log('URI:', uri);

        return {
          uri,
          connectionFactory: (connection: { on: (event: string, fn: (...args: unknown[]) => void) => void }) => {
            connection.on('connected', () => {
              console.log('🔥 MongoDB conectado correctamente');
            });

            connection.on('error', (err: Error) => {
              console.error('❌ Error en MongoDB:', err);
            });

            connection.on('disconnected', () => {
              console.warn('⚠️ MongoDB desconectado');
            });

            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    UsersModule,
    AssetsModule,
    TransactionsModule,
    LedgerModule,
  ],
})
export class AppModule {}
