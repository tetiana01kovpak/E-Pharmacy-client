import { Document, Schema, Types, model } from 'mongoose';

export interface IFinanceEntry extends Document {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  type: 'Income' | 'Expense' | 'Error';
}

const financeEntrySchema = new Schema<IFinanceEntry>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense', 'Error'], required: true },
});

export const FinanceEntry = model<IFinanceEntry>('FinanceEntry', financeEntrySchema);
