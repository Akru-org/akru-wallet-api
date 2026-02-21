import type { Response } from 'express';
import { HttpException } from '@nestjs/common';
import type { ISuccess, IError } from './interfaces/success.interface';

export abstract class BaseController {
  /**
   * Envía una respuesta exitosa estandarizada.
   */
  protected sendSuccess<T>({ res, data, message = 'OK', statusCode = 200 }: ISuccess<T>): void {
    res.status(statusCode).json({ data, message, statusCode });
  }

  /**
   * Maneja errores y envía una respuesta de error estandarizada.
   */
  protected handleError({ res, error, message, statusCode }: IError): void {
    let _statusCode =
      statusCode ??
      (error instanceof HttpException ? error.getStatus() : (error as { statusCode?: number })?.statusCode) ??
      500;
    if (_statusCode === 500 && (error as Error)?.name === 'InvalidEmailError') {
      _statusCode = 400;
    }
    const msg =
      message ??
      (error instanceof HttpException
        ? (typeof error.getResponse() === 'object' && (error.getResponse() as { message?: string }).message) ||
          error.message
        : (error as Error)?.message) ??
      'Error inesperado';
    res.status(_statusCode).json({ data: null, message: msg, statusCode: _statusCode });
  }
}
