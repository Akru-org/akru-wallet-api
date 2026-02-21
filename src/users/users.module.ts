import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncUserUseCase } from './use-cases/sync-user/sync-user.use-case';
import { SyncUserController } from './use-cases/sync-user/sync-user.controller';
import { UserMongoRepository } from './persistence/user.mongo.repository';
import { UserSchema, USER_MODEL_NAME } from './persistence/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL_NAME, schema: UserSchema },
    ]),
  ],
  controllers: [SyncUserController],
  providers: [
    SyncUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
  ],
  exports: [],
})
export class UsersModule {}
