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
    fetch(import.meta.env.BASE_URL + `recipes/${category}.json`)
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, [category]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => (prev === title ? null : title));
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe.title}>
          <button
            className="recipe-button"
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
