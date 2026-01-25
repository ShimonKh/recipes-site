# Story 5.3: Accessibility Audit

Status: ready-for-dev

## Story

As a **user with disabilities**,
I want **search to be fully accessible**,
so that **I can use it with assistive technology**.

## Acceptance Criteria

1. `aria-label="Поиск рецептов"` on search input
2. `role="listbox"` on results container
3. `role="option"` on each result
4. `aria-expanded` reflects dropdown state
5. `aria-activedescendant` for keyboard navigation
6. Color contrast meets WCAG AA (4.5:1)
7. Focus visible on all interactive elements

## Tasks / Subtasks

- [ ] Task 1: Add ARIA labels to inputs (AC: #1)
  - [ ] Verify `aria-label` on all search inputs
  - [ ] Add `aria-label` to clear buttons
  - [ ] Add `aria-label` to mobile search button

- [ ] Task 2: Add listbox ARIA pattern (AC: #2, #3)
  - [ ] Add `role="listbox"` to results container
  - [ ] Add `role="option"` to each result item
  - [ ] Add unique `id` to each option

- [ ] Task 3: Add expanded state (AC: #4)
  - [ ] Add `aria-expanded` to search input/container
  - [ ] Update when dropdown opens/closes
  - [ ] Add `aria-haspopup="listbox"`

- [ ] Task 4: Add activedescendant (AC: #5)
  - [ ] Track focused item id
  - [ ] Set `aria-activedescendant` on input
  - [ ] Update when keyboard navigating

- [ ] Task 5: Check color contrast (AC: #6)
  - [ ] Audit all text colors
  - [ ] Ensure 4.5:1 ratio for normal text
  - [ ] Ensure 3:1 ratio for large text
  - [ ] Fix any failing colors

- [ ] Task 6: Ensure visible focus (AC: #7)
  - [ ] Check focus ring on input
  - [ ] Check focus ring on clear button
  - [ ] Check focus ring on mobile button
  - [ ] Check focus state on result items
  - [ ] Ensure high contrast focus indicators

## Dev Notes

### Complete ARIA Pattern for Search

```tsx
// SearchBar.tsx with full ARIA support

function SearchBar({ onResultClick }: SearchBarProps) {
  const { query, setQuery, results, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputId = 'search-input';
  const listboxId = 'search-results';

  // Generate unique IDs for results
  const getOptionId = (index: number) => `search-option-${index}`;

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon} aria-hidden="true">🔍</span>
      <input
        id={inputId}
        type="text"
        className={styles.searchInput}
        placeholder="Найти рецепт или ингредиент..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Поиск рецептов"                              // AC: #1
        aria-expanded={isOpen}                                    // AC: #4
        aria-haspopup="listbox"                                   // AC: #4
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={                                   // AC: #5
          focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined
        }
        role="combobox"
        autoComplete="off"
      />
      {query && (
        <button 
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Очистить поиск"                             // AC: #1
          type="button"
        >
          ✕
        </button>
      )}
      
      {isOpen && results.length > 0 && (
        <div
          id={listboxId}
          className={styles.dropdown}
          role="listbox"                                          // AC: #2
          aria-label="Результаты поиска"
        >
          {results.map((result, index) => (
            <SearchResultItem
              key={`${result.recipe.title}-${index}`}
              id={getOptionId(index)}                             // For aria-activedescendant
              result={result}
              onClick={() => handleResultClick(result)}
              isFocused={index === focusedIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### SearchResultItem with ARIA

```tsx
// SearchResultItem.tsx
interface SearchResultItemProps {
  id: string;                    // NEW - for aria-activedescendant
  result: SearchResult;
  onClick: () => void;
  isFocused?: boolean;
}

function SearchResultItem({ id, result, onClick, isFocused }: SearchResultItemProps) {
  const emoji = categoryEmojis[result.category];
  const context = getMatchContext(result.matchType, result.matchText);

  return (
    <div
      id={id}                                                     // For aria-activedescendant
      className={`${styles.resultItem} ${isFocused ? styles.focused : ''}`}
      onClick={onClick}
      role="option"                                               // AC: #3
      aria-selected={isFocused}
    >
      <span className={styles.emoji} aria-hidden="true">{emoji}</span>
      <div className={styles.resultContent}>
        <div className={styles.title}>{result.recipe.title}</div>
        <div className={styles.matchContext}>{context}</div>
      </div>
    </div>
  );
}
```

### Color Contrast Check

Current colors to verify:

| Element | Foreground | Background | Ratio Required |
|---------|------------|------------|----------------|
| Input text | #111827 | #ffffff | 4.5:1 ✓ |
| Placeholder | #9ca3af | #ffffff | Check! |
| Result title | #111827 | #ffffff | 4.5:1 ✓ |
| Match context | #6b7280 | #ffffff | Check! |
| Hint text | #9ca3af | #ffffff | Check! |
| Error text | #dc2626 | #fef2f2 | Check! |

**If contrast fails**, update colors:
- `#9ca3af` → `#6b7280` (darker gray)
- Or increase font weight

### Focus Ring Styles

```css
/* Ensure high-contrast focus for all interactive elements */

.searchInput:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.clearButton:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.resultItem:focus,
.resultItem.focused {
  background-color: #f3f4f6;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* MobileSearchButton */
.mobileSearchButton:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### ARIA Cheat Sheet

| Attribute | Element | Value |
|-----------|---------|-------|
| `role="combobox"` | input | Indicates search input |
| `role="listbox"` | dropdown | Results container |
| `role="option"` | result item | Each result |
| `aria-label` | input | "Поиск рецептов" |
| `aria-expanded` | input | true/false |
| `aria-haspopup` | input | "listbox" |
| `aria-controls` | input | listbox id |
| `aria-activedescendant` | input | focused option id |
| `aria-selected` | option | true/false |
| `aria-hidden` | icons | true (decorative) |

### Files to Modify

```
src/
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.tsx              [MODIFY - full ARIA]
│   │   └── SearchBar.module.css       [MODIFY - focus styles]
│   ├── SearchResults/
│   │   ├── SearchResults.tsx          [MODIFY - role, id]
│   │   ├── SearchResultItem.tsx       [MODIFY - role, id, aria-selected]
│   │   └── SearchResults.module.css   [MODIFY - focus styles]
│   ├── HeroSearchBar/
│   │   ├── HeroSearchBar.tsx          [MODIFY - full ARIA]
│   │   └── HeroSearchBar.module.css   [MODIFY - focus styles]
│   ├── MobileSearchOverlay/
│   │   ├── MobileSearchOverlay.tsx    [MODIFY - full ARIA]
│   │   └── MobileSearchOverlay.module.css [MODIFY - focus]
│   └── MobileSearchButton/
│       └── MobileSearchButton.tsx     [MODIFY - aria-label]
```

### Testing Tools

1. **Browser DevTools** - Accessibility panel
2. **axe DevTools** - Chrome extension
3. **WAVE** - Web accessibility evaluation
4. **Keyboard-only testing** - Navigate without mouse
5. **Screen reader** - VoiceOver (Mac), NVDA (Windows)

### Screen Reader Announcements

When implemented correctly:
- "Поиск рецептов, combobox, expanded"
- "Результаты поиска, listbox, 5 items"
- "Морковный салат, option, 1 of 5"

### Testing Checklist

| Test | Expected |
|------|----------|
| Tab to search | Focus ring visible |
| Type query | Results announced |
| Arrow down | "Option 1 of N" announced |
| Enter on option | Navigates to recipe |
| axe DevTools scan | No critical issues |
| Color contrast check | All pass 4.5:1 |

### References

- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Source: src/components/SearchBar/SearchBar.tsx] - Current implementation

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
