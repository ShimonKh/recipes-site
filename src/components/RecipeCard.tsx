import type { Recipe } from '../data/types';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const { ingredients, steps, metadata } = recipe;

  return (
    <div className="recipe-card">

      {/* Метаданные */}
      {metadata && (
        <div className="recipe-metadata">
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
    </div>
  );
}
