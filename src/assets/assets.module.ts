import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetRepository } from './domain/asset.repository';
import { AssetMongoRepository } from './persistence/asset.mongo.repository';
import { AssetSchema, ASSET_MODEL_NAME } from './persistence/asset.schema';
import { CreateAssetUseCase } from './use-cases/create-asset/create-asset.use-case';
import { ListAssetsUseCase } from './use-cases/list-assets/list-assets.use-case';
import { AssetsController } from './assets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ASSET_MODEL_NAME, schema: AssetSchema },
    ]),
  ],
  controllers: [AssetsController],
  providers: [
    CreateAssetUseCase,
    ListAssetsUseCase,
    {
      provide: AssetRepository,
      useClass: AssetMongoRepository,
    },
  ],
  exports: [],
})
export class AssetsModule {}
