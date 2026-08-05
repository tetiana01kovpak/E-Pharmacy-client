import { Document, Schema, Types, model } from 'mongoose';

export interface IProductReview extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  authorName: string;
  avatarUrl: string;
  rating: number;
  text: string;
  createdAt: Date;
}

const productReviewSchema = new Schema<IProductReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    authorName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

productReviewSchema.index({ product: 1, createdAt: -1 });

export const ProductReview = model<IProductReview>('ProductReview', productReviewSchema);
