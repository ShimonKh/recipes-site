import type{ Category } from '../data/types';

interface Props {
  value: Category;
  onChange: (value: Category) => void;
  recipeCounts?: Record<string, number>;
}

const categories: { key: Category; label: string }[] = [
  { key: 'salads', label: '🥗 Салаты' },
  { key: 'fish', label: '🐟 Рыбное' },
  { key: 'meat', label: '🍖 Мясное' },
  { key: 'sides', label: '🍽️ Гарниры' },
  { key: 'breakfasts', label: '🍳 Завтраки' },
  { key: 'soups', label: '🥣 Супы' },
  { key: 'sauces', label: '🧄 Соусы' },
  { key: 'desserts', label: '🍰 Десерты' },
  { key: 'other', label: '📦 Другое' }
];

export default function CategorySelector({ value, onChange, recipeCounts }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {categories.map(({ key, label }) => {
        const count = recipeCounts?.[key];
        const displayLabel = count !== undefined ? `${label} (${count})` : label;
        
        return (
          <button
            key={key}
            className={`px-3 py-1 rounded border transition-colors ${
              key === value 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
            }`}
            onClick={() => onChange(key)}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
}
