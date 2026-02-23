import type { AssetType, QuoteCurrency } from '../../domain/asset.types';

export interface CreateAssetDto {
  symbol: string;
  name: string;
  type: AssetType;
  quoteCurrency: QuoteCurrency;
  coingeckoId?: string;
  image?: string;
}

export interface CreateAssetResponseDto {
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
