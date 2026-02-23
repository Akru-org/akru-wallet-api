import { Asset } from '../domain/asset.entity';
import type { AssetType, QuoteCurrency } from '../domain/asset.types';
import type { AssetDocument } from './asset-document';

export class AssetMapper {
  static toDomain(doc: AssetDocument): Asset {
    return Asset.create({
      id: doc._id.toString(),
      symbol: doc.symbol,
      name: doc.name,
      type: doc.type as AssetType,
      quoteCurrency: doc.quoteCurrency as QuoteCurrency,
      coingeckoId: doc.coingeckoId,
      image: doc.image,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(asset: Asset): {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    quoteCurrency: QuoteCurrency;
    coingeckoId?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
  } {
    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      quoteCurrency: asset.quoteCurrency,
      coingeckoId: asset.coingeckoId,
      image: asset.image,
      isActive: asset.isActive,
      createdAt: asset.createdAt,
    };
  }
}
