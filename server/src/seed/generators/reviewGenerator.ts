import { faker } from '@faker-js/faker';

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

// Authored copy from the Figma design's home-page Reviews section — preserved verbatim.
const AUTHORED_CUSTOMER_REVIEWS = [
  {
    name: 'Maria Tkachuk',
    quote:
      'I recently used this medical platform to book an appointment with a specialist. I was impressed by how easy and user-friendly the process was. Highly recommended!',
  },
  {
    name: 'Sergey Rybachok',
    quote:
      'I had a great experience using this medical platform to access my health records. This platform is a game-changer for managing my healthcare needs.',
  },
  {
    name: 'Natalia Chatuk',
    quote:
      'I recently had a virtual appointment with my doctor through this medical platform, and I was pleasantly surprised by how seamless the experience was.',
  },
];

const CUSTOMER_REVIEW_TEMPLATES = [
  'Ordering my prescriptions online saved me so much time. The whole process felt effortless from start to finish.',
  'Finding a nearby pharmacy with everything in stock used to be a hassle — this platform made it simple.',
  'Customer support was quick to help when I had a question about my delivery. Really appreciated the responsiveness.',
  'The search and filter tools made it easy to find exactly the medicine I needed without any guesswork.',
  'I was skeptical about ordering medicine online at first, but the whole experience put my mind at ease.',
  'Delivery arrived faster than I expected, and everything was packaged carefully.',
  "Being able to compare nearby pharmacies before choosing one was a feature I didn't know I needed.",
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

export function generateCustomerReviews(count: number) {
  const authored = AUTHORED_CUSTOMER_REVIEWS.map((entry) => ({
    name: entry.name,
    avatarUrl: avatarUrl(entry.name),
    quote: entry.quote,
  }));

  const extraCount = Math.max(0, count - authored.length);
  const extras = faker.helpers.arrayElements(CUSTOMER_REVIEW_TEMPLATES, Math.min(extraCount, CUSTOMER_REVIEW_TEMPLATES.length)).map(
    (quote) => {
      const name = faker.person.fullName();
      return { name, avatarUrl: avatarUrl(name), quote };
    },
  );

  return [...authored, ...extras];
}
