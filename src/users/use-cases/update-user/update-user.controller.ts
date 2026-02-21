import { Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { BaseController } from '../../../common/base-controller';
import { FirebaseAuthGuard } from '../../../common/guards/firebase-auth.guard';
import type { FirebaseUser } from '../../../common/guards/firebase-auth.guard';
import type { UpdateUserResponseDto } from './update-user.dto';
import { UpdateUserUseCase } from './update-user.use-case';

@Controller('users')
export class UpdateUserController extends BaseController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {
    super();
  }

  @Patch('me')
  @UseGuards(FirebaseAuthGuard)
  async updateMe(
    @Req() req: express.Request & { user: FirebaseUser; body: { alias?: string } },
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
      const alias = req.body?.alias ?? '';
      const data = await this.updateUserUseCase.execute({ firebaseUid: uid, alias });
      this.sendSuccess({ res, data, message: 'Usuario actualizado', statusCode: 200 });
    } catch (error) {
      const statusCode = (error as Error & { statusCode?: number })?.statusCode ?? 500;
      this.handleError({ res, error, statusCode });
    }
  }
}
