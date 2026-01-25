# Epics & User Stories: Recipe Search Feature

**Related PRD:** prd-search-feature.md  
**Created:** 2026-01-25  
**Status:** Ready for Sprint Planning

---

## Epic Overview

| Epic ID | Title | Stories | Priority | Estimated Effort |
|---------|-------|---------|----------|------------------|
| EPIC-1 | Data Layer & Search Logic | 3 | P0 | Medium |
| EPIC-2 | Desktop Search UI | 4 | P0 | Medium |
| EPIC-3 | Mobile Search UI | 3 | P0 | Medium |
| EPIC-4 | Homepage Hero Search | 2 | P1 | Small |
| EPIC-5 | Polish & Accessibility | 3 | P1 | Small |

**Recommended Implementation Order:** EPIC-1 → EPIC-2 → EPIC-3 → EPIC-4 → EPIC-5

---

## EPIC-1: Data Layer & Search Logic

**Goal:** Load all recipes into memory and implement search algorithm

### Story 1.1: Load All Recipes on App Init

**As a** developer  
**I need** all recipes loaded into app state on initialization  
**So that** search can operate instantly without network calls

**Acceptance Criteria:**
- [ ] Create `RecipesContext` to store all recipes
- [ ] Load all 9 category JSON files on app mount
- [ ] Store recipes with their category info: `{ recipe: Recipe, category: Category }`
- [ ] Handle loading state (show spinner or skeleton)
- [ ] Handle error state (show error message if load fails)
- [ ] Total load time < 2 seconds on 3G connection

**Technical Notes:**
```typescript
// New file: src/context/RecipesContext.tsx
interface RecipeWithCategory {
  recipe: Recipe;
  category: Category;
}

interface RecipesContextValue {
  allRecipes: RecipeWithCategory[];
  isLoading: boolean;
  error: string | null;
}
```

---

### Story 1.2: Implement Search Algorithm

**As a** user  
**I want** to search recipes by typing text  
**So that** I can find recipes containing my search term

**Acceptance Criteria:**
- [ ] Search matches recipe titles (case-insensitive)
- [ ] Search matches ingredients (case-insensitive)
- [ ] Search matches cooking steps (case-insensitive)
- [ ] Search matches tips and metadata.notes (if present)
- [ ] Minimum 2 characters required to search
- [ ] Results sorted by relevance: title > ingredient > step > other
- [ ] Each result includes `matchType` and `matchText`
- [ ] Empty query returns empty results

**Technical Notes:**
```typescript
// New file: src/utils/searchRecipes.ts
function searchRecipes(query: string, allRecipes: RecipeWithCategory[]): SearchResult[]
```

---

### Story 1.3: Create Search State Hook

**As a** developer  
**I need** a reusable hook for search functionality  
**So that** both header and hero search share the same logic

**Acceptance Criteria:**
- [ ] Create `useSearch` custom hook
- [ ] Hook returns: `{ query, setQuery, results, clearSearch }`
- [ ] Implement 300ms debounce on query changes
- [ ] Hook consumes RecipesContext internally

**Technical Notes:**
```typescript
// New file: src/hooks/useSearch.ts
function useSearch(): {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  clearSearch: () => void;
}
```

---

## EPIC-2: Desktop Search UI

**Goal:** Implement search bar in header with dropdown results (desktop/tablet)

### Story 2.1: Create SearchBar Component

**As a** user  
**I want** a search input in the header  
**So that** I can search from any page

**Acceptance Criteria:**
- [ ] Search input with 🔍 icon on left
- [ ] Placeholder: "Найти рецепт или ингредиент..."
- [ ] Clear button (✕) appears when input has text
- [ ] Input has visible focus state
- [ ] Responsive width (see breakpoints in PRD)

**Technical Notes:**
```
src/components/SearchBar/
├── SearchBar.tsx
└── SearchBar.module.css
```

---

### Story 2.2: Create SearchResults Dropdown

**As a** user  
**I want** to see search results as I type  
**So that** I can quickly find and select a recipe

**Acceptance Criteria:**
- [ ] Dropdown appears below search input when results exist
- [ ] Each result shows: category emoji, title, match context
- [ ] Match context shows where term was found (e.g., "Найдено в ингредиентах: лимон")
- [ ] Dropdown has max-height with scroll for many results
- [ ] Dropdown closes on: click outside, Escape key, clear search

**Technical Notes:**
```
src/components/SearchResults/
├── SearchResults.tsx
├── SearchResultItem.tsx
└── SearchResults.module.css
```

---

### Story 2.3: Integrate Search into Header

**As a** user  
**I want** search available in the header on all pages  
**So that** I can search without going back to homepage

**Acceptance Criteria:**
- [ ] SearchBar renders in header on CategoryPage
- [ ] SearchBar positioned on right side of header
- [ ] Header layout adjusts for search (flexbox)
- [ ] Results dropdown positioned correctly relative to input

**Technical Notes:**
- Modify: `src/App.tsx` (header in CategoryPage component)
- Consider extracting header to separate component

---

### Story 2.4: Navigate to Recipe from Search

**As a** user  
**I want** to click a search result and see the recipe  
**So that** I can access the recipe I found

**Acceptance Criteria:**
- [ ] Clicking result navigates to `/category/{category}`
- [ ] Correct category page opens
- [ ] Target recipe is auto-expanded (or scrolled into view)
- [ ] Search is cleared after navigation
- [ ] Browser back button works correctly

**Technical Notes:**
- May need to pass `expandedRecipe` param via URL or state
- Consider: `/category/salads?recipe=Морковный+салат`

---

## EPIC-3: Mobile Search UI

**Goal:** Implement mobile-optimized search experience

### Story 3.1: Create Mobile Search Icon Button

**As a** mobile user  
**I want** a search icon in the header  
**So that** I can access search without it taking header space

**Acceptance Criteria:**
- [ ] Show only 🔍 icon on mobile (< 768px)
- [ ] Icon is tappable (44x44px minimum)
- [ ] Tapping icon opens search overlay
- [ ] Hide full search bar on mobile

**Technical Notes:**
- Use CSS media queries or `useMediaQuery` hook
- Breakpoint: 768px

---

### Story 3.2: Create MobileSearchOverlay Component

**As a** mobile user  
**I want** a full-screen search overlay  
**So that** I can search comfortably on small screens

**Acceptance Criteria:**
- [ ] Overlay slides down from top (or fades in)
- [ ] Semi-transparent backdrop behind overlay
- [ ] Search input auto-focuses when overlay opens
- [ ] Keyboard opens automatically
- [ ] Close button (✕) in top-right
- [ ] Tapping backdrop closes overlay
- [ ] Results scroll within overlay
- [ ] Body scroll disabled when overlay open

**Technical Notes:**
```
src/components/MobileSearchOverlay/
├── MobileSearchOverlay.tsx
└── MobileSearchOverlay.module.css
```

**Visual Mockup:**
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

---

### Story 3.3: Mobile Result Navigation

**As a** mobile user  
**I want** to tap a result and see the recipe  
**So that** I can access recipes found via search

**Acceptance Criteria:**
- [ ] Tapping result closes overlay
- [ ] Navigates to correct category page
- [ ] Target recipe opens/expands
- [ ] Smooth transition (no jarring jumps)

---

## EPIC-4: Homepage Hero Search

**Goal:** Add prominent search to homepage hero section

### Story 4.1: Create Hero SearchBar

**As a** user on the homepage  
**I want** a prominent search bar  
**So that** search is the primary way to find recipes

**Acceptance Criteria:**
- [ ] Large search bar centered in hero section
- [ ] Larger text size than header search
- [ ] Same functionality as header search
- [ ] Results dropdown or inline results below
- [ ] Works on all screen sizes

**Visual Mockup:**
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

---

### Story 4.2: Hero Search Results Display

**As a** user  
**I want** to see search results on the homepage  
**So that** I can find recipes without leaving the page

**Acceptance Criteria:**
- [ ] Results appear below hero search bar
- [ ] Results replace or overlay category grid temporarily
- [ ] Clear visual distinction between search mode and browse mode
- [ ] Easy to dismiss search and return to categories

---

## EPIC-5: Polish & Accessibility

**Goal:** Ensure quality, accessibility, and edge case handling

### Story 5.1: Keyboard Navigation

**As a** keyboard user  
**I want** to navigate search results with arrow keys  
**So that** I can use search without a mouse

**Acceptance Criteria:**
- [ ] ↓ Arrow moves focus to first/next result
- [ ] ↑ Arrow moves focus to previous result
- [ ] Enter opens focused result
- [ ] Escape closes results/overlay
- [ ] Tab navigates naturally through UI

---

### Story 5.2: Empty & Error States

**As a** user  
**I want** helpful feedback when search has no results  
**So that** I know what to do next

**Acceptance Criteria:**
- [ ] "Введите минимум 2 символа" when query < 2 chars
- [ ] "Ничего не найдено по запросу «{query}»" when no results
- [ ] Suggest: "Попробуйте другие ключевые слова"
- [ ] Error state if data fails to load

**Visual Mockup:**
```
┌─────────────────────────────────┐
│ 🔍 [xyz_____________]          │
├─────────────────────────────────┤
│                                 │
│    😕 Ничего не найдено        │
│    по запросу «xyz»             │
│                                 │
│    Попробуйте другие            │
│    ключевые слова               │
│                                 │
└─────────────────────────────────┘
```

---

### Story 5.3: Accessibility Audit

**As a** user with disabilities  
**I want** search to be fully accessible  
**So that** I can use it with assistive technology

**Acceptance Criteria:**
- [ ] `aria-label="Поиск рецептов"` on search input
- [ ] `role="listbox"` on results container
- [ ] `role="option"` on each result
- [ ] `aria-expanded` reflects dropdown state
- [ ] `aria-activedescendant` for keyboard navigation
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus visible on all interactive elements

---

## File Structure Summary

After implementation, new/modified files:

```
src/
├── context/
│   └── RecipesContext.tsx          [NEW]
├── hooks/
│   └── useSearch.ts                [NEW]
├── utils/
│   └── searchRecipes.ts            [NEW]
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.tsx           [NEW]
│   │   └── SearchBar.module.css    [NEW]
│   ├── SearchResults/
│   │   ├── SearchResults.tsx       [NEW]
│   │   ├── SearchResultItem.tsx    [NEW]
│   │   └── SearchResults.module.css [NEW]
│   ├── MobileSearchOverlay/
│   │   ├── MobileSearchOverlay.tsx  [NEW]
│   │   └── MobileSearchOverlay.module.css [NEW]
│   └── HomePage/
│       ├── HomePage.tsx            [MODIFY]
│       └── HomePage.module.css     [MODIFY]
├── App.tsx                         [MODIFY]
└── App.css                         [MODIFY]
```

---

## Sprint Recommendation

**Sprint 1 (MVP):**
- EPIC-1: All stories (foundation)
- EPIC-2: Stories 2.1, 2.2, 2.3 (desktop works)

**Sprint 2 (Mobile + Polish):**
- EPIC-2: Story 2.4 (navigation)
- EPIC-3: All stories (mobile)
- EPIC-4: All stories (homepage hero)

**Sprint 3 (Quality):**
- EPIC-5: All stories (accessibility)
- Bug fixes and refinements

---

*End of Epics Document*
