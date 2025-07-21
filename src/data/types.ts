export type Category =
  | 'salads'
  | 'meat'
  | 'fish'
  | 'sides'
  | 'breakfasts'
  | 'soups'
  | 'sauces'
  | 'desserts'
  | 'other';

export interface Recipe {
  title: string;
  category: string;
  ingredients: string[];
  steps: string[];
  metadata?: {
    servings?: string;
    equipment?: string;
    heat?: string;
  };
}
