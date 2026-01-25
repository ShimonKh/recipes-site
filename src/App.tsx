import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import type { Category } from './data/types';
import type { SearchResult } from './utils/searchRecipes';

import HomePage from './components/HomePage/HomePage';
import CategorySelector from './components/CategorySelector/CategorySelector';
import RecipeList from './components/RecipeList/RecipeList';
import SearchBar from './components/SearchBar/SearchBar';
import MobileSearchButton from './components/MobileSearchButton/MobileSearchButton';
import MobileSearchOverlay from './components/MobileSearchOverlay/MobileSearchOverlay';

const categories: Category[] = [
  'salads', 'fish', 'meat', 'sides', 'breakfasts',
  'soups', 'sauces', 'desserts', 'other'
];

// Компонент для страниц категорий
function CategoryPage() {
  const { category } = useParams<{ category: Category }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category>(category || 'salads');
  const [recipeCounts, setRecipeCounts] = useState<Record<string, number>>({});
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Get recipe from URL on mount
  const recipeFromUrl = searchParams.get('recipe');

  const handleSearchResultClick = (result: SearchResult) => {
    // Navigate with recipe parameter
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };

  useEffect(() => {
    if (!category || !categories.includes(category as Category)) {
      navigate('/category/salads', { replace: true });
    } else {
      setSelectedCategory(category as Category);
    }
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};

      for (const category of categories) {
        try {
          const response = await fetch(import.meta.env.BASE_URL + `/recipes/${category}.json`);
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
      <div className="app-container">
        <header className="app-header">
          {/* Можно оставить header на всю ширину, либо тоже обернуть в контейнер */}
          <div className="container header-container">
            <Link to="/" className="header-title">
              <span className="logo-emoji" aria-hidden="true">📚</span>
              <span className="header-text">Книга рецептов</span>
            </Link>
            <SearchBar onResultClick={handleSearchResultClick} />
            <MobileSearchButton onClick={() => setIsMobileSearchOpen(true)} />
          </div>
        </header>
        
        <MobileSearchOverlay
          isOpen={isMobileSearchOpen}
          onClose={() => setIsMobileSearchOpen(false)}
          onResultClick={handleSearchResultClick}
        />
        
        <main>
          <div className="container main-container">
            <div className="content-container">
              <CategorySelector
                  value={selectedCategory}
                  onChange={(cat) => navigate(`/category/${cat}`)}
                  recipeCounts={recipeCounts}
              />
              <RecipeList category={selectedCategory} initialExpanded={recipeFromUrl} />
            </div>
          </div>
        </main>
      </div>
  );
}

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          {/* можно добавить fallback-роут */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </HashRouter>
  );
}

export default App;
