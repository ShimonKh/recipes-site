// src/data/categories.ts
import type { Category } from './types';

export const categories: { key: Category; name: string }[] = [
    { key: 'salads', name: 'Салаты' },
    { key: 'fish', name: 'Рыбное' },
    { key: 'meat', name: 'Мясное' },
    { key: 'sides', name: 'Гарниры' },
    { key: 'breakfasts', name: 'Завтраки' },
    { key: 'soups', name: 'Супы' },
    { key: 'sauces', name: 'Соусы' },
    { key: 'desserts', name: 'Десерты' },
    { key: 'other', name: 'Другое' }
];
