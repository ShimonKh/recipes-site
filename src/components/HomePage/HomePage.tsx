import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { categories } from '../../data/categories';
import { categoryEmojis } from '../../data/categoryEmojis';
import HeroSearchBar from '../HeroSearchBar/HeroSearchBar';
import type { SearchResult } from '../../utils/searchRecipes';
import { useRecipes } from '../../context/RecipesContext';
import { getWeekNumber, selectRecipesFromDifferentCategories } from '../../utils/weeklyRandomizer';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { allRecipes, isLoading } = useRecipes();

  const handleSearchResultClick = (result: SearchResult) => {
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };


  // Выбираем 3 случайных рецепта из разных категорий на основе недели года
  // Исключаем категории 'other' и 'sauces'
  const suggestedRecipes = useMemo(() => {
    if (isLoading || allRecipes.length === 0) {
      return [];
    }
    const weekNumber = getWeekNumber();
    // Используем номер недели как seed для детерминированного выбора
    const seed = weekNumber * 1000 + new Date().getFullYear();
    return selectRecipesFromDifferentCategories(allRecipes, 3, seed, ['other', 'sauces']);
  }, [allRecipes, isLoading]);

  return (
    <div className={`container ${styles.homepage}`}>
      <header className={styles.hero}>
        <h1>🌿 Домашние рецепты</h1>
        <p>Простые, вкусные и проверенные блюда для будней и праздников</p>
        <HeroSearchBar onResultClick={handleSearchResultClick} />
      </header>

      <section>
        <h2>Категории рецептов</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link key={cat.key} to={`/category/${cat.key}`} className={styles.categoryTile}>
              <span className={styles.emoji}>{categoryEmojis[cat.key]}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Рекомендуем попробовать</h2>
        {isLoading ? (
          <div className={styles.suggestedList}>
            <div className={styles.suggestedCard}>Загрузка...</div>
          </div>
        ) : suggestedRecipes.length > 0 ? (
          <div className={styles.suggestedList}>
            {suggestedRecipes.map((recipeWithCategory) => {
              const emoji = categoryEmojis[recipeWithCategory.category];
              const encodedTitle = encodeURIComponent(recipeWithCategory.recipe.title);
              const to = `/category/${recipeWithCategory.category}?recipe=${encodedTitle}`;
              return (
                <Link
                  key={`${recipeWithCategory.category}-${recipeWithCategory.recipe.title}`}
                  to={to}
                  className={styles.suggestedCard}
                >
                  {emoji} {recipeWithCategory.recipe.title}
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className={styles.howto}>
        <h3>Как пользоваться сайтом:</h3>
        <ol>
          <li>Выберите категорию — откроется список рецептов.</li>
          <li>Кликните по названию блюда — увидите подробный рецепт.</li>
          <li>Добавляйте сайт в закладки для быстрого доступа!</li>
        </ol>
      </section>
    </div>
  );
}
