import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset } from '../domain/asset.entity';
import { AssetRepository } from '../domain/asset.repository';
import { AssetMapper } from './asset.mapper';
import { ASSET_MODEL_NAME } from './asset.schema';
import type { AssetDocument } from './asset-document';

@Injectable()
export class AssetMongoRepository extends AssetRepository {
  constructor(
    @InjectModel(ASSET_MODEL_NAME)
    private readonly model: Model<AssetDocument>,
  ) {
    super();
  }

  async create(asset: Asset): Promise<Asset> {
    const persistence = AssetMapper.toPersistence(asset);
    await this.model.create({
      _id: persistence.id,
      symbol: persistence.symbol,
      name: persistence.name,
      type: persistence.type,
      quoteCurrency: persistence.quoteCurrency,
      coingeckoId: persistence.coingeckoId,
      image: persistence.image,
      isActive: persistence.isActive,
      createdAt: persistence.createdAt,
    });
    return asset;
  }

  async findAll(): Promise<Asset[]> {
    const docs = await this.model.find({ isActive: true }).sort({ symbol: 1 }).exec();
    return docs.map((doc) => AssetMapper.toDomain(doc as AssetDocument));
  }

  async findBySymbol(symbol: string): Promise<Asset | null> {
    const normalized = (symbol ?? '').trim().toUpperCase();
    if (!normalized) return null;
    const doc = await this.model.findOne({ symbol: normalized }).exec();
    if (!doc) return null;
    return AssetMapper.toDomain(doc as AssetDocument);
  }
}
