import { faker } from '@faker-js/faker';
import rawCustomerReviews from '../data/reviews.json';

interface RawCustomerReview {
  name: string;
  testimonial: string;
}

const PRODUCT_REVIEW_TEMPLATES = [
  (name: string) =>
    `I've been using ${name} for a few weeks now and I'm impressed with the results. It's become a solid part of my daily routine.`,
  (name: string) =>
    `I tried ${name} on my pharmacist's recommendation, and I've been pleasantly surprised. Would definitely recommend.`,
  (name: string) =>
    `${name} worked exactly as described. Delivery was fast and the packaging was well sealed.`,
  (name: string) =>
    `Good value for the price. ${name} has made a noticeable difference for me within a couple of weeks.`,
  (name: string) =>
    `Not bad, though it took a little longer than I expected to notice a difference with ${name}. Still, happy overall.`,
  (name: string) =>
    `My doctor suggested ${name} and so far it's been effective with no side effects for me.`,
];

function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function generateProductReview(productName: string) {
  const authorName = faker.person.fullName();
  return {
    authorName,
    avatarUrl: avatarUrl(authorName),
    rating: faker.number.int({ min: 3, max: 5 }),
    text: faker.helpers.arrayElement(PRODUCT_REVIEW_TEMPLATES)(productName),
  };
}

export function generateCustomerReviews() {
  return (rawCustomerReviews as RawCustomerReview[]).map((entry) => ({
    name: entry.name,
    avatarUrl: avatarUrl(entry.name),
    quote: entry.testimonial,
  }));
}
