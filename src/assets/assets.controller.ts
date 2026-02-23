import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import * as express from 'express';
import { BaseController } from '../common/base-controller';
import type { CreateAssetDto, CreateAssetResponseDto } from './use-cases/create-asset/create-asset.dto';
import { CreateAssetUseCase } from './use-cases/create-asset/create-asset.use-case';
import type { ListAssetItemDto } from './use-cases/list-assets/list-assets.use-case';
import { ListAssetsUseCase } from './use-cases/list-assets/list-assets.use-case';

@Controller('assets')
export class AssetsController extends BaseController {
  constructor(
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly listAssetsUseCase: ListAssetsUseCase,
  ) {
    super();
  }

  @Get()
  async list(@Res() res: express.Response): Promise<void> {
    try {
      const data: ListAssetItemDto[] = await this.listAssetsUseCase.execute();
      this.sendSuccess({ res, data, message: 'OK', statusCode: 200 });
    } catch (error) {
      this.handleError({ res, error });
    }
  }

  @Post()
  async create(
    @Body() body: CreateAssetDto,
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      const data: CreateAssetResponseDto = await this.createAssetUseCase.execute(body);
      this.sendSuccess({ res, data, message: 'Asset created', statusCode: 201 });
    } catch (error) {
      const statusCode = (error as Error & { statusCode?: number })?.statusCode ?? 500;
      this.handleError({ res, error, statusCode });
    }
  }
}
