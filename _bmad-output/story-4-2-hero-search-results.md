# Story 4.2: Hero Search Results Display

Status: ready-for-dev

## Story

As a **user**,
I want **to see search results on the homepage**,
so that **I can find recipes without leaving the page**.

## Acceptance Criteria

1. Results appear below hero search bar
2. Results replace or overlay category grid temporarily
3. Clear visual distinction between search mode and browse mode
4. Easy to dismiss search and return to categories

## Tasks / Subtasks

- [ ] Task 1: Enhance results display (AC: #1, #2)
  - [ ] Results dropdown already positioned below search (from 4.1)
  - [ ] Consider showing more results on homepage vs header
  - [ ] Optionally hide category grid when search active

- [ ] Task 2: Visual distinction for search mode (AC: #3)
  - [ ] Add visual indicator when in search mode
  - [ ] Optional: dim or blur category section when searching
  - [ ] Show "Результаты поиска" label above results

- [ ] Task 3: Easy dismiss functionality (AC: #4)
  - [ ] Click outside closes results (from 4.1)
  - [ ] Clear button clears and closes
  - [ ] Escape key closes results
  - [ ] Optional: "Показать все категории" link

- [ ] Task 4: Empty state handling
  - [ ] Show message when no results found
  - [ ] "Ничего не найдено по запросу «{query}»"
  - [ ] Suggest trying different keywords

- [ ] Task 5: Test user flow
  - [ ] Search from homepage
  - [ ] Click result → navigates to recipe
  - [ ] Clear search → shows categories again

## Dev Notes

### Enhanced HeroSearchBar (from Story 4.1)

Story 4.1 created basic HeroSearchBar. This story enhances it with better UX:

```tsx
// Enhanced result display with header
{isOpen && (
  <div className={styles.resultsDropdown}>
    {query.length >= 2 && results.length === 0 ? (
      <div className={styles.emptyState}>
        <p>😕 Ничего не найдено по запросу «{query}»</p>
        <p className={styles.hint}>Попробуйте другие ключевые слова</p>
      </div>
    ) : results.length > 0 ? (
      <>
        <div className={styles.resultsHeader}>
          Результаты поиска ({results.length})
        </div>
        {results.map((result, index) => (
          <SearchResultItem
            key={`${result.recipe.title}-${index}`}
            result={result}
            onClick={() => handleResultClick(result)}
          />
        ))}
      </>
    ) : null}
  </div>
)}
```

### Additional CSS

```css
/* Add to HeroSearchBar.module.css */

.resultsHeader {
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
}

.emptyState {
  padding: 32px 24px;
  text-align: center;
  color: #6b7280;
}

.emptyState p:first-child {
  font-size: 1rem;
  margin-bottom: 8px;
}

.hint {
  font-size: 0.875rem;
  color: #9ca3af;
}
```

### Optional: Dim Categories When Searching

If we want to dim the category grid while searching:

```tsx
// In HomePage.tsx
const [isSearching, setIsSearching] = useState(false);

// Pass callback to HeroSearchBar
<HeroSearchBar 
  onResultClick={handleSearchResultClick}
  onSearchStateChange={setIsSearching}
/>

// Apply class to category section
<section className={isSearching ? styles.dimmed : ''}>
  <h2>Категории рецептов</h2>
  {/* ... */}
</section>
```

```css
/* In HomePage.module.css */
.dimmed {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.2s;
}
```

### Escape Key Handler

Add to HeroSearchBar:

```typescript
useEffect(() => {
  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      clearSearch();
      setIsOpen(false);
    }
  }
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [clearSearch]);
```

### Complete User Flow

```
1. User lands on homepage
2. Sees hero section with prominent search bar
3. Types "морков" in search
4. Results appear below search bar
5. Clicks "Морковный салат"
6. Navigates to /category/salads?recipe=Морковный+салат
7. Recipe is expanded
```

### Alternative Flow (Dismiss)

```
1. User types search query
2. Results appear
3. User presses Escape OR clicks outside OR clicks ✕
4. Results disappear
5. Search cleared
6. Categories visible again
```

### Files to Modify

```
src/
├── components/
│   └── HeroSearchBar/
│       ├── HeroSearchBar.tsx       [MODIFY - add empty state, header]
│       └── HeroSearchBar.module.css [MODIFY - add new styles]
│   └── HomePage/
│       └── HomePage.module.css     [OPTIONAL - add dimmed state]
```

### Visual States

| State | What User Sees |
|-------|----------------|
| Default | Hero + Search input + Categories |
| Typing (< 2 chars) | Same as default |
| Searching (results) | Search + "Результаты поиска (N)" + Results list |
| Searching (no results) | Search + Empty state message |
| After click/escape | Returns to default |

### Testing Checklist

- [ ] Type "мор" → results appear with count header
- [ ] Type "xyz123" → empty state message appears
- [ ] Click outside → results close
- [ ] Press Escape → results close, search cleared
- [ ] Click ✕ → search cleared
- [ ] Click result → navigates to recipe
- [ ] Mobile: search works, results scroll properly

### References

- [Source: _bmad-output/story-4-1-hero-searchbar.md] - Base component
- [Source: src/components/SearchResults/SearchResultItem.tsx] - Result item
- [Source: _bmad-output/epics-search-feature.md#Story-4.2] - Original requirements

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
