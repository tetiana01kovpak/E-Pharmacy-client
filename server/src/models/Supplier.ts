import { Document, Schema, Types, model } from 'mongoose';

export interface ISupplier extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  brand: string;
  date: string;
  amount: number;
  status: 'Active' | 'Deactive';
}

const supplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  brand: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Deactive'], required: true },
});

export const Supplier = model<ISupplier>('Supplier', supplierSchema);
