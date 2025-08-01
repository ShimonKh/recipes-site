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
    <div className="category-selector">
      {categories.map(({ key, name }) => {
        const count = recipeCounts?.[key];
        const displayLabel = `${categoryEmojis[key]} ${name}${count !== undefined ? ` (${count})` : ''}`;

        return (
            <button
                key={key}
                className={key === value ? 'selected' : ''}
                onClick={() => onChange(key)}
            >
              {displayLabel}
            </button>
        );
      })}
    </div>
  );
}
