# Code Review: Search Feature (EPIC-1 to EPIC-5)

**Reviewer:** SM Agent  
**Date:** 2026-01-25  
**Status:** Review Complete - Issues Found

---

## Summary

Общее качество кода **хорошее**. Основные фичи работают. Найдено несколько проблем, требующих исправления.

| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 Major | 3 |
| 🟡 Minor | 5 |
| 💡 Suggestions | 4 |

---

## 🔴 Critical Issues

### 1. HeroSearchBar: Dropdown не показывает hint при 1 символе

**File:** `src/components/HeroSearchBar/HeroSearchBar.tsx`, line 39-40

**Problem:** 
```typescript
useEffect(() => {
  setIsOpen(query.length >= 2);  // ❌ Должно быть >= 1 для показа hint
}, [query, results]);
```

Dropdown открывается только при `query.length >= 2`, но "Введите минимум 2 символа" должен показываться при `query.length === 1`.

**Fix:**
```typescript
useEffect(() => {
  setIsOpen(query.length >= 1 || results.length > 0 || error !== null);
}, [query, results, error]);
```

---

## 🟠 Major Issues

### 2. Code Duplication: Empty/Error states повторяются в 3 компонентах

**Files:**
- `HeroSearchBar.tsx` (lines 101-124)
- `MobileSearchOverlay.tsx` (lines 110-133)
- `SearchResults.tsx` (lines 59-82)

**Problem:** Одинаковая логика состояний (error, minChars, noResults) дублируется в трёх местах.

**Recommendation:** Извлечь в отдельный компонент `SearchStates.tsx`:
```typescript
interface SearchStatesProps {
  query: string;
  results: SearchResult[];
  error: string | null;
}

export function SearchStates({ query, results, error }: SearchStatesProps) {
  // ... unified logic
}
```

---

### 3. Accessibility: Не хватает aria-hidden на search icon в MobileSearchOverlay

**File:** `src/components/MobileSearchOverlay/MobileSearchOverlay.tsx`, line 74

**Problem:**
```tsx
<span className={styles.searchIcon}>🔍</span>  // ❌ Missing aria-hidden
```

В других компонентах (SearchBar, HeroSearchBar) есть `aria-hidden="true"`, здесь нет.

**Fix:**
```tsx
<span className={styles.searchIcon} aria-hidden="true">🔍</span>
```

---

### 4. Color Contrast: hintState text (#9ca3af) на белом фоне

**Files:** 
- `SearchResults.module.css`, line 65
- `HeroSearchBar.module.css`, line 111
- `MobileSearchOverlay.module.css`, line 133

**Problem:** Цвет `#9ca3af` на белом фоне имеет контраст ~2.7:1. WCAG AA требует 4.5:1.

**Fix:** Изменить на `#6b7280` (контраст ~4.5:1):
```css
.hintState {
  color: #6b7280;  /* Was: #9ca3af */
}
```

---

## 🟡 Minor Issues

### 5. SearchBar: isOpen логика избыточно сложная

**File:** `src/components/SearchBar/SearchBar.tsx`, line 38-40

**Problem:**
```typescript
useEffect(() => {
  setIsOpen(results.length > 0 || query.length >= 1 || (error !== null && query.length > 0));
}, [results, query, error]);
```

Условие `(error !== null && query.length > 0)` избыточно - если `query.length > 0`, то `query.length >= 1` уже true.

**Fix:**
```typescript
useEffect(() => {
  setIsOpen(query.length >= 1 || error !== null);
}, [query, error]);
```

---

### 6. RecipeList: Двойной useEffect при изменении категории

**File:** `src/components/RecipeList/RecipeList.tsx`, lines 16-21 и 36-45

**Problem:** При смене категории:
1. Первый useEffect устанавливает `expanded` из `initialExpanded`
2. Второй useEffect загружает рецепты

Но при смене категории `initialExpanded` может остаться от предыдущей категории.

**Recommendation:** Сбрасывать expanded при смене категории:
```typescript
useEffect(() => {
  // Reset expanded when category changes
  setExpanded(initialExpanded || null);
}, [category, initialExpanded]);
```

---

### 7. Missing Error Handling: RecipeList fetch

**File:** `src/components/RecipeList/RecipeList.tsx`, lines 36-45

**Problem:** Нет обработки ошибок при загрузке рецептов:
```typescript
fetch(import.meta.env.BASE_URL + `/recipes/${category}.json`)
  .then((res) => res.json())  // ❌ No error check
  .then((data) => { ... });
```

**Fix:**
```typescript
fetch(import.meta.env.BASE_URL + `/recipes/${category}.json`)
  .then((res) => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  })
  .then((data) => { ... })
  .catch((error) => {
    console.error('Error loading recipes:', error);
  });
```

---

### 8. useKeyboardNavigation: Нет стопа на последнем элементе вниз

**File:** `src/hooks/useKeyboardNavigation.ts`, lines 28-31

**Problem:** 
```typescript
case 'ArrowDown':
  setFocusedIndex((prev) => 
    prev < results.length - 1 ? prev + 1 : prev  // Stops at last
  );
```

Это корректно, но поведение ArrowUp/ArrowDown несимметрично. ArrowUp при -1 остаётся -1, но можно было бы циклить.

**Recommendation (optional):** Добавить опцию `loop: boolean` для цикличной навигации.

---

### 9. CSS: z-index inconsistency

**Files:**
- `SearchBar.module.css`: `.searchContainer` z-index: 100
- `SearchResults.module.css`: `.dropdown` z-index: 50
- `MobileSearchOverlay.module.css`: `.overlay` z-index: 1000

**Problem:** z-index значения разбросаны. Dropdown (50) меньше чем container (100) - это работает, но нелогично.

**Recommendation:** Создать CSS variables для z-index:
```css
:root {
  --z-dropdown: 100;
  --z-overlay: 1000;
}
```

---

## 💡 Suggestions

### 10. Performance: Debounce можно сделать настраиваемым

**File:** `src/hooks/useSearch.ts`, line 31

```typescript
const timer = setTimeout(() => {
  setDebouncedQuery(query);
}, 300);  // Hardcoded
```

**Suggestion:** Добавить параметр `debounceMs`:
```typescript
export function useSearch(debounceMs = 300): UseSearchReturn { ... }
```

---

### 11. Test Coverage: Нет тестов для useKeyboardNavigation

**File:** `src/hooks/useKeyboardNavigation.ts`

Hook не имеет тестов, хотя это критичная функциональность.

**Suggestion:** Добавить `useKeyboardNavigation.test.ts`

---

### 12. DX: Типы SearchResult экспортируются из utils, но используются везде

**Suggestion:** Создать `src/types/search.ts` для централизации типов:
```typescript
export type { SearchResult, MatchType } from '../utils/searchRecipes';
```

---

### 13. UX: Рекомендуемые рецепты на HomePage не кликабельны

**File:** `src/components/HomePage/HomePage.tsx`, lines 38-42

```tsx
<div className={styles.suggestedCard}>🥗 Морковный салат...</div>
```

**Suggestion:** Сделать их кликабельными ссылками на рецепты.

---

## Files Reviewed

| File | Status |
|------|--------|
| `src/hooks/useSearch.ts` | ✅ OK |
| `src/hooks/useKeyboardNavigation.ts` | ⚠️ Minor |
| `src/utils/searchRecipes.ts` | ✅ OK |
| `src/context/RecipesContext.tsx` | ✅ OK |
| `src/components/SearchBar/SearchBar.tsx` | ⚠️ Minor |
| `src/components/SearchResults/SearchResults.tsx` | ⚠️ Major |
| `src/components/SearchResults/SearchResultItem.tsx` | ✅ OK |
| `src/components/HeroSearchBar/HeroSearchBar.tsx` | 🔴 Critical |
| `src/components/MobileSearchOverlay/MobileSearchOverlay.tsx` | ⚠️ Major |
| `src/components/MobileSearchButton/MobileSearchButton.tsx` | ✅ OK |
| `src/components/HomePage/HomePage.tsx` | ✅ OK |
| `src/components/RecipeList/RecipeList.tsx` | ⚠️ Minor |
| `src/App.tsx` | ✅ OK |

---

## Action Items (Priority Order)

1. **[Critical]** Fix HeroSearchBar dropdown открытие при 1 символе
2. **[Major]** Add `aria-hidden="true"` to MobileSearchOverlay search icon
3. **[Major]** Fix color contrast для hintState (#9ca3af → #6b7280)
4. **[Minor]** Simplify SearchBar isOpen logic
5. **[Minor]** Add error handling to RecipeList fetch
6. **[Minor]** Reset expanded state on category change in RecipeList

---

*Review completed. Pass this file to dev agent for fixes.*
