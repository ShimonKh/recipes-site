import { useEffect, useState, useRef } from 'react';
import type { Recipe, Category } from '../../data/types';
import RecipeCard from '../RecipeCard/RecipeCard';
import styles from './RecipeList.module.css';

interface Props {
  category: Category;
  initialExpanded?: string | null;
}

export default function RecipeList({ category, initialExpanded }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(initialExpanded || null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Update expanded when initialExpanded changes (from URL) or category changes
  useEffect(() => {
    // Reset expanded when category changes
    if (initialExpanded) {
      // Decode URL-encoded recipe title
      const decodedTitle = decodeURIComponent(initialExpanded);
      setExpanded(decodedTitle);
    } else {
      setExpanded(null);
    }
  }, [category, initialExpanded]);

  // Scroll to expanded recipe
  useEffect(() => {
    if (expanded && recipes.length > 0) {
      // Check if the expanded recipe exists in the loaded recipes
      const recipeExists = recipes.some(r => r.title === expanded);
      
      if (recipeExists && expandedRef.current) {
        // Wait for DOM to be fully updated and RecipeCard rendered
        // Use multiple requestAnimationFrame for more reliable timing
        const scrollToRecipe = () => {
          if (expandedRef.current) {
            // Get the element position
            const element = expandedRef.current;
            const elementPosition = element.getBoundingClientRect().top;
            
            // Calculate dynamic header height
            const header = document.querySelector('.app-header');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const offset = headerHeight + 20; // 20px extra spacing
            
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
              behavior: 'smooth'
            });
          }
        };

        // Wait for browser to finish initial scroll and DOM updates
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(scrollToRecipe, 300);
          });
        });
      }
    }
  }, [expanded, recipes]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + `/recipes/${category}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch recipes: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const sortedByTitle = [...data].sort((a: Recipe, b: Recipe) =>
          a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' })
        );
        setRecipes(sortedByTitle);
      })
      .catch((error) => {
        console.error('Error loading recipes:', error);
        setRecipes([]);
      });
  }, [category]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => (prev === title ? null : title));
  };

  return (
    <div className={styles.recipeList}>
      {recipes.map((recipe) => (
        <div 
          key={recipe.title}
          ref={expanded === recipe.title ? expandedRef : null}
        >
          <button
              className={`${styles.recipeCardButton} ${expanded === recipe.title ? styles.active : ''}`}
              onClick={() => toggleExpand(recipe.title)}
          >
            <span className={styles.recipeCardTitle}>{recipe.title}</span>
          </button>

          {expanded === recipe.title && (
            <RecipeCard recipe={recipe} />
          )}
        </div>
      ))}
    </div>
  );
}
