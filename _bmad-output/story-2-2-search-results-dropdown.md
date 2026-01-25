# Story 2.2: Create SearchResults Dropdown

Status: ready-for-dev

## Story

As a **user**,
I want **to see search results as I type**,
so that **I can quickly find and select a recipe**.

## Acceptance Criteria

1. Dropdown appears below search input when results exist
2. Each result shows: category emoji, title, match context
3. Match context shows where term was found (e.g., "Найдено в ингредиентах: лимон")
4. Dropdown has max-height with scroll for many results
5. Dropdown closes on: click outside, Escape key, clear search

## Tasks / Subtasks

- [ ] Task 1: Create SearchResults component (AC: #1)
  - [ ] Create `src/components/SearchResults/SearchResults.tsx`
  - [ ] Create `src/components/SearchResults/SearchResults.module.css`
  - [ ] Position dropdown absolutely below SearchBar

- [ ] Task 2: Create SearchResultItem component (AC: #2, #3)
  - [ ] Create `src/components/SearchResults/SearchResultItem.tsx`
  - [ ] Display category emoji from `categoryEmojis`
  - [ ] Display recipe title
  - [ ] Display match context based on `matchType`

- [ ] Task 3: Implement match context text (AC: #3)
  - [ ] For `matchType: 'title'` → "в названии"
  - [ ] For `matchType: 'ingredient'` → "в ингредиентах: {matchText truncated}"
  - [ ] For `matchType: 'step'` → "в шагах приготовления"
  - [ ] For `matchType: 'tips'` → "в советах"
  - [ ] For `matchType: 'notes'` → "в заметках"

- [ ] Task 4: Implement scrollable dropdown (AC: #4)
  - [ ] Set max-height (e.g., 400px)
  - [ ] Add overflow-y: auto
  - [ ] Style scrollbar

- [ ] Task 5: Implement close behaviors (AC: #5)
  - [ ] Close on click outside (useEffect with document click listener)
  - [ ] Close on Escape key (onKeyDown handler)
  - [ ] Close when search cleared (automatic - no results)

- [ ] Task 6: Integrate with SearchBar
  - [ ] Import SearchResults into SearchBar
  - [ ] Pass results and onResultClick

## Dev Notes

### Component Interfaces

```typescript
// src/components/SearchResults/SearchResults.tsx
import type { SearchResult } from '../../utils/searchRecipes';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
}

// src/components/SearchResults/SearchResultItem.tsx
interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}
```

### Match Context Logic

```typescript
import type { MatchType } from '../../utils/searchRecipes';
import { categoryEmojis } from '../../data/categoryEmojis';

function getMatchContext(matchType: MatchType, matchText: string): string {
  switch (matchType) {
    case 'title':
      return 'в названии';
    case 'ingredient':
      // Truncate long ingredient text
      const truncated = matchText.length > 30 
        ? matchText.slice(0, 30) + '...' 
        : matchText;
      return `в ингредиентах: ${truncated}`;
    case 'step':
      return 'в шагах приготовления';
    case 'tips':
      return 'в советах';
    case 'notes':
      return 'в заметках';
    default:
      return '';
  }
}
```

### Category Emojis (from EPIC-1)

```typescript
// src/data/categoryEmojis.ts
export const categoryEmojis: Record<Category, string> = {
  salads: '🥗',
  fish: '🐟',
  meat: '🍖',
  sides: '🍽️',
  breakfasts: '🍳',
  soups: '🥣',
  sauces: '🧄',
  desserts: '🍰',
  other: '📦'
};
```

### CSS Structure

```css
/* src/components/SearchResults/SearchResults.module.css */

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
}

.resultItem {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.resultItem:last-child {
  border-bottom: none;
}

.resultItem:hover {
  background-color: #f9fafb;
}

.emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.resultContent {
  flex: 1;
  min-width: 0;
}

.title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.matchContext {
  font-size: 0.875rem;
  color: #6b7280;
}
```

### Click Outside Implementation

```typescript
import { useEffect, useRef } from 'react';

function SearchResults({ results, onResultClick, onClose }: SearchResultsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (results.length === 0) return null;

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.recipe.title}-${index}`}
          result={result}
          onClick={() => onResultClick(result)}
        />
      ))}
    </div>
  );
}
```

### SearchResultItem Component

```tsx
function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const emoji = categoryEmojis[result.category];
  const context = getMatchContext(result.matchType, result.matchText);

  return (
    <div className={styles.resultItem} onClick={onClick} role="option">
      <span className={styles.emoji}>{emoji}</span>
      <div className={styles.resultContent}>
        <div className={styles.title}>{result.recipe.title}</div>
        <div className={styles.matchContext}>{context}</div>
      </div>
    </div>
  );
}
```

### Project Structure

Create new files:
```
src/
├── components/
│   └── SearchResults/
│       ├── SearchResults.tsx      [NEW]
│       ├── SearchResultItem.tsx   [NEW]
│       └── SearchResults.module.css [NEW]
```

Modify:
```
src/
├── components/
│   └── SearchBar/
│       └── SearchBar.tsx          [MODIFY - add SearchResults]
```

### Integration with SearchBar

After this story, SearchBar should render SearchResults:

```tsx
// In SearchBar.tsx
import SearchResults from '../SearchResults/SearchResults';

function SearchBar({ onResultClick }: SearchBarProps) {
  const { query, setQuery, results, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);

  // Open dropdown when there are results
  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    clearSearch();
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer}>
      {/* ... input ... */}
      
      {isOpen && (
        <SearchResults
          results={results}
          onResultClick={handleResultClick}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
```

### References

- [Source: src/utils/searchRecipes.ts] - SearchResult, MatchType interfaces
- [Source: src/data/categoryEmojis.ts] - Category emoji mapping
- [Source: _bmad-output/story-2-1-searchbar-component.md] - SearchBar component
- [Source: _bmad-output/epics-search-feature.md#Story-2.2] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
