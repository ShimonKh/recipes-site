import type{ Category } from '../data/types';
import { categories } from '../data/categories';
import { categoryEmojis } from '../data/categoryEmojis';


interface Props {
  value: Category;
  onChange: (value: Category) => void;
  recipeCounts?: Record<string, number>;
}


export default function CategorySelector({ value, onChange, recipeCounts }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {categories.map(({ key, name }) => {
        const count = recipeCounts?.[key];
        const displayLabel = `${categoryEmojis[key]} ${name}${count !== undefined ? ` (${count})` : ''}`;

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
