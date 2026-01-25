# PRD: Recipe Search Feature

**Document Version:** 1.0  
**Created:** 2026-01-25  
**Author:** John (PM) + Sally (UX)  
**Status:** Ready for Implementation

---

## 1. Executive Summary

### Problem Statement
Users of the Recipes Site cannot find recipes without manually browsing through categories. This creates friction, especially when:
- User knows the recipe name but not the category
- User wants to find recipes containing specific ingredients
- User remembers part of a recipe title

### Solution
Implement a unified search experience that is:
- Always accessible (in header on all pages)
- Prominently featured on homepage (hero section)
- Fully responsive across mobile, tablet, and desktop
- Fast and intuitive with instant results

### Success Metrics
- Users can find any recipe in under 5 seconds
- Search is usable on all device sizes
- Zero learning curve (familiar UI patterns)

---

## 2. User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-1 | User | Search recipes by name | I can quickly find a specific recipe | P0 |
| US-2 | User | Search recipes by ingredient | I can find what to cook with available ingredients | P0 |
| US-3 | User | See search results instantly | I don't have to wait or press Enter | P1 |
| US-4 | Mobile user | Access search easily on small screens | I can search on my phone while cooking | P0 |
| US-5 | User | See where my search term was found | I understand why a recipe matched | P1 |
| US-6 | User | Clear my search easily | I can start a new search quickly | P1 |

---

## 3. Functional Requirements

### 3.1 Search Scope

The search MUST search across:
- Recipe title (primary)
- Ingredients list
- Cooking steps
- Tips (if present)
- Metadata notes (if present)

The search MUST NOT:
- Require category selection (search across all categories)
- Require pressing Enter (instant search)
- Be case-sensitive

### 3.2 Search Behavior

| Requirement | Specification |
|-------------|---------------|
| Minimum characters | 2 characters to trigger search |
| Debounce delay | 300ms after last keystroke |
| Results limit | Show all matches (no pagination needed for current data size) |
| Sort order | By relevance: title match > ingredient match > other matches |
| Empty query | Show nothing / return to normal view |
| No results | Show friendly message with suggestions |

### 3.3 Search UI Placement

#### 3.3.1 Homepage (Hero Section)
- Large, prominent search bar
- Centered in hero area
- Placeholder text: "Найти рецепт или ингредиент..."
- Icon: 🔍 magnifying glass on left

#### 3.3.2 Header (All Pages)
- Compact search bar in header
- Always visible and accessible
- Same functionality as hero search
- Collapses to icon on mobile (expandable)

---

## 4. Responsive Design Specifications

### 4.1 Breakpoints

| Device | Width | Behavior |
|--------|-------|----------|
| Mobile | < 768px | Compact header search (icon → expand) |
| Tablet | 768px - 1024px | Medium search bar in header |
| Desktop | > 1024px | Full search bar in header |

### 4.2 Mobile Design (< 768px)

```
┌─────────────────────────────────┐
│ 📚 Книга рецептов         🔍   │  ← Icon only, tap to expand
├─────────────────────────────────┤
│                                 │
│    [EXPANDED SEARCH OVERLAY]    │  ← Full-screen or slide-down
│    🔍 [___________________] ✕   │
│                                 │
│    Results appear below...      │
│                                 │
└─────────────────────────────────┘
```

**Mobile Search Flow:**
1. User taps 🔍 icon in header
2. Search overlay appears (slide down or modal)
3. Keyboard opens automatically
4. User types query
5. Results appear below input
6. User taps recipe → overlay closes, recipe opens
7. User taps ✕ or outside → overlay closes

### 4.3 Tablet Design (768px - 1024px)

```
┌────────────────────────────────────────────┐
│ 📚 Книга рецептов   🔍 [Поиск...    ]     │
├────────────────────────────────────────────┤
│ [Салаты] [Рыбное] [Мясное] [Гарниры] ...  │
└────────────────────────────────────────────┘
```

**Tablet Behavior:**
- Search bar visible in header (shortened width)
- Results appear as dropdown below search
- Touch-friendly result items (min 44px height)

### 4.4 Desktop Design (> 1024px)

```
┌──────────────────────────────────────────────────────────┐
│ 📚 Книга рецептов          🔍 [Найти рецепт или ингред...│
├──────────────────────────────────────────────────────────┤
│ [Салаты] [Рыбное] [Мясное] [Гарниры] [Завтраки] ...     │
└──────────────────────────────────────────────────────────┘
```

**Desktop Behavior:**
- Full search bar always visible
- Results dropdown (max-height with scroll if many results)
- Keyboard navigation support (↑↓ arrows, Enter)

---

## 5. UI Components Specification

### 5.1 SearchBar Component

**Props:**
```typescript
interface SearchBarProps {
  variant: 'hero' | 'header' | 'mobile';
  placeholder?: string;
  autoFocus?: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}
```

**States:**
- Empty (default)
- Focused (typing)
- Has value (showing results)
- Loading (optional, for future backend search)

### 5.2 SearchResults Component

**Props:**
```typescript
interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelect: (recipe: Recipe) => void;
  isLoading?: boolean;
}

interface SearchResult {
  recipe: Recipe;
  category: Category;
  matchType: 'title' | 'ingredient' | 'step' | 'other';
  matchText: string;  // The text that matched
}
```

**Result Item Display:**
```
┌─────────────────────────────────────────────┐
│ 🥗 Морковный салат с чесноком              │
│ Салаты • Найдено в названии                │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 🐟 Форель запечённая                       │
│ Рыбное • Найдено в ингредиентах: "лимон"   │
└─────────────────────────────────────────────┘
```

### 5.3 MobileSearchOverlay Component

**Behavior:**
- Full viewport overlay (semi-transparent background)
- Search input auto-focused
- Results scroll within overlay
- Close on: X button, tap outside, select result, Escape key

---

## 6. Technical Architecture

### 6.1 Data Loading Strategy

**Option A: Load All on Init (Recommended for current data size)**
- Load all recipes from all categories on app init
- Store in React Context or state
- Instant search with no network delay
- ~50-100KB total data (acceptable)

**Option B: Search as API (Future consideration)**
- Only if data grows significantly (500+ recipes)
- Would require backend or search service

### 6.2 Search Algorithm

```typescript
function searchRecipes(query: string, allRecipes: RecipeWithCategory[]): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  
  const results: SearchResult[] = [];
  
  for (const { recipe, category } of allRecipes) {
    // Priority 1: Title match
    if (recipe.title.toLowerCase().includes(q)) {
      results.push({ recipe, category, matchType: 'title', matchText: recipe.title });
      continue;
    }
    
    // Priority 2: Ingredient match
    const ingredientMatch = recipe.ingredients.find(i => i.toLowerCase().includes(q));
    if (ingredientMatch) {
      results.push({ recipe, category, matchType: 'ingredient', matchText: ingredientMatch });
      continue;
    }
    
    // Priority 3: Step match
    const stepMatch = recipe.steps.find(s => s.toLowerCase().includes(q));
    if (stepMatch) {
      results.push({ recipe, category, matchType: 'step', matchText: stepMatch });
      continue;
    }
    
    // Priority 4: Other (tips, notes)
    // ... similar logic
  }
  
  return results;
}
```

### 6.3 State Management

```typescript
interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;  // For mobile overlay
  allRecipes: RecipeWithCategory[];  // Loaded once
}
```

---

## 7. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Arrow keys to navigate results, Enter to select |
| Screen reader | aria-label on search input, role="listbox" for results |
| Focus management | Focus trapped in mobile overlay, return focus on close |
| Contrast | Minimum 4.5:1 for text, 3:1 for UI components |
| Touch targets | Minimum 44x44px for mobile touch targets |

---

## 8. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Query too short (< 2 chars) | Show hint: "Введите минимум 2 символа" |
| No results found | Show: "Ничего не найдено по запросу «{query}»" |
| Special characters in query | Escape regex characters, search literally |
| Very long query | Truncate display, search full text |
| Search while navigating | Keep search open, update URL if needed |

---

## 9. Out of Scope (v1)

The following are explicitly NOT included in this version:
- ❌ Category filter in search
- ❌ Advanced filters (by servings, cooking time, etc.)
- ❌ Search history / recent searches
- ❌ Search suggestions / autocomplete
- ❌ Voice search
- ❌ Fuzzy matching / typo tolerance

---

## 10. Definition of Done

- [ ] Search bar visible in header on all pages
- [ ] Search bar prominent in homepage hero section
- [ ] Search works on mobile (< 768px)
- [ ] Search works on tablet (768px - 1024px)
- [ ] Search works on desktop (> 1024px)
- [ ] Search finds recipes by title
- [ ] Search finds recipes by ingredients
- [ ] Search results show where match was found
- [ ] Search results navigate to correct recipe
- [ ] No results state displays correctly
- [ ] All accessibility requirements met
- [ ] Works offline after initial load (static data)

---

*End of PRD*
