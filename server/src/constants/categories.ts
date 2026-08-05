export const CATEGORIES = [
  'Pain Relief',
  'Vitamins & Supplements',
  'Cold & Flu',
  'Digestive Health',
  'Skin Care',
  'First Aid',
  'Allergy & Sinus',
  'Diabetes Care',
] as const;

export type Category = (typeof CATEGORIES)[number];
