# Story 4.1: Create Hero SearchBar

Status: ready-for-dev

## Story

As a **user on the homepage**,
I want **a prominent search bar**,
so that **search is the primary way to find recipes**.

## Acceptance Criteria

1. Large search bar centered in hero section
2. Larger text size than header search
3. Same functionality as header search (uses `useSearch` hook)
4. Results dropdown or inline results below
5. Works on all screen sizes

## Tasks / Subtasks

- [ ] Task 1: Create HeroSearchBar component (AC: #1, #2)
  - [ ] Create `src/components/HeroSearchBar/HeroSearchBar.tsx`
  - [ ] Create `src/components/HeroSearchBar/HeroSearchBar.module.css`
  - [ ] Larger input styling (font-size: 18px, more padding)
  - [ ] Centered layout

- [ ] Task 2: Connect to useSearch hook (AC: #3)
  - [ ] Import and use `useSearch` hook
  - [ ] Same query/setQuery/results/clearSearch logic

- [ ] Task 3: Add results dropdown (AC: #4)
  - [ ] Reuse SearchResultItem for results
  - [ ] Position dropdown below input
  - [ ] Style dropdown for hero context

- [ ] Task 4: Implement responsive design (AC: #5)
  - [ ] Full width on mobile
  - [ ] Max-width on desktop (e.g., 500px)
  - [ ] Consistent appearance across breakpoints

- [ ] Task 5: Integrate into HomePage (AC: #1)
  - [ ] Import HeroSearchBar into HomePage
  - [ ] Add to hero section after subtitle
  - [ ] Handle result click navigation

## Dev Notes

### Component Interface

```typescript
// src/components/HeroSearchBar/HeroSearchBar.tsx
import type { SearchResult } from '../../utils/searchRecipes';

interface HeroSearchBarProps {
  onResultClick: (result: SearchResult) => void;
}

export default function HeroSearchBar({ onResultClick }: HeroSearchBarProps): JSX.Element;
```

### CSS Implementation

```css
/* src/components/HeroSearchBar/HeroSearchBar.module.css */

.heroSearchContainer {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 24px auto 0;
}

.searchInputWrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.searchIcon {
  position: absolute;
  left: 16px;
  font-size: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.heroSearchInput {
  width: 100%;
  padding: 16px 48px 16px 48px;
  font-size: 18px;
  border: 2px solid #b3d9be;
  border-radius: 12px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.heroSearchInput:focus {
  outline: none;
  border-color: #226632;
  box-shadow: 0 0 0 4px rgba(34, 102, 50, 0.1);
}

.heroSearchInput::placeholder {
  color: #9ca3af;
}

.clearButton {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  min-width: 32px;
  min-height: 32px;
}

.clearButton:hover {
  color: #6b7280;
}

/* Results dropdown */
.resultsDropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
}

/* Responsive */
@media (max-width: 600px) {
  .heroSearchContainer {
    max-width: 100%;
  }
  
  .heroSearchInput {
    font-size: 16px; /* Prevent iOS zoom */
    padding: 14px 44px;
  }
}
```

### Component Implementation

```tsx
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import type { SearchResult } from '../../utils/searchRecipes';
import SearchResultItem from '../SearchResults/SearchResultItem';
import styles from './HeroSearchBar.module.css';

interface HeroSearchBarProps {
  onResultClick: (result: SearchResult) => void;
}

export default function HeroSearchBar({ onResultClick }: HeroSearchBarProps) {
  const { query, setQuery, results, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Open dropdown when results exist
  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    clearSearch();
    setIsOpen(false);
  };

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.heroSearchContainer}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.heroSearchInput}
          placeholder="Найти рецепт или ингредиент..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск рецептов"
        />
        {query && (
          <button 
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Очистить поиск"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.resultsDropdown}>
          {results.map((result, index) => (
            <SearchResultItem
              key={`${result.recipe.title}-${index}`}
              result={result}
              onClick={() => handleResultClick(result)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### HomePage Integration

```tsx
// src/components/HomePage/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import HeroSearchBar from '../HeroSearchBar/HeroSearchBar';
import type { SearchResult } from '../../utils/searchRecipes';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearchResultClick = (result: SearchResult) => {
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };

  return (
    <div className={`container ${styles.homepage}`}>
      <header className={styles.hero}>
        <h1>🌿 Домашние рецепты</h1>
        <p>Простые, вкусные и проверенные блюда для будней и праздников</p>
        <HeroSearchBar onResultClick={handleSearchResultClick} />
      </header>
      {/* ... rest ... */}
    </div>
  );
}
```

### Visual Mockup

```
┌──────────────────────────────────────────────┐
│                                              │
│          🌿 Домашние рецепты                 │
│  Простые, вкусные и проверенные блюда       │
│                                              │
│   🔍 [Найти рецепт или ингредиент...    ]   │
│                                              │
│         [Results appear here...]             │
│                                              │
├──────────────────────────────────────────────┤
│       Категории рецептов                     │
│   [Салаты] [Рыбное] [Мясное] ...            │
└──────────────────────────────────────────────┘
```

### Project Structure

Create new files:
```
src/
├── components/
│   └── HeroSearchBar/
│       ├── HeroSearchBar.tsx       [NEW]
│       └── HeroSearchBar.module.css [NEW]
```

Modify:
```
src/
├── components/
│   └── HomePage/
│       └── HomePage.tsx            [MODIFY - add HeroSearchBar]
```

### Design Consistency with Hero Section

Match hero section colors from `HomePage.module.css`:
- Hero background: `#eaf7ed`
- Border accent: `#b3d9be`
- Text accent: `#226632`

### References

- [Source: src/components/HomePage/HomePage.tsx] - Current HomePage
- [Source: src/components/HomePage/HomePage.module.css] - Hero styles
- [Source: src/hooks/useSearch.ts] - Search hook
- [Source: src/components/SearchResults/SearchResultItem.tsx] - Reusable item

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
