# Story 3.3: Mobile Result Navigation

Status: ready-for-dev

## Story

As a **mobile user**,
I want **to tap a result and see the recipe**,
so that **I can access recipes found via search**.

## Acceptance Criteria

1. Tapping result closes overlay
2. Navigates to correct category page
3. Target recipe opens/expands
4. Smooth transition (no jarring jumps)

## Tasks / Subtasks

- [ ] Task 1: Verify navigation flow (AC: #1, #2)
  - [ ] Ensure `onResultClick` closes overlay first
  - [ ] Navigate to `/category/{category}?recipe={title}`
  - [ ] Reuse existing navigation handler from EPIC-2

- [ ] Task 2: Verify recipe expansion (AC: #3)
  - [ ] Confirm RecipeList reads `initialExpanded` prop
  - [ ] Recipe should auto-expand from URL param
  - [ ] Test on mobile viewport

- [ ] Task 3: Ensure smooth transition (AC: #4)
  - [ ] Overlay closes smoothly
  - [ ] Page loads without jarring jumps
  - [ ] Recipe scrolls into view smoothly

- [ ] Task 4: Test complete mobile flow
  - [ ] Open overlay via mobile button
  - [ ] Type search query
  - [ ] Tap result
  - [ ] Verify overlay closes and recipe displays

## Dev Notes

### Navigation Already Implemented

Story 2.4 already implemented recipe navigation with URL params. The mobile flow should reuse the same handler:

```typescript
// In CategoryPage (App.tsx)
const handleSearchResultClick = (result: SearchResult) => {
  const encodedTitle = encodeURIComponent(result.recipe.title);
  navigate(`/category/${result.category}?recipe=${encodedTitle}`);
};
```

### Mobile Overlay Integration

From Story 3.2, the overlay passes this handler:

```tsx
<MobileSearchOverlay
  isOpen={isMobileSearchOpen}
  onClose={() => setIsMobileSearchOpen(false)}
  onResultClick={handleSearchResultClick}  // Same handler as desktop
/>
```

### Result Click Handler in Overlay

In MobileSearchOverlay (from Story 3.2):

```typescript
const handleResultClick = (result: SearchResult) => {
  onResultClick(result);  // Triggers navigation
  clearSearch();           // Clears search state
  onClose();               // Closes overlay (AC: #1)
};
```

### Smooth Transition Considerations (AC: #4)

1. **Overlay close animation**: Already has fade-out via CSS
2. **Navigation delay**: Consider small delay before navigation if needed
3. **Scroll behavior**: RecipeList uses `scrollIntoView({ behavior: 'smooth' })`

### Optional Enhancement: Transition Timing

If overlay closing feels abrupt, add small delay:

```typescript
const handleResultClick = (result: SearchResult) => {
  clearSearch();
  onClose();
  
  // Small delay for overlay close animation
  setTimeout(() => {
    onResultClick(result);
  }, 100);
};
```

### RecipeList Scroll (from EPIC-2)

```typescript
// RecipeList.tsx - already implemented
useEffect(() => {
  if (expanded && expandedRef.current) {
    setTimeout(() => {
      expandedRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }
}, [expanded]);
```

### Testing Checklist

| Step | Expected Result |
|------|-----------------|
| Tap mobile search icon | Overlay opens with focus on input |
| Type "морков" | Results appear |
| Tap "Морковный салат" | Overlay closes |
| After navigation | Salads category loads |
| After load | Recipe "Морковный салат" is expanded |
| After expand | Recipe scrolls into view |
| Tap back button | Returns to previous page |

### Edge Cases

1. **Same category**: If already on salads and tap salad result, page should still update `initialExpanded`
2. **Different category**: Navigation works normally
3. **No recipe match**: If recipe title doesn't exist (edge case), page loads without expansion

### Files to Verify/Modify

Most of this story is verification, but may need small tweaks:

```
src/
├── App.tsx                              [VERIFY - handler shared]
├── components/
│   ├── MobileSearchOverlay/
│   │   └── MobileSearchOverlay.tsx      [VERIFY/TWEAK - timing]
│   └── RecipeList/
│       └── RecipeList.tsx               [VERIFY - scroll smooth]
```

### Mobile Viewport Testing

Test on these viewport sizes:
- iPhone SE: 375x667
- iPhone 12/13: 390x844
- Samsung Galaxy: 360x800

Ensure:
- Touch targets are 44x44px minimum
- Results list scrolls properly
- No horizontal overflow

### References

- [Source: src/App.tsx#27-31] - handleSearchResultClick
- [Source: _bmad-output/story-2-4-navigate-to-recipe.md] - Navigation implementation
- [Source: _bmad-output/story-3-2-mobile-search-overlay.md] - Overlay component
- [Source: src/components/RecipeList/RecipeList.tsx] - Scroll implementation

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
