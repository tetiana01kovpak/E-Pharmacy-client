import { faker } from '@faker-js/faker';
import { CATEGORIES } from '../../constants/categories';

const DRUG_STEMS = [
  'Amoxicillin',
  'Paracetamol',
  'Ibuprofen',
  'Cetirizine',
  'Loratadine',
  'Omeprazole',
  'Metformin',
  'Amlodipine',
  'Atorvastatin',
  'Vitamin C',
  'Vitamin D3',
  'Zinc',
  'Multivitamin Complex',
  'Calcium Carbonate',
  'Iron Supplement',
  'Melatonin',
  'Probiotic Complex',
  'Fish Oil',
  'Aspirin',
  'Diclofenac',
  'Loperamide',
  'Domperidone',
  'Ranitidine',
  'Salbutamol',
  'Dextromethorphan',
  'Chlorpheniramine',
  'Hydrocortisone',
  'Betamethasone',
  'Ciprofloxacin',
  'Azithromycin',
  'Moringa Extract',
  'Ginger Root',
  'Echinacea',
  'Magnesium',
  'Electrolyte Powder',
];

const DOSAGE_FORMS = [
  'Tablets',
  'Capsules',
  'Syrup',
  'Oral Suspension',
  'Ointment',
  'Cream',
  'Gel',
  'Drops',
  'Effervescent Tablets',
  'Chewable Tablets',
];

const BENEFIT_TEMPLATES = [
  (name: string) => `Antioxidant Properties: ${name} is packed with antioxidants that help fight oxidative stress and inflammation in the body.`,
  (name: string) => `Immune Support: With regular use, ${name} can help boost the immune system's natural defenses.`,
  (name: string) => `Digestive Aid: ${name} can help support healthy digestion and ease minor digestive discomfort.`,
  (name: string) => `Heart Health: Some studies suggest ${name} may support healthy cholesterol levels already within a normal range.`,
  (name: string) => `Energy & Vitality: Many users report improved energy levels after incorporating ${name} into their daily routine.`,
  (name: string) => `Anti-Inflammatory Effects: ${name} may help reduce minor inflammation associated with everyday activity.`,
];

function buildDescription(name: string): string {
  const intro = `Although ${name} is typically considered safe for most adults when used as directed, it is always recommended to consult your pharmacist or doctor before starting any new medication or supplement, especially if you are pregnant, nursing, or taking other medications.`;
  const benefits = faker.helpers.arrayElements(BENEFIT_TEMPLATES, 4).map((fn) => fn(name));
  return [intro, ...benefits].join('\n\n');
}

interface GeneratedProduct {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPercent: number;
  image: string;
  avgRating: number;
  reviewsCount: number;
}

export function generateProducts(count: number): GeneratedProduct[] {
  const combos = new Set<string>();
  const products: GeneratedProduct[] = [];

  while (products.length < count) {
    const stem = faker.helpers.arrayElement(DRUG_STEMS);
    const form = faker.helpers.arrayElement(DOSAGE_FORMS);
    const name = `${stem} ${form}`;

    if (combos.has(name)) continue;
    combos.add(name);

    const isBigDiscount = products.length < 4;
    const isMediumDiscount = products.length >= 4 && products.length < 8;
    const discountPercent = isBigDiscount ? 70 : isMediumDiscount ? 35 : faker.helpers.arrayElement([0, 0, 0, 10, 15, 20]);

    products.push({
      name,
      brand: faker.company.name(),
      category: faker.helpers.arrayElement(CATEGORIES),
      description: buildDescription(stem),
      price: Number(faker.commerce.price({ min: 5, max: 600 })),
      discountPercent,
      image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
      avgRating: 0,
      reviewsCount: 0,
    });
  }

  return products;
}
