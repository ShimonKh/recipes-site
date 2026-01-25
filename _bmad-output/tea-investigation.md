# TEA Investigation: Search Feature Not Working

**Date:** 2026-01-25  
**Issue:** Search immediately shows "Не удалось загрузить рецепты" error  
**Site URL:** http://localhost:5174

---

## Problem Description

При открытии сайта поиск сразу показывает ошибку:
```
⚠️ Не удалось загрузить рецепты.
Попробуйте обновить страницу.
```

---

## Suspected Issue

**File:** `src/context/RecipesContext.tsx`, line 28

**Current code:**
```typescript
const response = await fetch(`${import.meta.env.BASE_URL}recipes/${key}.json`);
```

**Problem:** Отсутствует слэш между `BASE_URL` и `recipes`.

**Expected:**
```typescript
const response = await fetch(`${import.meta.env.BASE_URL}/recipes/${key}.json`);
```

**Why this matters:**
- `import.meta.env.BASE_URL` = `/recipes-site/` (from vite.config.ts)
- Current: `/recipes-site/recipes/...` → `/recipes-siterecipes/...` ❌
- Should be: `/recipes-site/recipes/...` ✅

---

## Investigation Tasks for TEA Agent

1. **Verify the bug:**
   - Open http://localhost:5174
   - Check browser console for fetch errors
   - Verify network tab shows 404 for recipe files

2. **Check BASE_URL value:**
   - Inspect `import.meta.env.BASE_URL` in dev tools
   - Should be `/recipes-site/`

3. **Test the fix:**
   - Add missing `/` in RecipesContext.tsx line 28
   - Verify recipes load correctly
   - Verify search works

4. **Regression check:**
   - Verify other fetch calls use correct path:
     - `App.tsx` line 51: `import.meta.env.BASE_URL + '/recipes/...'` ✅ (correct)
     - `RecipeList.tsx` line 36: `import.meta.env.BASE_URL + '/recipes/...'` ✅ (correct)
     - `RecipesContext.tsx` line 28: `${import.meta.env.BASE_URL}recipes/...` ❌ (missing `/`)

---

## Files to Check

- `src/context/RecipesContext.tsx` - **PRIMARY SUSPECT**
- `vite.config.ts` - Verify base path
- Browser console - Check actual fetch URLs
- Network tab - Check failed requests

---

## Expected Fix

```typescript
// Line 28 in RecipesContext.tsx
// BEFORE:
const response = await fetch(`${import.meta.env.BASE_URL}recipes/${key}.json`);

// AFTER:
const response = await fetch(`${import.meta.env.BASE_URL}/recipes/${key}.json`);
```

---

*TEA Agent: Please investigate and confirm the issue, then provide fix recommendation.*
