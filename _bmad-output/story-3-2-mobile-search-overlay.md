# Story 3.2: Create MobileSearchOverlay Component

Status: ready-for-dev

## Story

As a **mobile user**,
I want **a full-screen search overlay**,
so that **I can search comfortably on small screens**.

## Acceptance Criteria

1. Overlay slides down from top (or fades in)
2. Semi-transparent backdrop behind overlay
3. Search input auto-focuses when overlay opens
4. Keyboard opens automatically (from auto-focus)
5. Close button (✕) in top-right
6. Tapping backdrop closes overlay
7. Results scroll within overlay
8. Body scroll disabled when overlay open

## Tasks / Subtasks

- [ ] Task 1: Create MobileSearchOverlay component (AC: #1, #2)
  - [ ] Create `src/components/MobileSearchOverlay/MobileSearchOverlay.tsx`
  - [ ] Create `src/components/MobileSearchOverlay/MobileSearchOverlay.module.css`
  - [ ] Implement overlay container with backdrop

- [ ] Task 2: Implement overlay header (AC: #3, #5)
  - [ ] Search input with 🔍 icon
  - [ ] Close button (✕) on right
  - [ ] Auto-focus input on mount

- [ ] Task 3: Implement animation (AC: #1)
  - [ ] Add CSS animation (slide down or fade in)
  - [ ] Smooth transition on open/close

- [ ] Task 4: Implement backdrop (AC: #2, #6)
  - [ ] Semi-transparent background
  - [ ] Click on backdrop closes overlay

- [ ] Task 5: Display search results (AC: #7)
  - [ ] Reuse SearchResultItem component
  - [ ] Scrollable results area
  - [ ] Show empty/no results states

- [ ] Task 6: Disable body scroll (AC: #8)
  - [ ] Add `overflow: hidden` to body when open
  - [ ] Remove on close

- [ ] Task 7: Integrate with App.tsx
  - [ ] Import MobileSearchOverlay
  - [ ] Render conditionally based on state
  - [ ] Pass onResultClick handler

## Dev Notes

### Component Interface

```typescript
// src/components/MobileSearchOverlay/MobileSearchOverlay.tsx
import type { SearchResult } from '../../utils/searchRecipes';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export default function MobileSearchOverlay({ 
  isOpen, 
  onClose, 
  onResultClick 
}: MobileSearchOverlayProps): JSX.Element | null;
```

### CSS Structure

```css
/* src/components/MobileSearchOverlay/MobileSearchOverlay.module.css */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* Backdrop */
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease-out;
}

/* Content area */
.content {
  position: relative;
  background: white;
  animation: slideDown 0.3s ease-out;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header with search input */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.searchInputContainer {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.searchIcon {
  position: absolute;
  left: 10px;
  color: #9ca3af;
  pointer-events: none;
}

.searchInput {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px; /* Prevents zoom on iOS */
}

.searchInput:focus {
  outline: none;
  border-color: #3b82f6;
}

.closeButton {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Results area */
.results {
  flex: 1;
  overflow-y: auto;
  background: white;
}

/* Empty state */
.emptyState {
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Component Implementation

```tsx
import { useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import type { SearchResult } from '../../utils/searchRecipes';
import SearchResultItem from '../SearchResults/SearchResultItem';
import styles from './MobileSearchOverlay.module.css';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export default function MobileSearchOverlay({ 
  isOpen, 
  onClose, 
  onResultClick 
}: MobileSearchOverlayProps) {
  const { query, setQuery, results, clearSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when overlay opens (AC: #3, #4)
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Disable body scroll when open (AC: #8)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle close
  const handleClose = () => {
    clearSearch();
    onClose();
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    clearSearch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {/* Backdrop (AC: #2, #6) */}
      <div className={styles.backdrop} onClick={handleClose} />
      
      {/* Content (AC: #1) */}
      <div className={styles.content}>
        {/* Header with search (AC: #3, #5) */}
        <div className={styles.header}>
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Найти рецепт или ингредиент..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Поиск рецептов"
            />
          </div>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть поиск"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Results (AC: #7) */}
        <div className={styles.results}>
          {query.length >= 2 && results.length === 0 ? (
            <div className={styles.emptyState}>
              😕 Ничего не найдено по запросу «{query}»
            </div>
          ) : (
            results.map((result, index) => (
              <SearchResultItem
                key={`${result.recipe.title}-${index}`}
                result={result}
                onClick={() => handleResultClick(result)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

### Integration with App.tsx

```tsx
import MobileSearchOverlay from './components/MobileSearchOverlay/MobileSearchOverlay';

function CategoryPage() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // ... existing code ...

  const handleSearchResultClick = (result: SearchResult) => {
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };

  return (
    <div className="app-container">
      {/* ... header ... */}
      
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        onResultClick={handleSearchResultClick}
      />
      
      {/* ... rest ... */}
    </div>
  );
}
```

### Visual Mockup Reference

```
┌─────────────────────────────────┐
│ 🔍 [________________] ✕        │ ← Sticky header
├─────────────────────────────────┤
│                                 │
│ 🥗 Морковный салат             │
│    Салаты • в названии         │
│ ─────────────────────────────  │
│ 🐟 Форель с лимоном            │
│    Рыбное • в ингредиентах     │
│ ─────────────────────────────  │
│ ...                             │
│                                 │
│        [backdrop area]          │
│                                 │
└─────────────────────────────────┘
```

### Project Structure

Create new files:
```
src/
├── components/
│   └── MobileSearchOverlay/
│       ├── MobileSearchOverlay.tsx       [NEW]
│       └── MobileSearchOverlay.module.css [NEW]
```

Modify:
```
src/
├── App.tsx    [MODIFY - add overlay render]
```

### iOS Input Zoom Prevention

Use `font-size: 16px` on input to prevent iOS zoom:
```css
.searchInput {
  font-size: 16px; /* Prevents zoom on iOS */
}
```

### Reusing SearchResultItem

Import existing component from EPIC-2:
```typescript
import SearchResultItem from '../SearchResults/SearchResultItem';
```

### References

- [Source: src/components/SearchResults/SearchResultItem.tsx] - Reusable result item
- [Source: src/hooks/useSearch.ts] - Search hook
- [Source: _bmad-output/story-3-1-mobile-search-icon.md] - Mobile button state
- [Source: _bmad-output/epics-search-feature.md#Story-3.2] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
