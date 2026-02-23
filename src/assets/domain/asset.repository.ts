import { Asset } from './asset.entity';

export abstract class AssetRepository {
  abstract create(asset: Asset): Promise<Asset>;
  abstract findAll(): Promise<Asset[]>;
  abstract findBySymbol(symbol: string): Promise<Asset | null>;
}
