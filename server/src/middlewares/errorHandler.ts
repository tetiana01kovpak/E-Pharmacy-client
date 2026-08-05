import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/HttpError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      code: err.code,
      errors: err.errors,
    });
    return;
  }

  console.error(err);
  res.status(500).json({ status: 500, message: 'Internal server error' });
}
