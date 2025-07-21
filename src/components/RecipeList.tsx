import { useEffect, useState } from 'react';
import type { Recipe, Category } from '../data/types';
import RecipeCard from './RecipeCard';

interface Props {
  category: Category;
}

export default function RecipeList({ category }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/recipes/${category}.json`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, [category]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => (prev === title ? null : title));
  };

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <div key={recipe.title}>
          <button
            className="text-left w-full font-semibold text-lg hover:underline"
            onClick={() => toggleExpand(recipe.title)}
          >
            {recipe.title}
          </button>

          {expanded === recipe.title && (
            <RecipeCard recipe={recipe} />
          )}
        </div>
      ))}
    </div>
  );
}
