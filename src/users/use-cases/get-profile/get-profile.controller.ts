import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { BaseController } from '../../../common/base-controller';
import { FirebaseAuthGuard } from '../../../common/guards/firebase-auth.guard';
import type { FirebaseUser } from '../../../common/guards/firebase-auth.guard';
import { GetProfileUseCase } from './get-profile.use-case';

@Controller('users')
export class GetProfileController extends BaseController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {
    super();
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(
    @Req() req: express.Request & { user: FirebaseUser },
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
      const data = await this.getProfileUseCase.execute(uid);
      if (!data) {
        this.handleError({
          res,
          error: new Error('Usuario no encontrado'),
          message: 'Usuario no encontrado',
          statusCode: 404,
        });
        return;
      }
      this.sendSuccess({ res, data, message: 'OK', statusCode: 200 });
    } catch (error) {
      const statusCode = (error as Error & { statusCode?: number })?.statusCode ?? 500;
      this.handleError({ res, error, statusCode });
    }
  }
}
