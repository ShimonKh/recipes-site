# Story 5.2: Empty & Error States

Status: ready-for-dev

## Story

As a **user**,
I want **helpful feedback when search has no results**,
so that **I know what to do next**.

## Acceptance Criteria

1. "Введите минимум 2 символа" when query < 2 chars
2. "Ничего не найдено по запросу «{query}»" when no results
3. Suggest: "Попробуйте другие ключевые слова"
4. Error state if data fails to load

## Tasks / Subtasks

- [ ] Task 1: Add "minimum characters" message (AC: #1)
  - [ ] Show when query.length is 1
  - [ ] Don't show when query is empty (no dropdown)
  - [ ] Style as helpful hint

- [ ] Task 2: Enhance "no results" message (AC: #2, #3)
  - [ ] Show formatted message with query
  - [ ] Add suggestion text below
  - [ ] Add 😕 emoji for friendliness

- [ ] Task 3: Handle data loading error (AC: #4)
  - [ ] Check `error` from RecipesContext
  - [ ] Show error message in search dropdown
  - [ ] "Не удалось загрузить рецепты. Попробуйте обновить страницу."

- [ ] Task 4: Apply to all search components
  - [ ] SearchBar (header)
  - [ ] HeroSearchBar (homepage)
  - [ ] MobileSearchOverlay

- [ ] Task 5: Style empty/error states
  - [ ] Consistent padding and alignment
  - [ ] Appropriate colors (gray for hint, red for error)

## Dev Notes

### State Logic

```typescript
// Determine what to show
const showMinCharsHint = query.length === 1;
const showNoResults = query.length >= 2 && results.length === 0;
const showError = error !== null;
const showResults = results.length > 0;
```

### Enhanced SearchResults with States

```tsx
// In SearchResults.tsx or SearchBar.tsx

// Get error from context
const { allRecipes, isLoading, error } = useRecipes();

// Render logic
{isOpen && (
  <div className={styles.dropdown}>
    {/* Error state */}
    {error && (
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>Не удалось загрузить рецепты.</p>
        <p className={styles.hint}>Попробуйте обновить страницу.</p>
      </div>
    )}
    
    {/* Min chars hint */}
    {!error && query.length === 1 && (
      <div className={styles.hintState}>
        <p>Введите минимум 2 символа</p>
      </div>
    )}
    
    {/* No results */}
    {!error && query.length >= 2 && results.length === 0 && (
      <div className={styles.emptyState}>
        <span className={styles.emoji}>😕</span>
        <p>Ничего не найдено по запросу «{query}»</p>
        <p className={styles.hint}>Попробуйте другие ключевые слова</p>
      </div>
    )}
    
    {/* Results */}
    {!error && results.length > 0 && (
      results.map((result, index) => (
        <SearchResultItem key={...} ... />
      ))
    )}
  </div>
)}
```

### CSS for States

```css
/* SearchResults.module.css */

.hintState {
  padding: 24px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.emptyState {
  padding: 32px 24px;
  text-align: center;
  color: #6b7280;
}

.emptyState .emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 12px;
}

.emptyState p {
  margin: 0;
}

.emptyState p:first-of-type {
  font-weight: 500;
  margin-bottom: 8px;
}

.hint {
  font-size: 0.875rem;
  color: #9ca3af;
}

.errorState {
  padding: 24px 16px;
  text-align: center;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 8px;
  margin: 8px;
}

.errorState .errorIcon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 8px;
}

.errorState p {
  margin: 0 0 4px 0;
}

.errorState .hint {
  color: #991b1b;
}
```

### Visual Mockup

```
No Results:
┌─────────────────────────────────┐
│ 🔍 [xyz_____________] ✕        │
├─────────────────────────────────┤
│                                 │
│             😕                  │
│    Ничего не найдено           │
│    по запросу «xyz»             │
│                                 │
│    Попробуйте другие            │
│    ключевые слова               │
│                                 │
└─────────────────────────────────┘

Min Chars:
┌─────────────────────────────────┐
│ 🔍 [м________________] ✕        │
├─────────────────────────────────┤
│                                 │
│    Введите минимум 2 символа    │
│                                 │
└─────────────────────────────────┘

Error:
┌─────────────────────────────────┐
│ 🔍 [________________]           │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ ⚠️                        │  │
│  │ Не удалось загрузить      │  │
│  │ рецепты.                  │  │
│  │ Попробуйте обновить       │  │
│  │ страницу.                 │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Update useSearch Hook (Optional)

Could add `isLoading` and `error` to hook return:

```typescript
// useSearch.ts
export function useSearch(): UseSearchReturn {
  const { allRecipes, isLoading, error } = useRecipes();
  // ...
  
  return {
    query,
    setQuery,
    results,
    clearSearch,
    isLoading,  // NEW
    error,      // NEW
  };
}
```

### Files to Modify

```
src/
├── components/
│   ├── SearchBar/
│   │   └── SearchBar.tsx              [MODIFY - add states]
│   ├── SearchResults/
│   │   ├── SearchResults.tsx          [MODIFY - add states]
│   │   └── SearchResults.module.css   [MODIFY - add styles]
│   ├── HeroSearchBar/
│   │   ├── HeroSearchBar.tsx          [MODIFY - add states]
│   │   └── HeroSearchBar.module.css   [MODIFY - add styles]
│   └── MobileSearchOverlay/
│       ├── MobileSearchOverlay.tsx    [MODIFY - add states]
│       └── MobileSearchOverlay.module.css [MODIFY - add styles]
├── hooks/
│   └── useSearch.ts                   [OPTIONAL - expose error]
```

### Testing Checklist

| Scenario | Expected |
|----------|----------|
| Type 1 char ("м") | "Введите минимум 2 символа" |
| Type 2+ chars, no match | "😕 Ничего не найдено..." |
| Type 2+ chars, has match | Results shown |
| Network error | Error message shown |
| Clear search | Dropdown closes |

### References

- [Source: src/context/RecipesContext.tsx] - Error state
- [Source: src/hooks/useSearch.ts] - Current hook
- [Source: _bmad-output/epics-search-feature.md#Story-5.2] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
