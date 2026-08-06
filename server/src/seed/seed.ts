import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { Cart } from '../models/Cart';
import { CustomerReview } from '../models/CustomerReview';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { ProductReview } from '../models/ProductReview';
import { Store } from '../models/Store';
import { User } from '../models/User';
import { generateCustomerReviews, generateProductReview } from './generators/reviewGenerator';
import { generateProducts } from './generators/productGenerator';
import { generateStores } from './generators/storeGenerator';

const CUSTOMER_REVIEW_COUNT = 10;

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@epharmacy.test',
  phone: '+1 555 123 4567',
  password: 'password123',
};

async function seed(): Promise<void> {
  await connectDb();

  console.log('Clearing existing collections...');
  await Promise.all([
    Store.deleteMany({}),
    Product.deleteMany({}),
    ProductReview.deleteMany({}),
    CustomerReview.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    User.deleteMany({ email: DEMO_USER.email }),
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

  console.log(`Seeding ${CUSTOMER_REVIEW_COUNT} customer reviews...`);
  await CustomerReview.insertMany(generateCustomerReviews(CUSTOMER_REVIEW_COUNT));

  console.log('Seeding demo user...');
  const demoUser = await User.create(DEMO_USER);
  await Cart.create({ user: demoUser._id, items: [] });

  console.log('\nSeed complete.');
  console.log(`Demo login -> email: ${DEMO_USER.email} / password: ${DEMO_USER.password}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
