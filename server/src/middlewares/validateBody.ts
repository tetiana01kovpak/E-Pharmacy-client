import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';
import { HttpError } from '../utils/HttpError';

export function validateBody(schema: AnySchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        next(new HttpError(400, 'Validation failed', { errors: err.errors }));
        return;
      }
      next(err);
    }
  };
}
