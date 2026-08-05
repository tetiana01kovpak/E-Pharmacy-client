import { Request, Response } from 'express';
import { CustomerReview } from '../models/CustomerReview';
import { ProductReview } from '../models/ProductReview';
import { HttpError } from '../utils/HttpError';

export async function getCustomerReviews(req: Request, res: Response): Promise<void> {
  const limit = Number(req.query.limit) || 10;
  const reviews = await CustomerReview.find().sort({ createdAt: 1 }).limit(limit);
  res.status(200).json({ reviews });
}

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 5);

  const filter = { product: id };
  const totalItems = await ProductReview.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  if (page > totalPages && totalItems > 0) {
    throw new HttpError(400, `Page ${page} exceeds total pages (${totalPages})`);
  }

  const reviews = await ProductReview.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ reviews, page, totalPages, totalItems });
}
