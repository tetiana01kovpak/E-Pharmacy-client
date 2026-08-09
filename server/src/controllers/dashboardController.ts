import { Request, Response } from 'express';
import { FinanceEntry } from '../models/FinanceEntry';
import { Supplier } from '../models/Supplier';

export async function getSuppliers(_req: Request, res: Response): Promise<void> {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.status(200).json({ suppliers });
}

export async function getFinanceEntries(_req: Request, res: Response): Promise<void> {
  const entries = await FinanceEntry.find();
  res.status(200).json({ entries });
}
