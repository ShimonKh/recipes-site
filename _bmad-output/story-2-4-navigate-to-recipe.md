# Story 2.4: Navigate to Recipe from Search

Status: ready-for-dev

## Story

As a **user**,
I want **to click a search result and see the recipe**,
so that **I can access the recipe I found**.

## Acceptance Criteria

1. Clicking result navigates to `/category/{category}`
2. Correct category page opens
3. Target recipe is auto-expanded (or scrolled into view)
4. Search is cleared after navigation
5. Browser back button works correctly

## Tasks / Subtasks

- [ ] Task 1: Add URL query parameter for recipe (AC: #1, #3)
  - [ ] Update navigation to include recipe title in URL
  - [ ] Format: `/category/salads?recipe=Морковный+салат`
  - [ ] Use `encodeURIComponent` for recipe title

- [ ] Task 2: Read recipe param in CategoryPage (AC: #2, #3)
  - [ ] Use `useSearchParams` from react-router-dom
  - [ ] Extract `recipe` parameter on mount

- [ ] Task 3: Pass expanded recipe to RecipeList (AC: #3)
  - [ ] Add `initialExpanded` prop to RecipeList
  - [ ] Set from URL parameter

- [ ] Task 4: Update RecipeList to handle initial expansion (AC: #3)
  - [ ] Accept `initialExpanded` prop
  - [ ] Set initial `expanded` state from prop
  - [ ] Scroll to expanded recipe after render

- [ ] Task 5: Clear search after navigation (AC: #4)
  - [ ] Ensure `clearSearch()` is called in handler
  - [ ] Verify search input is empty after navigation

- [ ] Task 6: Test browser navigation (AC: #5)
  - [ ] Verify back button returns to previous page
  - [ ] Verify forward button works correctly
  - [ ] Test direct URL access with recipe param

## Dev Notes

### Navigation Handler (App.tsx)

```typescript
import { useNavigate, useSearchParams } from 'react-router-dom';

function CategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get recipe from URL on mount
  const recipeFromUrl = searchParams.get('recipe');

  const handleSearchResultClick = (result: SearchResult) => {
    // Navigate with recipe parameter
    const encodedTitle = encodeURIComponent(result.recipe.title);
    navigate(`/category/${result.category}?recipe=${encodedTitle}`);
  };

  return (
    // ...
    <RecipeList 
      category={selectedCategory} 
      initialExpanded={recipeFromUrl}
    />
  );
}
```

### Updated RecipeList Component

```typescript
// src/components/RecipeList/RecipeList.tsx

interface Props {
  category: Category;
  initialExpanded?: string | null;  // NEW prop
}

export default function RecipeList({ category, initialExpanded }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(initialExpanded || null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Update expanded when initialExpanded changes (from URL)
  useEffect(() => {
    if (initialExpanded) {
      setExpanded(initialExpanded);
    }
  }, [initialExpanded]);

  // Scroll to expanded recipe
  useEffect(() => {
    if (expanded && expandedRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [expanded]);

  // ... rest of component
  
  return (
    <div className={styles.recipeList}>
      {recipes.map((recipe) => (
        <div 
          key={recipe.title}
          ref={expanded === recipe.title ? expandedRef : null}
        >
          {/* ... existing button and RecipeCard ... */}
        </div>
      ))}
    </div>
  );
}
```

### URL Encoding Notes

Recipe titles are in Russian and may contain special characters:
- Use `encodeURIComponent()` when building URL
- React Router's `useSearchParams` auto-decodes

```typescript
// Encoding
const encodedTitle = encodeURIComponent("Морковный салат с чесноком");
// Result: "%D0%9C%D0%BE%D1%80%D0%BA%D0%BE%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%B0%D0%BB%D0%B0%D1%82..."

// Decoding (automatic)
const title = searchParams.get('recipe'); 
// Result: "Морковный салат с чесноком"
```

### Files to Modify

```
src/
├── App.tsx                               [MODIFY - add URL params]
├── components/
│   └── RecipeList/
│       └── RecipeList.tsx                [MODIFY - add initialExpanded]
```

### Clear URL Param After Navigation (Optional Enhancement)

If you want to clear the `?recipe=` param after showing the recipe:

```typescript
// In CategoryPage, after recipe is expanded:
useEffect(() => {
  if (recipeFromUrl) {
    // Clear the param after a short delay
    const timer = setTimeout(() => {
      navigate(`/category/${selectedCategory}`, { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }
}, [recipeFromUrl]);
```

However, this may interfere with back button. Consider leaving the param in URL.

### Edge Cases to Handle

1. **Recipe not found in category**: If URL has `?recipe=NonExistent`, don't crash
2. **Category mismatch**: If navigating to `/category/fish?recipe=Морковный+салат` (salad in fish category), recipe won't be found - this is OK
3. **Same category navigation**: If already on salads and clicking salad result, still update expanded state

### Testing Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Click "Морковный салат" in search | Navigate to `/category/salads?recipe=...`, recipe expands |
| Click back button | Return to previous page |
| Direct URL with `?recipe=...` | Page loads with recipe expanded |
| Recipe not in current category | No recipe expanded, normal page |

### References

- [Source: src/App.tsx] - CategoryPage component
- [Source: src/components/RecipeList/RecipeList.tsx] - Current RecipeList
- [Source: _bmad-output/story-2-3-integrate-header.md] - Search integration
- [React Router useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

### Completion Notes List

### File List
