# Story 1.3: Create Search State Hook

Status: ready-for-dev

## Story

As a **developer**,
I want **a reusable hook for search functionality**,
so that **both header and hero search share the same logic**.

## Acceptance Criteria

1. Create `useSearch` custom hook
2. Hook returns: `{ query, setQuery, results, clearSearch }`
3. Implement 300ms debounce on query changes
4. Hook consumes RecipesContext internally

## Tasks / Subtasks

- [ ] Task 1: Create useSearch hook file (AC: #1)
  - [ ] Create `src/hooks/useSearch.ts`
  - [ ] Define hook return type interface

- [ ] Task 2: Implement query state (AC: #2)
  - [ ] Add `query` state with `useState`
  - [ ] Implement `setQuery` function
  - [ ] Implement `clearSearch` function

- [ ] Task 3: Implement debounce (AC: #3)
  - [ ] Add debounced query state
  - [ ] Use `useEffect` with 300ms timeout
  - [ ] Clean up timeout on unmount

- [ ] Task 4: Integrate with context and search (AC: #4, #2)
  - [ ] Consume `RecipesContext` using `useRecipes` hook
  - [ ] Call `searchRecipes` with debounced query
  - [ ] Return results array

## Dev Notes

### TypeScript Interface (MUST USE)

```typescript
// src/hooks/useSearch.ts

import type { SearchResult } from '../utils/searchRecipes';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  clearSearch: () => void;
}

export function useSearch(): UseSearchReturn;
```

### Implementation Pattern

```typescript
// src/hooks/useSearch.ts

import { useState, useEffect, useMemo } from 'react';
import { useRecipes } from '../context/RecipesContext';
import { searchRecipes } from '../utils/searchRecipes';
import type { SearchResult } from '../utils/searchRecipes';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  clearSearch: () => void;
}

export function useSearch(): UseSearchReturn {
  const { allRecipes } = useRecipes();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search results (memoized)
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchRecipes(debouncedQuery, allRecipes);
  }, [debouncedQuery, allRecipes]);

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return {
    query,
    setQuery,
    results,
    clearSearch
  };
}
```

### Dependencies on Previous Stories

**Story 1.1 (RecipesContext):**
```typescript
import { useRecipes } from '../context/RecipesContext';
// Provides: { allRecipes, isLoading, error }
```

**Story 1.2 (searchRecipes):**
```typescript
import { searchRecipes } from '../utils/searchRecipes';
import type { SearchResult } from '../utils/searchRecipes';
```

### Debounce Implementation Notes

- Use native `setTimeout`/`clearTimeout` - no external library needed
- 300ms delay prevents excessive search calls while typing
- Clear timeout on cleanup to prevent memory leaks
- Could use `useMemo` for search results to prevent unnecessary recalculations

### Project Structure Notes

Create new file at:
```
src/
├── hooks/
│   └── useSearch.ts    [NEW]
```

### Usage Example (for EPIC-2 reference)

```tsx
// In SearchBar component (EPIC-2):
function SearchBar() {
  const { query, setQuery, results, clearSearch } = useSearch();

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Найти рецепт или ингредиент..."
      />
      {query && <button onClick={clearSearch}>✕</button>}
      
      {results.length > 0 && (
        <ul>
          {results.map((result, i) => (
            <li key={i}>{result.recipe.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Testing Considerations

The hook should:
- Return empty results initially
- Not trigger search until 300ms after last input
- Update results when query changes
- Clear results when `clearSearch` is called
- Handle rapid typing without excessive searches

### References

- [Source: _bmad-output/story-1-1-recipes-context.md] - useRecipes hook
- [Source: _bmad-output/story-1-2-search-algorithm.md] - searchRecipes function
- [Source: src/data/types.ts] - Recipe, Category types

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
