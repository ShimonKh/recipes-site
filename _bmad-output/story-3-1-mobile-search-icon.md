# Story 3.1: Create Mobile Search Icon Button

Status: ready-for-dev

## Story

As a **mobile user**,
I want **a search icon in the header**,
so that **I can access search without it taking header space**.

## Acceptance Criteria

1. Show only 🔍 icon on mobile (< 768px)
2. Icon is tappable (44x44px minimum touch target)
3. Tapping icon opens search overlay
4. Hide full search bar on mobile (already done in EPIC-2)

## Tasks / Subtasks

- [ ] Task 1: Create MobileSearchButton component (AC: #1, #2)
  - [ ] Create `src/components/MobileSearchButton/MobileSearchButton.tsx`
  - [ ] Create `src/components/MobileSearchButton/MobileSearchButton.module.css`
  - [ ] Render 🔍 icon as a button
  - [ ] Set minimum touch target 44x44px

- [ ] Task 2: Show only on mobile (AC: #1)
  - [ ] Hide on desktop (≥768px) using CSS media query
  - [ ] Show on mobile (<768px)

- [ ] Task 3: Handle click to open overlay (AC: #3)
  - [ ] Accept `onClick` prop to open overlay
  - [ ] Button triggers overlay open (overlay created in Story 3.2)

- [ ] Task 4: Add to header in App.tsx (AC: #1)
  - [ ] Import MobileSearchButton
  - [ ] Render alongside SearchBar in header
  - [ ] Manage overlay open state in CategoryPage

## Dev Notes

### Component Interface

```typescript
// src/components/MobileSearchButton/MobileSearchButton.tsx

interface MobileSearchButtonProps {
  onClick: () => void;
}

export default function MobileSearchButton({ onClick }: MobileSearchButtonProps): JSX.Element;
```

### CSS Implementation

```css
/* src/components/MobileSearchButton/MobileSearchButton.module.css */

.mobileSearchButton {
  display: none; /* Hidden by default (desktop) */
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 1.5rem;
  min-width: 44px;
  min-height: 44px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.mobileSearchButton:hover,
.mobileSearchButton:focus {
  background-color: rgba(0, 0, 0, 0.05);
}

.mobileSearchButton:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Show only on mobile */
@media (max-width: 767px) {
  .mobileSearchButton {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

### JSX Structure

```tsx
// MobileSearchButton.tsx
import styles from './MobileSearchButton.module.css';

interface MobileSearchButtonProps {
  onClick: () => void;
}

export default function MobileSearchButton({ onClick }: MobileSearchButtonProps) {
  return (
    <button
      className={styles.mobileSearchButton}
      onClick={onClick}
      aria-label="Открыть поиск"
      type="button"
    >
      🔍
    </button>
  );
}
```

### Integration in App.tsx

```tsx
import MobileSearchButton from './components/MobileSearchButton/MobileSearchButton';
// MobileSearchOverlay will be added in Story 3.2

function CategoryPage() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // ... existing code ...

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-container">
          <div className="header-title">
            <span className="logo-emoji" aria-hidden="true">📚</span>
            <span className="header-text">Книга рецептов</span>
          </div>
          <SearchBar onResultClick={handleSearchResultClick} />
          <MobileSearchButton onClick={() => setIsMobileSearchOpen(true)} />
        </div>
      </header>
      
      {/* MobileSearchOverlay will be added in Story 3.2 */}
      
      {/* ... rest ... */}
    </div>
  );
}
```

### Project Structure

Create new files:
```
src/
├── components/
│   └── MobileSearchButton/
│       ├── MobileSearchButton.tsx       [NEW]
│       └── MobileSearchButton.module.css [NEW]
```

Modify:
```
src/
├── App.tsx    [MODIFY - add MobileSearchButton and state]
```

### Current SearchBar Mobile Behavior (from EPIC-2)

SearchBar is already hidden on mobile:
```css
/* SearchBar.module.css line 57-61 */
@media (max-width: 767px) {
  .searchContainer {
    display: none;
  }
}
```

### Accessibility

- `aria-label="Открыть поиск"` on button
- Minimum 44x44px touch target (WCAG requirement)
- Visible focus state

### References

- [Source: src/components/SearchBar/SearchBar.module.css#57-61] - Mobile hide
- [Source: src/App.tsx#72-98] - Current header structure
- [Source: _bmad-output/epics-search-feature.md#Story-3.1] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
