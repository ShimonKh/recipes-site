import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';
import { categoryEmojis } from '../../data/categoryEmojis';
import HeroSearchBar from '../HeroSearchBar/HeroSearchBar';
import type { SearchResult } from '../../utils/searchRecipes';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearchResultClick = (result: SearchResult) => {
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };

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
        <div className={styles.suggestedList}>
          <div className={styles.suggestedCard}>🥗 Морковный салат с чесноком и лимоном</div>
          <div className={styles.suggestedCard}>🐟 Форель в чесночно-травяном маринаде</div>
          <div className={styles.suggestedCard}>🍰 Морковный кекс</div>
        </div>
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
