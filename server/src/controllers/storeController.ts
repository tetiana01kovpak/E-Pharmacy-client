import { Request, Response } from 'express';
import { Store } from '../models/Store';

export async function getNearestStores(_req: Request, res: Response): Promise<void> {
  const stores = await Store.aggregate([{ $sample: { size: 6 } }]);
  res.status(200).json({ stores });
}

export async function getStores(_req: Request, res: Response): Promise<void> {
  const stores = await Store.find().sort({ name: 1 });
  res.status(200).json({ stores });
}
