# Story 1.2: Implement Search Algorithm

Status: ready-for-dev

## Story

As a **user**,
I want **to search recipes by typing text**,
so that **I can find recipes containing my search term**.

## Acceptance Criteria

1. Search matches recipe titles (case-insensitive)
2. Search matches ingredients (case-insensitive)
3. Search matches cooking steps (case-insensitive)
4. Search matches tips and metadata.notes (if present)
5. Minimum 2 characters required to search
6. Results sorted by relevance: title > ingredient > step > other
7. Each result includes `matchType` and `matchText`
8. Empty query returns empty results

## Tasks / Subtasks

- [ ] Task 1: Create SearchResult interface (AC: #7)
  - [ ] Create `src/utils/searchRecipes.ts`
  - [ ] Define `MatchType` type
  - [ ] Define `SearchResult` interface with recipe, category, matchType, matchText

- [ ] Task 2: Implement title matching (AC: #1)
  - [ ] Case-insensitive title search
  - [ ] Extract matching text segment

- [ ] Task 3: Implement ingredient matching (AC: #2)
  - [ ] Search all ingredients array
  - [ ] Return first matching ingredient as matchText

- [ ] Task 4: Implement step matching (AC: #3)
  - [ ] Search all steps array
  - [ ] Return first matching step as matchText

- [ ] Task 5: Implement tips/notes matching (AC: #4)
  - [ ] Search tips array if exists
  - [ ] Search metadata.notes if exists

- [ ] Task 6: Implement relevance sorting (AC: #6)
  - [ ] Priority: title (1) > ingredient (2) > step (3) > tips/notes (4)
  - [ ] Sort results by priority

- [ ] Task 7: Implement query validation (AC: #5, #8)
  - [ ] Return empty array if query < 2 characters
  - [ ] Return empty array if query is empty/whitespace

## Dev Notes

### TypeScript Interfaces (MUST USE)

```typescript
// src/utils/searchRecipes.ts

import type { Recipe, Category } from '../data/types';
import type { RecipeWithCategory } from '../context/RecipesContext';

export type MatchType = 'title' | 'ingredient' | 'step' | 'tips' | 'notes';

export interface SearchResult {
  recipe: Recipe;
  category: Category;
  matchType: MatchType;
  matchText: string;  // The text where match was found
}

export function searchRecipes(
  query: string, 
  allRecipes: RecipeWithCategory[]
): SearchResult[];
```

### Algorithm Design

```typescript
function searchRecipes(query: string, allRecipes: RecipeWithCategory[]): SearchResult[] {
  // 1. Validate query
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];
  
  // 2. Search all recipes
  const results: SearchResult[] = [];
  
  for (const { recipe, category } of allRecipes) {
    // Check title first (highest priority)
    if (recipe.title.toLowerCase().includes(trimmed)) {
      results.push({ recipe, category, matchType: 'title', matchText: recipe.title });
      continue; // Skip to next recipe - found best match
    }
    
    // Check ingredients
    const matchingIngredient = recipe.ingredients.find(i => 
      i.toLowerCase().includes(trimmed)
    );
    if (matchingIngredient) {
      results.push({ recipe, category, matchType: 'ingredient', matchText: matchingIngredient });
      continue;
    }
    
    // Check steps
    const matchingStep = recipe.steps.find(s => 
      s.toLowerCase().includes(trimmed)
    );
    if (matchingStep) {
      results.push({ recipe, category, matchType: 'step', matchText: matchingStep });
      continue;
    }
    
    // Check tips
    if (recipe.tips) {
      const matchingTip = recipe.tips.find(t => 
        t.toLowerCase().includes(trimmed)
      );
      if (matchingTip) {
        results.push({ recipe, category, matchType: 'tips', matchText: matchingTip });
        continue;
      }
    }
    
    // Check metadata.notes
    if (recipe.metadata?.notes?.toLowerCase().includes(trimmed)) {
      results.push({ recipe, category, matchType: 'notes', matchText: recipe.metadata.notes });
    }
  }
  
  // 3. Sort by relevance (matchType priority)
  const priority: Record<MatchType, number> = {
    title: 1,
    ingredient: 2,
    step: 3,
    tips: 4,
    notes: 5
  };
  
  return results.sort((a, b) => priority[a.matchType] - priority[b.matchType]);
}
```

### Test Cases to Consider

```typescript
// Example searches:
searchRecipes("мор", recipes)  // Should find "Морковный салат" in title
searchRecipes("лимон", recipes)  // Should find recipes with лимон in ingredients
searchRecipes("нарежь", recipes)  // Should find recipes with this step
searchRecipes("a", recipes)  // Should return [] (< 2 chars)
searchRecipes("   ", recipes)  // Should return [] (empty)
```

### Dependency on Story 1.1

This story requires `RecipeWithCategory` type and data from Story 1.1.
Import from context:

```typescript
import type { RecipeWithCategory } from '../context/RecipesContext';
```

### Project Structure Notes

Create new file at:
```
src/
├── utils/
│   └── searchRecipes.ts    [NEW]
```

### Russian Language Notes

- All recipe content is in Russian
- Search should be case-insensitive for Cyrillic characters
- JavaScript `toLowerCase()` handles Cyrillic correctly

### References

- [Source: _bmad-output/story-1-1-recipes-context.md] - RecipeWithCategory interface
- [Source: src/data/types.ts] - Recipe interface with tips and metadata
- [Source: public/recipes/salads.json] - Example recipe structure

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
