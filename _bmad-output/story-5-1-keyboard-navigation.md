# Story 5.1: Keyboard Navigation

Status: ready-for-dev

## Story

As a **keyboard user**,
I want **to navigate search results with arrow keys**,
so that **I can use search without a mouse**.

## Acceptance Criteria

1. ↓ Arrow moves focus to first/next result
2. ↑ Arrow moves focus to previous result
3. Enter opens focused result
4. Escape closes results/overlay
5. Tab navigates naturally through UI

## Tasks / Subtasks

- [ ] Task 1: Add keyboard state to SearchBar (AC: #1, #2)
  - [ ] Track `focusedIndex` state (-1 = input focused, 0+ = result index)
  - [ ] Handle ArrowDown to increment index
  - [ ] Handle ArrowUp to decrement index
  - [ ] Wrap around or stop at boundaries

- [ ] Task 2: Add Enter key handling (AC: #3)
  - [ ] If result focused, trigger `onResultClick`
  - [ ] If input focused, do nothing (or focus first result)

- [ ] Task 3: Add Escape handling (AC: #4)
  - [ ] Close dropdown on Escape
  - [ ] Clear search query
  - [ ] Return focus to input

- [ ] Task 4: Visual focus indicator (AC: #1, #2)
  - [ ] Highlight focused result with background color
  - [ ] Ensure visible focus ring

- [ ] Task 5: Apply to all search components
  - [ ] SearchBar (header)
  - [ ] HeroSearchBar (homepage)
  - [ ] MobileSearchOverlay

- [ ] Task 6: Tab navigation (AC: #5)
  - [ ] Ensure natural tab order
  - [ ] Input → Clear button → Results (if needed)

## Dev Notes

### Keyboard Navigation Pattern

```typescript
// In SearchBar.tsx or shared hook

const [focusedIndex, setFocusedIndex] = useState(-1);

const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      setFocusedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
      break;
      
    case 'ArrowUp':
      event.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
      break;
      
    case 'Enter':
      if (focusedIndex >= 0 && results[focusedIndex]) {
        handleResultClick(results[focusedIndex]);
      }
      break;
      
    case 'Escape':
      clearSearch();
      setIsOpen(false);
      break;
  }
};

// Reset focus when results change
useEffect(() => {
  setFocusedIndex(-1);
}, [results]);
```

### Pass focusedIndex to SearchResults

```tsx
<SearchResults
  results={results}
  onResultClick={handleResultClick}
  onClose={() => setIsOpen(false)}
  focusedIndex={focusedIndex}  // NEW
/>
```

### Highlight Focused Result

```tsx
// SearchResultItem.tsx
interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
  isFocused?: boolean;  // NEW
}

function SearchResultItem({ result, onClick, isFocused }: SearchResultItemProps) {
  return (
    <div 
      className={`${styles.resultItem} ${isFocused ? styles.focused : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={isFocused}
    >
      {/* ... */}
    </div>
  );
}
```

### CSS for Focus State

```css
/* SearchResults.module.css */
.resultItem.focused {
  background-color: #f3f4f6;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}
```

### SearchResults with focusedIndex

```tsx
// SearchResults.tsx
interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
  focusedIndex?: number;  // NEW
}

export default function SearchResults({ 
  results, 
  onResultClick, 
  onClose,
  focusedIndex = -1
}: SearchResultsProps) {
  // ...
  
  return (
    <div ref={dropdownRef} className={styles.dropdown} role="listbox">
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.recipe.title}-${index}`}
          result={result}
          onClick={() => onResultClick(result)}
          isFocused={index === focusedIndex}  // NEW
        />
      ))}
    </div>
  );
}
```

### Optional: Create useKeyboardNavigation Hook

For reuse across SearchBar, HeroSearchBar, MobileSearchOverlay:

```typescript
// src/hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation(
  results: SearchResult[],
  onSelect: (result: SearchResult) => void,
  onClose: () => void
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // ... keyboard logic
  };

  useEffect(() => {
    setFocusedIndex(-1);
  }, [results]);

  return { focusedIndex, handleKeyDown };
}
```

### Files to Modify

```
src/
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.tsx              [MODIFY - add keyboard]
│   │   └── SearchBar.module.css       [MODIFY - focus styles]
│   ├── SearchResults/
│   │   ├── SearchResults.tsx          [MODIFY - focusedIndex prop]
│   │   ├── SearchResultItem.tsx       [MODIFY - isFocused prop]
│   │   └── SearchResults.module.css   [MODIFY - focus styles]
│   ├── HeroSearchBar/
│   │   └── HeroSearchBar.tsx          [MODIFY - add keyboard]
│   └── MobileSearchOverlay/
│       └── MobileSearchOverlay.tsx    [MODIFY - add keyboard]
├── hooks/
│   └── useKeyboardNavigation.ts       [NEW - optional]
```

### Testing Checklist

| Action | Expected Result |
|--------|-----------------|
| Type query, press ↓ | First result highlighted |
| Press ↓ again | Next result highlighted |
| Press ↑ | Previous result highlighted |
| Press ↑ at first | Input focused (index -1) |
| Press Enter on result | Navigates to recipe |
| Press Escape | Closes results, clears search |
| Tab from input | Moves to clear button (if visible) |

### References

- [Source: src/components/SearchBar/SearchBar.tsx] - Current SearchBar
- [Source: src/components/SearchResults/SearchResults.tsx] - Current SearchResults
- [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
