import { Inject, Injectable } from '@nestjs/common';
import { AssetRepository } from '../../domain/asset.repository';
import type { AssetType, QuoteCurrency } from '../../domain/asset.types';

export interface ListAssetItemDto {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  quoteCurrency: QuoteCurrency;
  coingeckoId?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable()
export class ListAssetsUseCase {
  constructor(
    @Inject(AssetRepository)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(): Promise<ListAssetItemDto[]> {
    const assets = await this.assetRepository.findAll();
    return assets.map((asset) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      quoteCurrency: asset.quoteCurrency,
      coingeckoId: asset.coingeckoId,
      image: asset.image,
      isActive: asset.isActive,
      createdAt: asset.createdAt.toISOString(),
    }));
  }
}
