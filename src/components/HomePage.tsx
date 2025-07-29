import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { categoryEmojis } from '../data/categoryEmojis';


export default function HomePage() {
    return (
        <div className="container">
            <header className="hero">
                <h1>🌿 Домашние рецепты</h1>
                <p>Простые, вкусные и проверенные блюда для будней и праздников</p>
            </header>

            <section>
                <h2>Категории рецептов</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <Link key={cat.key} to={`/category/${cat.key}`} className="category-tile">
                            <span className="emoji">{categoryEmojis[cat.key]}</span>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2>Рекомендуем попробовать</h2>
                <div className="suggested-list">
                    <div className="suggested-card">🥗 Морковный салат с чесноком и лимоном</div>
                    <div className="suggested-card">🐟 Форель в чесночно-травяном маринаде</div>
                    <div className="suggested-card">🍰 Морковный кекс</div>
                </div>
            </section>

            <section className="howto">
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
