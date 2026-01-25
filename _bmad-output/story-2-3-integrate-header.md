# Story 2.3: Integrate Search into Header

Status: ready-for-dev

## Story

As a **user**,
I want **search available in the header on all pages**,
so that **I can search without going back to homepage**.

## Acceptance Criteria

1. SearchBar renders in header on CategoryPage
2. SearchBar positioned on right side of header
3. Header layout adjusts for search (flexbox)
4. Results dropdown positioned correctly relative to input

## Tasks / Subtasks

- [ ] Task 1: Update header layout in App.tsx (AC: #2, #3)
  - [ ] Modify `.header-container` to use flexbox
  - [ ] Add `justify-content: space-between`
  - [ ] Position logo/title on left, search on right

- [ ] Task 2: Add SearchBar to CategoryPage header (AC: #1)
  - [ ] Import SearchBar component
  - [ ] Render SearchBar inside header
  - [ ] Pass `onResultClick` handler

- [ ] Task 3: Update header CSS (AC: #3)
  - [ ] Modify `App.css` header styles
  - [ ] Ensure responsive behavior
  - [ ] Maintain vertical centering

- [ ] Task 4: Verify dropdown positioning (AC: #4)
  - [ ] Ensure dropdown appears below input
  - [ ] Check z-index for proper layering
  - [ ] Test on different screen sizes

- [ ] Task 5: Handle navigation from search result
  - [ ] Implement basic navigation to category
  - [ ] (Full navigation with recipe expansion in Story 2.4)

## Dev Notes

### Current Header Structure (App.tsx lines 60-70)

```tsx
<header className="app-header">
  <div className="container header-container">
    <div className="header-title">
      <span className="logo-emoji" aria-hidden="true">📚</span>
      <span className="header-text">Книга рецептов</span>
    </div>
  </div>
</header>
```

### Updated Header Structure

```tsx
import SearchBar from './components/SearchBar/SearchBar';
import type { SearchResult } from './utils/searchRecipes';

function CategoryPage() {
  const navigate = useNavigate();
  // ... existing state ...

  const handleSearchResultClick = (result: SearchResult) => {
    // Navigate to the category of the selected recipe
    navigate(`/category/${result.category}`);
    // Recipe expansion will be handled in Story 2.4
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-container">
          <div className="header-title">
            <span className="logo-emoji" aria-hidden="true">📚</span>
            <span className="header-text">Книга рецептов</span>
          </div>
          <SearchBar onResultClick={handleSearchResultClick} />
        </div>
      </header>
      {/* ... rest of component ... */}
    </div>
  );
}
```

### Updated CSS (App.css)

```css
/* Modify existing .header-container */
.header-container {
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Modify .header-title to not center */
.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  /* Remove: justify-content: center; */
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0; /* Remove bottom margin */
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .header-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .header-title {
    justify-content: center;
  }
}
```

### Files to Modify

```
src/
├── App.tsx                [MODIFY - add SearchBar to header]
├── App.css                [MODIFY - update header layout]
```

### Important: SearchBar z-index

Ensure SearchBar's dropdown has proper z-index to appear above content:

```css
/* In SearchBar.module.css - already should have */
.searchContainer {
  position: relative;
  z-index: 100;
}

/* In SearchResults.module.css - already should have */
.dropdown {
  z-index: 50;
}
```

### Responsive Behavior Summary

| Breakpoint | Logo | SearchBar |
|------------|------|-----------|
| ≥1024px | Left | Right (300px) |
| 768-1023px | Left | Right (250px) |
| <768px | Center | Hidden (EPIC-3) |

### Testing Checklist

- [ ] SearchBar appears in header on `/category/:category` routes
- [ ] Logo stays on left, search on right (desktop/tablet)
- [ ] Dropdown appears below search, not cut off
- [ ] Clicking a result navigates to correct category
- [ ] Header looks good on all screen sizes

### References

- [Source: src/App.tsx#60-70] - Current header structure
- [Source: src/App.css#28-67] - Current header styles
- [Source: _bmad-output/story-2-1-searchbar-component.md] - SearchBar component
- [Source: _bmad-output/story-2-2-search-results-dropdown.md] - SearchResults component

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
