import { randomUUID } from 'crypto';
import type { AssetType, QuoteCurrency } from './asset.types';

export class Asset {
  private constructor(
    private readonly _id: string,
    private readonly _symbol: string,
    private readonly _name: string,
    private readonly _type: AssetType,
    private readonly _quoteCurrency: QuoteCurrency,
    private readonly _coingeckoId: string | undefined,
    private readonly _image: string | undefined,
    private readonly _isActive: boolean,
    private readonly _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }
  get symbol(): string {
    return this._symbol;
  }
  get name(): string {
    return this._name;
  }
  get type(): AssetType {
    return this._type;
  }
  get quoteCurrency(): QuoteCurrency {
    return this._quoteCurrency;
  }
  get coingeckoId(): string | undefined {
    return this._coingeckoId;
  }
  get image(): string | undefined {
    return this._image;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  static create(props: {
    id?: string;
    symbol: string;
    name: string;
    type: AssetType;
    quoteCurrency: QuoteCurrency;
    coingeckoId?: string;
    image?: string;
    isActive?: boolean;
    createdAt?: Date;
  }): Asset {
    const symbol = (props.symbol ?? '').trim().toUpperCase();
    if (!symbol) {
      throw new Error('Asset symbol is required');
    }
    if (!(props.name ?? '').trim()) {
      throw new Error('Asset name is required');
    }
    const validTypes: AssetType[] = ['CRYPTO', 'ETF', 'VENEZUELA_STOCK'];
    if (!validTypes.includes(props.type)) {
      throw new Error(`Invalid asset type: ${props.type}`);
    }
    const id = props.id ?? randomUUID();
    return new Asset(
      id,
      symbol,
      props.name.trim(),
      props.type,
      props.quoteCurrency ?? 'USD',
      props.coingeckoId?.trim() || undefined,
      props.image?.trim() || undefined,
      props.isActive ?? true,
      props.createdAt ?? new Date(),
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      symbol: this._symbol,
      name: this._name,
      type: this._type,
      quoteCurrency: this._quoteCurrency,
      coingeckoId: this._coingeckoId,
      image: this._image,
      isActive: this._isActive,
      createdAt: this._createdAt instanceof Date ? this._createdAt.toISOString() : this._createdAt,
    };
  }
}
