export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type Store = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
  rating: number;
};

export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPercent: number;
  image: string;
  avgRating: number;
  reviewsCount: number;
};

export type CustomerReview = {
  _id: string;
  name: string;
  avatarUrl: string;
  quote: string;
};

export type ProductReview = {
  _id: string;
  product: string;
  authorName: string;
  avatarUrl: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type CartLine = {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type CartState = {
  items: CartLine[];
  totalPrice: number;
  totalItems: number;
};

export type PaginatedResponse<T, K extends string> = {
  [key in K]: T[];
} & {
  page: number;
  totalPages: number;
  totalItems: number;
};

export type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type PaymentMethod = 'COD' | 'BANK';

export type Order = {
  _id: string;
  items: Array<{ product: string; name: string; price: number; quantity: number }>;
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  createdAt: string;
};
