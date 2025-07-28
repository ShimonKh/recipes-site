import type { Recipe } from '../data/types';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const { ingredients, steps, metadata } = recipe;

  return (
    <div className="mt-2 p-4 border rounded bg-gray-50 space-y-4">

      {/* Метаданные */}
      {metadata && (
        <div className="text-sm text-gray-700 space-y-1">
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
        <h3 className="text-md font-bold mb-2">Ингредиенты:</h3>
        <ul className="list-disc list-inside space-y-1">
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Приготовление */}
      <div>
        <h3 className="text-md font-bold mb-2">Приготовление:</h3>
        <ol className="list-decimal list-inside space-y-1">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
