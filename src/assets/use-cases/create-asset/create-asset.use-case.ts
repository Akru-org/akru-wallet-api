import { Inject, Injectable } from '@nestjs/common';
import { Asset } from '../../domain/asset.entity';
import { AssetRepository } from '../../domain/asset.repository';
import type { CreateAssetDto, CreateAssetResponseDto } from './create-asset.dto';

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(AssetRepository)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(dto: CreateAssetDto): Promise<CreateAssetResponseDto> {
    const symbolUpper = (dto.symbol ?? '').trim().toUpperCase();
    const existing = await this.assetRepository.findBySymbol(symbolUpper);
    if (existing) {
      const error = new Error(`Asset with symbol "${symbolUpper}" already exists`);
      (error as Error & { statusCode?: number }).statusCode = 409;
      throw error;
    }

    const asset = Asset.create({
      symbol: dto.symbol,
      name: dto.name,
      type: dto.type,
      quoteCurrency: dto.quoteCurrency ?? 'USD',
      coingeckoId: dto.coingeckoId,
      image: dto.image,
      isActive: true,
      createdAt: new Date(),
    });

    const created = await this.assetRepository.create(asset);
    return this.toResponseDto(created);
  }

  private toResponseDto(asset: Asset): CreateAssetResponseDto {
    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      quoteCurrency: asset.quoteCurrency,
      coingeckoId: asset.coingeckoId,
      image: asset.image,
      isActive: asset.isActive,
      createdAt: asset.createdAt.toISOString(),
    };
  }
}
