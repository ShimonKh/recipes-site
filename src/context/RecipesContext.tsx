import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Recipe, Category } from '../data/types';
import { categories } from '../data/categories';

// Task 1: Interfaces (AC: #1, #3)
export interface RecipeWithCategory {
  recipe: Recipe;
  category: Category;
}

export interface RecipesContextValue {
  allRecipes: RecipeWithCategory[];
  isLoading: boolean;
  error: string | null;
}

// Context with default values
const RecipesContext = createContext<RecipesContextValue>({
  allRecipes: [],
  isLoading: true,
  error: null,
});

// Task 2: Data loading function (AC: #2, #6)
async function fetchAllRecipes(): Promise<RecipeWithCategory[]> {
  const results = await Promise.all(
    categories.map(async ({ key }) => {
      const response = await fetch(`${import.meta.env.BASE_URL}/recipes/${key}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}.json: ${response.status}`);
      }
      const recipes: Recipe[] = await response.json();
      return recipes.map((recipe) => ({ recipe, category: key }));
    })
  );
  return results.flat();
}

// Provider component
interface RecipesProviderProps {
  children: ReactNode;
}

export function RecipesProvider({ children }: RecipesProviderProps) {
  const [allRecipes, setAllRecipes] = useState<RecipeWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRecipes() {
      try {
        const recipes = await fetchAllRecipes();
        if (mounted) {
          setAllRecipes(recipes);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки рецептов');
          setIsLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <RecipesContext.Provider value={{ allRecipes, isLoading, error }}>
      {children}
    </RecipesContext.Provider>
  );
}

// Custom hook for consuming context (Task 1)
export function useRecipes(): RecipesContextValue {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
}
