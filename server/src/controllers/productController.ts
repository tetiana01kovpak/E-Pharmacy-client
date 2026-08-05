import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { CATEGORIES } from '../constants/categories';
import { IProduct, Product } from '../models/Product';
import { HttpError } from '../utils/HttpError';

export async function getCategories(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ categories: CATEGORIES });
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const { category, search, minDiscount } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 12);

  const filter: FilterQuery<IProduct> = {};

  if (category && typeof category === 'string') {
    filter.category = category;
  }

  if (search && typeof search === 'string') {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  if (minDiscount) {
    filter.discountPercent = { $gte: Number(minDiscount) };
  }

  const totalItems = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ products, page, totalPages, totalItems });
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new HttpError(404, 'Product not found');
  }
  res.status(200).json({ product });
}
