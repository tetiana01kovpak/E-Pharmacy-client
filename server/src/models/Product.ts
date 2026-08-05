import { Document, Schema, Types, model } from 'mongoose';
import { CATEGORIES } from '../constants/categories';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPercent: number;
  image: string;
  avgRating: number;
  reviewsCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    image: { type: String, required: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);
