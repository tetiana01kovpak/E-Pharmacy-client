import { Request, Response } from 'express';
import { Cart, ICartItem } from '../models/Cart';
import { Order } from '../models/Order';
import { IProduct, Product } from '../models/Product';
import { HttpError } from '../utils/HttpError';

type PopulatedCartItem = Omit<ICartItem, 'product'> & { product: IProduct };

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function serializeCart(items: PopulatedCartItem[]) {
  const lines = items
    .filter((item) => item.product)
    .map((item) => {
      const lineTotal = roundCurrency(item.product.price * item.quantity);
      return {
        productId: String(item.product._id),
        name: item.product.name,
        brand: item.product.brand,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        lineTotal,
      };
    });

  const totalPrice = roundCurrency(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  return { items: lines, totalPrice, totalItems };
}

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function getCart(req: Request, res: Response): Promise<void> {
  const cart = await getOrCreateCart(String(req.user!._id));
  await cart.populate<{ items: PopulatedCartItem[] }>('items.product');
  res.status(200).json(serializeCart(cart.items as unknown as PopulatedCartItem[]));
}

export async function addToCart(req: Request, res: Response): Promise<void> {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new HttpError(404, 'Product not found');
  }

  const cart = await getOrCreateCart(String(req.user!._id));
  const existingItem = cart.items.find((item) => String(item.product) === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }

  await cart.save();
  await cart.populate<{ items: PopulatedCartItem[] }>('items.product');
  res.status(200).json(serializeCart(cart.items as unknown as PopulatedCartItem[]));
}

export async function updateCartItem(req: Request, res: Response): Promise<void> {
  const { productId, quantity } = req.body;

  const cart = await getOrCreateCart(String(req.user!._id));
  const item = cart.items.find((cartItem) => String(cartItem.product) === productId);

  if (!item) {
    throw new HttpError(404, 'Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate<{ items: PopulatedCartItem[] }>('items.product');
  res.status(200).json(serializeCart(cart.items as unknown as PopulatedCartItem[]));
}

export async function removeCartItem(req: Request, res: Response): Promise<void> {
  const { productId } = req.params;

  const cart = await getOrCreateCart(String(req.user!._id));
  cart.items = cart.items.filter((item) => String(item.product) !== productId);

  await cart.save();
  await cart.populate<{ items: PopulatedCartItem[] }>('items.product');
  res.status(200).json(serializeCart(cart.items as unknown as PopulatedCartItem[]));
}

export async function checkout(req: Request, res: Response): Promise<void> {
  const { shipping, paymentMethod } = req.body;

  const cart = await getOrCreateCart(String(req.user!._id));
  await cart.populate<{ items: PopulatedCartItem[] }>('items.product');
  const populatedItems = cart.items as unknown as PopulatedCartItem[];

  if (populatedItems.length === 0) {
    throw new HttpError(400, 'Cart is empty');
  }

  const orderItems = populatedItems.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalPrice = roundCurrency(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const order = await Order.create({
    user: req.user!._id,
    items: orderItems,
    shipping,
    paymentMethod,
    totalPrice,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ order });
}
