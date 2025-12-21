import type { Recipe } from '../../data/types';
import styles from './RecipeCard.module.css';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const { ingredients, steps, tips, metadata } = recipe;

  return (
    <div className={styles.recipeCard}>
      {/* Метаданные */}
      {metadata && (
        <div className={styles.metadata}>
          {metadata.servings && (
            <p>
              <strong>Порции:</strong> {metadata.servings}
            </p>
          )}
          {metadata.equipment && (
            <p>
              <strong>Посудa:</strong> {metadata.equipment}
            </p>
          )}
          {metadata.heat && (
            <p>
              <strong>Огонь:</strong> {metadata.heat}
            </p>
          )}
          {metadata.notes && (
            <p>
              <strong>Заметки:</strong> {metadata.notes}
            </p>
          )}
        </div>
      )}

      {/* Ингредиенты */}
      <div>
        <h3>Ингредиенты:</h3>
        <ul>
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Приготовление */}
      <div>
        <h3>Приготовление:</h3>
        <ol>
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Советы */}
      {tips && tips.length > 0 && (
        <div className={styles.tips}>
          <h3>💡 Советы:</h3>
          <ul>
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
