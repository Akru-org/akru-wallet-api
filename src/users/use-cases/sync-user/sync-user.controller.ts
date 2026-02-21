import { Controller, Post, Req, Res } from '@nestjs/common';
import * as express from 'express';
import { BaseController } from '../../../common/base-controller';
import type { SyncUserDto } from './sync-user.dto';
import { SyncUserUseCase } from './sync-user.use-case';

@Controller('users')
export class SyncUserController extends BaseController {
  constructor(private readonly syncUserUseCase: SyncUserUseCase) {
    super();
  }

  @Post('sync')
  async sync(
    @Req() req: express.Request & { body: { uid?: string; email?: string; alias?: string } },
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      const { uid, email, alias } = req.body ?? {};
      if (!uid || !email) {
        this.handleError({
          res,
          error: new Error('uid y email son requeridos'),
          message: 'uid y email son requeridos',
          statusCode: 400,
        });
        return;
      }
      const data = await this.syncUserUseCase.execute({
        firebaseUid: uid,
        email,
        alias: alias ?? '',
      });
      this.sendSuccess({ res, data, message: 'Usuario sincronizado', statusCode: 200 });
    } catch (error) {
      this.handleError({ res, error, statusCode: 500 });
    }
  }
}
