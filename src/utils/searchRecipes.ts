import type { Recipe, Category } from '../data/types';
import type { RecipeWithCategory } from '../context/RecipesContext';

// Task 1: Types (AC: #7)
export type MatchType = 'title' | 'ingredient' | 'step' | 'tips' | 'notes';

export interface SearchResult {
  recipe: Recipe;
  category: Category;
  matchType: MatchType;
  matchText: string;
}

// Relevance priority (AC: #6)
const MATCH_PRIORITY: Record<MatchType, number> = {
  title: 1,
  ingredient: 2,
  step: 3,
  tips: 4,
  notes: 5,
};

/**
 * Search recipes by query string
 * AC: #1 - title, #2 - ingredients, #3 - steps, #4 - tips/notes
 * AC: #5 - min 2 chars, #6 - sorted by relevance, #7 - matchType/matchText, #8 - empty returns []
 */
export function searchRecipes(
  query: string,
  allRecipes: RecipeWithCategory[]
): SearchResult[] {
  // Task 7: Query validation (AC: #5, #8)
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const { recipe, category } of allRecipes) {
    // Task 2: Title matching (AC: #1) - highest priority
    if (recipe.title.toLowerCase().includes(trimmed)) {
      results.push({
        recipe,
        category,
        matchType: 'title',
        matchText: recipe.title,
      });
      continue;
    }

    // Task 3: Ingredient matching (AC: #2)
    const matchingIngredient = recipe.ingredients.find((ingredient) =>
      ingredient.toLowerCase().includes(trimmed)
    );
    if (matchingIngredient) {
      results.push({
        recipe,
        category,
        matchType: 'ingredient',
        matchText: matchingIngredient,
      });
      continue;
    }

    // Task 4: Step matching (AC: #3)
    const matchingStep = recipe.steps.find((step) =>
      step.toLowerCase().includes(trimmed)
    );
    if (matchingStep) {
      results.push({
        recipe,
        category,
        matchType: 'step',
        matchText: matchingStep,
      });
      continue;
    }

    // Task 5: Tips matching (AC: #4)
    if (recipe.tips) {
      const matchingTip = recipe.tips.find((tip) =>
        tip.toLowerCase().includes(trimmed)
      );
      if (matchingTip) {
        results.push({
          recipe,
          category,
          matchType: 'tips',
          matchText: matchingTip,
        });
        continue;
      }
    }

    // Task 5: Notes matching (AC: #4)
    if (recipe.metadata?.notes?.toLowerCase().includes(trimmed)) {
      results.push({
        recipe,
        category,
        matchType: 'notes',
        matchText: recipe.metadata.notes,
      });
    }
  }

  // Task 6: Sort by relevance (AC: #6)
  return results.sort(
    (a, b) => MATCH_PRIORITY[a.matchType] - MATCH_PRIORITY[b.matchType]
  );
}
