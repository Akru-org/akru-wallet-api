import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Asset } from '../assets/domain/asset.entity';
import { AssetRepository } from '../assets/domain/asset.repository';
import type { AssetType } from '../assets/domain/asset.types';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const assetRepository = app.get(AssetRepository);

  const assets: Array<{
    symbol: string;
    name: string;
    type: AssetType;
    quoteCurrency: 'USD';
    coingeckoId: string;
    image: string;
  }> = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'CRYPTO',
      quoteCurrency: 'USD',
      coingeckoId: 'bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'CRYPTO',
      quoteCurrency: 'USD',
      coingeckoId: 'ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      type: 'CRYPTO',
      quoteCurrency: 'USD',
      coingeckoId: 'avalanche-2',
      image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      type: 'CRYPTO',
      quoteCurrency: 'USD',
      coingeckoId: 'tether',
      image: 'https://assets.coingecko.com/coins/images/3406/large/Tether-logo.png',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      type: 'CRYPTO',
      quoteCurrency: 'USD',
      coingeckoId: 'usd-coin',
      image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    },
  ];

  for (const assetData of assets) {
    const existing = await assetRepository.findBySymbol(assetData.symbol);

    if (!existing) {
      await assetRepository.create(Asset.create(assetData));
      console.log(`Created asset ${assetData.symbol}`);
    } else {
      console.log(`Asset ${assetData.symbol} already exists`);
    }
  }

  await app.close();
}

bootstrap();