import { Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { BaseController } from '../../../common/base-controller';
import { FirebaseAuthGuard } from '../../../common/guards/firebase-auth.guard';
import type { FirebaseUser } from '../../../common/guards/firebase-auth.guard';
import type { UpdateKycResponseDto } from './update-kyc.dto';
import { UpdateKycUseCase } from './update-kyc.use-case';

@Controller('users')
export class UpdateKycController extends BaseController {
  constructor(private readonly updateKycUseCase: UpdateKycUseCase) {
    super();
  }

  @Patch('me/kyc')
  @UseGuards(FirebaseAuthGuard)
  async updateKyc(
    @Req() req: express.Request & { user: FirebaseUser; body: { kycStatus?: string } },
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        this.handleError({
          res,
          error: new Error('No autorizado'),
          message: 'No autorizado',
          statusCode: 401,
        });
        return;
      }
      const kycStatus = req.body?.kycStatus;
      if (!kycStatus || typeof kycStatus !== 'string') {
        this.handleError({
          res,
          error: new Error('kycStatus es requerido'),
          message: 'kycStatus es requerido',
          statusCode: 400,
        });
        return;
      }
      const data = await this.updateKycUseCase.execute({ firebaseUid: uid, kycStatus });
      this.sendSuccess({ res, data, message: 'KYC actualizado', statusCode: 200 });
    } catch (error) {
      const statusCode = (error as Error & { statusCode?: number })?.statusCode ?? 500;
      this.handleError({ res, error, statusCode });
    }
  }
}
