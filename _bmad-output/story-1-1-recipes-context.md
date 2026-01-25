# Story 1.1: Load All Recipes on App Init

Status: ready-for-dev

## Story

As a **developer**,
I want **all recipes loaded into app state on initialization**,
so that **search can operate instantly without network calls**.

## Acceptance Criteria

1. Create `RecipesContext` to store all recipes
2. Load all 9 category JSON files on app mount
3. Store recipes with their category info: `{ recipe: Recipe, category: Category }`
4. Handle loading state (show spinner or skeleton)
5. Handle error state (show error message if load fails)
6. Total load time < 2 seconds on 3G connection

## Tasks / Subtasks

- [ ] Task 1: Create RecipesContext (AC: #1, #3)
  - [ ] Create `src/context/RecipesContext.tsx`
  - [ ] Define `RecipeWithCategory` interface
  - [ ] Define `RecipesContextValue` interface
  - [ ] Create context with Provider component
  - [ ] Export `useRecipes` custom hook for consuming context

- [ ] Task 2: Implement data loading (AC: #2, #6)
  - [ ] Fetch all 9 JSON files in parallel using `Promise.all`
  - [ ] Use `import.meta.env.BASE_URL` for correct path resolution (required for GitHub Pages)
  - [ ] Map each recipe with its category to `RecipeWithCategory[]`
  - [ ] Store in context state

- [ ] Task 3: Handle loading state (AC: #4)
  - [ ] Add `isLoading: boolean` to context
  - [ ] Show loading indicator while fetching

- [ ] Task 4: Handle error state (AC: #5)
  - [ ] Add `error: string | null` to context
  - [ ] Gracefully handle fetch failures
  - [ ] Display error message to user

- [ ] Task 5: Integrate with App (AC: all)
  - [ ] Wrap App with `RecipesProvider` in `main.tsx`
  - [ ] Verify data loads on app start

## Dev Notes

### TypeScript Interfaces (MUST USE)

```typescript
// src/context/RecipesContext.tsx

import type { Recipe, Category } from '../data/types';

export interface RecipeWithCategory {
  recipe: Recipe;
  category: Category;
}

export interface RecipesContextValue {
  allRecipes: RecipeWithCategory[];
  isLoading: boolean;
  error: string | null;
}
```

### Existing Types to Import

From `src/data/types.ts`:

```typescript
export type Category =
  | 'salads'
  | 'meat'
  | 'fish'
  | 'sides'
  | 'breakfasts'
  | 'soups'
  | 'sauces'
  | 'desserts'
  | 'other';

export interface Recipe {
  title: string;
  category: string;
  ingredients: string[];
  steps: string[];
  tips?: string[];
  metadata?: {
    servings?: string;
    equipment?: string;
    heat?: string;
    notes?: string;
  };
}
```

### Categories List (use for loading)

From `src/data/categories.ts`:

```typescript
const categories: Category[] = [
  'salads', 'fish', 'meat', 'sides', 'breakfasts',
  'soups', 'sauces', 'desserts', 'other'
];
```

### Recipe JSON Location

All recipe files are in `public/recipes/`:
- `salads.json`, `fish.json`, `meat.json`, `sides.json`
- `breakfasts.json`, `soups.json`, `sauces.json`, `desserts.json`, `other.json`

### Fetch Pattern (CRITICAL for GitHub Pages)

```typescript
// MUST use import.meta.env.BASE_URL for correct path resolution
const response = await fetch(`${import.meta.env.BASE_URL}recipes/${category}.json`);
```

### Project Structure Notes

Create new file at:
```
src/
├── context/
│   └── RecipesContext.tsx    [NEW]
```

Modify existing file:
```
src/
├── main.tsx                  [MODIFY - wrap with Provider]
```

### Implementation Pattern

```typescript
// Example context pattern from existing codebase
// See App.tsx lines 30-58 for similar fetch pattern

// Parallel fetch approach:
const fetchAllRecipes = async () => {
  const results = await Promise.all(
    categories.map(async (category) => {
      const response = await fetch(`${import.meta.env.BASE_URL}recipes/${category}.json`);
      const recipes: Recipe[] = await response.json();
      return recipes.map(recipe => ({ recipe, category }));
    })
  );
  return results.flat();
};
```

### References

- [Source: src/data/types.ts] - Recipe and Category types
- [Source: src/data/categories.ts] - Categories list
- [Source: src/App.tsx#30-58] - Existing fetch pattern example
- [Source: public/recipes/] - JSON data files

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
