import { Document, Schema, Types, model } from 'mongoose';

export interface IStore extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
  rating: number;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    isOpen: { type: Boolean, required: true, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true },
);

export const Store = model<IStore>('Store', storeSchema);
