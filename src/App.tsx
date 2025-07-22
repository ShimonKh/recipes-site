import { useState, useEffect } from 'react';
import type { Category } from './data/types';

import CategorySelector from './components/CategorySelector';
import RecipeList from './components/RecipeList';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('salads');
  const [recipeCounts, setRecipeCounts] = useState<Record<string, number>>({});

  const categories: Category[] = [
    'salads', 'fish', 'meat', 'sides', 'breakfasts',
    'soups', 'sauces', 'desserts', 'other'
  ];

  useEffect(() => {
    // Fetch recipe counts for all categories
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};

      for (const category of categories) {
        try {
          const response = await fetch(import.meta.env.BASE_URL +`recipes/${category}.json`);
          if (response.ok) {
            const text = await response.text();
            if (text.trim() !== '') {
              const data = JSON.parse(text);
              counts[category] = Array.isArray(data) ? data.length : 0;
            } else {
              counts[category] = 0;
            }
          } else {
            counts[category] = 0;
          }
        } catch (error) {
          console.error(`Error fetching ${category}:`, error);
          counts[category] = 0;
        }
      }

      setRecipeCounts(counts);
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">📚 Книга рецептов</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <CategorySelector
            value={selectedCategory}
            onChange={setSelectedCategory}
            recipeCounts={recipeCounts}
          />
          <RecipeList category={selectedCategory} />
        </div>
      </main>
    </div>
  );
}

export default App;
