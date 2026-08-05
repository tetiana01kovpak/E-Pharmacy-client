import { Document, Schema, Types, model } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  shipping: IShippingInfo;
  paymentMethod: 'COD' | 'BANK';
  totalPrice: number;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const shippingSchema = new Schema<IShippingInfo>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    shipping: { type: shippingSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'BANK'], required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Order = model<IOrder>('Order', orderSchema);
