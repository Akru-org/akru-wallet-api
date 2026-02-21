import type { Response } from 'express';

export interface ISuccess<T = unknown> {
  res: Response;
  data: T;
  message?: string;
  statusCode?: number;
}

export interface IError {
  res: Response;
  error: unknown;
  message?: string;
  statusCode?: number;
}

export interface IResponsePayload<T = unknown> {
  data: T;
  message: string;
  statusCode: number;
}
