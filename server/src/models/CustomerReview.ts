import { Document, Schema, Types, model } from 'mongoose';

export interface ICustomerReview extends Document {
  _id: Types.ObjectId;
  name: string;
  avatarUrl: string;
  quote: string;
  createdAt: Date;
}

const customerReviewSchema = new Schema<ICustomerReview>(
  {
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    quote: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CustomerReview = model<ICustomerReview>('CustomerReview', customerReviewSchema);
