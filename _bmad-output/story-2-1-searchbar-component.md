# Story 2.1: Create SearchBar Component

Status: ready-for-dev

## Story

As a **user**,
I want **a search input in the header**,
so that **I can search from any page**.

## Acceptance Criteria

1. Search input with 🔍 icon on left
2. Placeholder: "Найти рецепт или ингредиент..."
3. Clear button (✕) appears when input has text
4. Input has visible focus state
5. Responsive width (see breakpoints below)

## Tasks / Subtasks

- [ ] Task 1: Create SearchBar component structure (AC: #1, #2)
  - [ ] Create `src/components/SearchBar/SearchBar.tsx`
  - [ ] Create `src/components/SearchBar/SearchBar.module.css`
  - [ ] Add search icon (🔍) on the left side
  - [ ] Add input with placeholder "Найти рецепт или ингредиент..."

- [ ] Task 2: Implement clear button (AC: #3)
  - [ ] Add clear button (✕) inside input container
  - [ ] Show only when input has text
  - [ ] onClick calls `clearSearch()` from `useSearch`

- [ ] Task 3: Style focus state (AC: #4)
  - [ ] Add visible focus ring/border on input focus
  - [ ] Ensure accessibility (visible for keyboard users)

- [ ] Task 4: Implement responsive width (AC: #5)
  - [ ] Desktop (≥1024px): 300px width
  - [ ] Tablet (768-1023px): 250px width
  - [ ] Mobile (< 768px): Hidden (will be replaced by icon in EPIC-3)

- [ ] Task 5: Connect to useSearch hook
  - [ ] Use `useSearch` hook from EPIC-1
  - [ ] Bind `query` to input value
  - [ ] Bind `setQuery` to onChange
  - [ ] Pass `results` to children (for Story 2.2)

## Dev Notes

### Component Interface

```typescript
// src/components/SearchBar/SearchBar.tsx

interface SearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

export default function SearchBar({ onResultClick }: SearchBarProps): JSX.Element;
```

### Hook Integration (from EPIC-1)

```typescript
import { useSearch } from '../../hooks/useSearch';

function SearchBar({ onResultClick }: SearchBarProps) {
  const { query, setQuery, results, clearSearch } = useSearch();
  
  // ...
}
```

### CSS Module Structure

```css
/* src/components/SearchBar/SearchBar.module.css */

.searchContainer {
  position: relative;
  display: flex;
  align-items: center;
}

.searchInput {
  /* Input styles */
  padding: 8px 36px 8px 36px; /* Space for icons on both sides */
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
}

.searchInput:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.searchIcon {
  position: absolute;
  left: 10px;
  color: #9ca3af;
  pointer-events: none;
}

.clearButton {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
}

.clearButton:hover {
  color: #6b7280;
}

/* Responsive widths */
@media (max-width: 1023px) {
  .searchInput {
    width: 250px;
  }
}

@media (max-width: 767px) {
  .searchContainer {
    display: none; /* Hidden on mobile - EPIC-3 adds icon */
  }
}
```

### JSX Structure

```tsx
<div className={styles.searchContainer}>
  <span className={styles.searchIcon}>🔍</span>
  <input
    type="text"
    className={styles.searchInput}
    placeholder="Найти рецепт или ингредиент..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    aria-label="Поиск рецептов"
  />
  {query && (
    <button 
      className={styles.clearButton}
      onClick={clearSearch}
      aria-label="Очистить поиск"
    >
      ✕
    </button>
  )}
  
  {/* SearchResults will be added in Story 2.2 */}
</div>
```

### Project Structure

Create new files:
```
src/
├── components/
│   └── SearchBar/
│       ├── SearchBar.tsx       [NEW]
│       └── SearchBar.module.css [NEW]
```

### Design Tokens (match existing styles)

From `App.css`:
- Border color: `#e5e7eb` (light gray)
- Focus color: `#3b82f6` (blue)
- Background: `white`
- Border radius: `8px`

### Accessibility Requirements

- `aria-label="Поиск рецептов"` on input
- `aria-label="Очистить поиск"` on clear button
- Visible focus state for keyboard navigation

### References

- [Source: src/hooks/useSearch.ts] - useSearch hook API
- [Source: src/App.css] - Existing design tokens
- [Source: _bmad-output/epics-search-feature.md#Story-2.1] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
