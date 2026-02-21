import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncUserUseCase } from './use-cases/sync-user/sync-user.use-case';
import { SyncUserController } from './use-cases/sync-user/sync-user.controller';
import { UpdateUserUseCase } from './use-cases/update-user/update-user.use-case';
import { UpdateUserController } from './use-cases/update-user/update-user.controller';
import { GetProfileUseCase } from './use-cases/get-profile/get-profile.use-case';
import { GetProfileController } from './use-cases/get-profile/get-profile.controller';
import { UpdateKycUseCase } from './use-cases/update-kyc/update-kyc.use-case';
import { UpdateKycController } from './use-cases/update-kyc/update-kyc.controller';
import { UserMongoRepository } from './persistence/user.mongo.repository';
import { UserSchema, USER_MODEL_NAME } from './persistence/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL_NAME, schema: UserSchema },
    ]),
  ],
  controllers: [
    SyncUserController,
    UpdateUserController,
    GetProfileController,
    UpdateKycController,
  ],
  providers: [
    SyncUserUseCase,
    UpdateUserUseCase,
    GetProfileUseCase,
    UpdateKycUseCase,
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
  ],
  exports: [],
})
export class UsersModule {}
