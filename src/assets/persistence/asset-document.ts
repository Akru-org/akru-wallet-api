export interface AssetDocument {
  _id: string;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'ETF' | 'VENEZUELA_STOCK';
  quoteCurrency: 'USD';
  coingeckoId?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
}
