import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { Cart } from '../models/Cart';
import { CustomerReview } from '../models/CustomerReview';
import { FinanceEntry } from '../models/FinanceEntry';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { ProductReview } from '../models/ProductReview';
import { Store } from '../models/Store';
import { Supplier } from '../models/Supplier';
import { User } from '../models/User';
import { generateCustomers, generateOrderSeeds } from './generators/crmGenerator';
import { generateFinanceEntries, generateSuppliers } from './generators/dashboardGenerator';
import { generateCustomerReviews, generateProductReview } from './generators/reviewGenerator';
import { generateProducts } from './generators/productGenerator';
import { generateStores } from './generators/storeGenerator';

const PAYMENT_METHODS = ['COD', 'BANK'] as const;

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@epharmacy.test',
  phone: '+1 555 123 4567',
  password: 'password123',
};

async function seed(): Promise<void> {
  await connectDb();

  console.log('Clearing existing collections...');
  const customerSeeds = generateCustomers();
  await Promise.all([
    Store.deleteMany({}),
    Product.deleteMany({}),
    ProductReview.deleteMany({}),
    CustomerReview.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Supplier.deleteMany({}),
    FinanceEntry.deleteMany({}),
    User.deleteMany({ email: { $in: [DEMO_USER.email, ...customerSeeds.map((c) => c.email)] } }),
  ]);

  const stores = generateStores();
  console.log(`Seeding ${stores.length} stores...`);
  await Store.insertMany(stores);

  const productsData = generateProducts();
  console.log(`Seeding ${productsData.length} products...`);
  const products = await Product.insertMany(productsData);

  console.log('Seeding product reviews...');
  for (const product of products) {
    const reviewCount = Math.floor(Math.random() * 9); // 0-8
    if (reviewCount === 0) continue;

    const reviews = Array.from({ length: reviewCount }, () => ({
      product: product._id,
      ...generateProductReview(product.name),
    }));
    await ProductReview.insertMany(reviews);

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.avgRating = Number(avgRating.toFixed(1));
    product.reviewsCount = reviews.length;
    await product.save();
  }

  const customerReviews = generateCustomerReviews();
  console.log(`Seeding ${customerReviews.length} customer reviews...`);
  await CustomerReview.insertMany(customerReviews);

  console.log('Seeding demo user...');
  const demoUser = await User.create(DEMO_USER);
  await Cart.create({ user: demoUser._id, items: [] });

  console.log(`Seeding ${customerSeeds.length} customers...`);
  const customers = await Promise.all(customerSeeds.map((seed) => User.create(seed)));

  const orderSeeds = generateOrderSeeds();
  console.log(`Seeding ${orderSeeds.length} orders...`);
  for (const orderSeed of orderSeeds) {
    const orderCustomer = randomItem(customers);
    const orderProducts = Array.from({ length: orderSeed.itemCountHint }, () => randomItem(products));

    const items = orderProducts.map((product) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1 + Math.floor(Math.random() * 3),
    }));

    const totalPrice = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));

    await Order.create({
      user: orderCustomer._id,
      items,
      shipping: {
        name: orderSeed.shippingName,
        email: orderCustomer.email,
        phone: orderCustomer.phone,
        address: orderSeed.shippingAddress,
      },
      paymentMethod: randomItem(PAYMENT_METHODS),
      totalPrice,
      createdAt: orderSeed.date,
    });
  }

  const suppliers = generateSuppliers();
  console.log(`Seeding ${suppliers.length} suppliers...`);
  await Supplier.insertMany(suppliers);

  const financeEntries = generateFinanceEntries();
  console.log(`Seeding ${financeEntries.length} finance entries...`);
  await FinanceEntry.insertMany(financeEntries);

  console.log('\nSeed complete.');
  console.log(`Demo login -> email: ${DEMO_USER.email} / password: ${DEMO_USER.password}`);
  console.log(`Seeded customer login -> email: ${customerSeeds[0]?.email} / password: password123`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
