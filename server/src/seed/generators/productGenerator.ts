import { Category } from '../../constants/categories';
import rawProducts from '../data/products.json';

interface RawProduct {
  id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
}

// The source file's own "category" values (Medicine/Heart/Head/Hand/Leg) are placeholders
// unrelated to real drug classification, so every name is mapped to the closest fit among
// this app's actual CATEGORIES by hand. Several (e.g. blood-pressure drugs, antibiotics,
// psych meds) have no clean match and are forced into 'First Aid' as a catch-all.
const CATEGORY_BY_NAME: Record<string, Category> = {
  Aspirin: 'Pain Relief',
  Paracetamol: 'Pain Relief',
  Ibuprofen: 'Pain Relief',
  Acetaminophen: 'Pain Relief',
  Naproxen: 'Pain Relief',
  Tramadol: 'Pain Relief',
  Meloxicam: 'Pain Relief',
  'Folic Acid': 'Vitamins & Supplements',
  'Calcium Carbonate': 'Vitamins & Supplements',
  'Vitamin D': 'Vitamins & Supplements',
  'Fish Oil': 'Vitamins & Supplements',
  Multivitamins: 'Vitamins & Supplements',
  Omeprazole: 'Digestive Health',
  Metformin: 'Diabetes Care',
  'Facial Cleanser': 'Skin Care',
  Moisturizer: 'Skin Care',
  Loratadine: 'Allergy & Sinus',
  Montelukast: 'Allergy & Sinus',
};

const DEFAULT_CATEGORY: Category = 'First Aid';

interface GeneratedProduct {
  name: string;
  brand: string;
  category: Category;
  description: string;
  price: number;
  discountPercent: number;
  image: string;
  avgRating: number;
  reviewsCount: number;
}

export function generateProducts(): GeneratedProduct[] {
  const seenNames = new Set<string>();
  const products: GeneratedProduct[] = [];

  for (const raw of rawProducts as RawProduct[]) {
    if (seenNames.has(raw.name)) continue;
    seenNames.add(raw.name);

    products.push({
      name: raw.name,
      brand: raw.suppliers,
      category: CATEGORY_BY_NAME[raw.name] ?? DEFAULT_CATEGORY,
      description: `${raw.name}, supplied by ${raw.suppliers}. Consult your pharmacist before use.`,
      price: Number(raw.price),
      discountPercent: 0,
      image: raw.photo,
      avgRating: 0,
      reviewsCount: 0,
    });
  }

  return products;
}
