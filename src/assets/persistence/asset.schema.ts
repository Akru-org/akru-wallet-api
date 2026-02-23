import { Schema } from 'mongoose';
import type { AssetDocument } from './asset-document';

export const AssetSchema = new Schema<AssetDocument>(
  {
    _id: { type: String, required: true },
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['CRYPTO', 'ETF', 'VENEZUELA_STOCK'],
    },
    quoteCurrency: { type: String, required: true, enum: ['USD'] },
    coingeckoId: { type: String, required: false },
    image: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

export const ASSET_MODEL_NAME = 'Asset';
