import { NextFunction, Request, Response } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function ctrlWrapper(controller: Controller) {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
}
