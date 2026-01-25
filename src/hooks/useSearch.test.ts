import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import * as RecipesContext from '../context/RecipesContext';
import type { RecipeWithCategory } from '../context/RecipesContext';

// Mock useRecipes hook
vi.mock('../context/RecipesContext', async () => {
  const actual = await vi.importActual('../context/RecipesContext');
  return {
    ...actual,
    useRecipes: vi.fn(),
  };
});

const mockRecipes: RecipeWithCategory[] = [
  {
    recipe: {
      title: 'Морковный салат',
      category: 'salads',
      ingredients: ['морковь', 'масло'],
      steps: ['нарежьте морковь'],
    },
    category: 'salads',
  },
  {
    recipe: {
      title: 'Борщ',
      category: 'soups',
      ingredients: ['свекла', 'капуста'],
      steps: ['варите'],
    },
    category: 'soups',
  },
];

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(RecipesContext.useRecipes).mockReturnValue({
      allRecipes: mockRecipes,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('returns empty query initially', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.query).toBe('');
    });

    it('returns empty results initially', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.results).toEqual([]);
    });
  });

  describe('Query state (AC: #2)', () => {
    it('updates query when setQuery is called', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('морков');
      });

      expect(result.current.query).toBe('морков');
    });

    it('clears query when clearSearch is called', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('морков');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
    });
  });

  describe('Debounce (AC: #3)', () => {
    it('does not search immediately after setQuery', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('морков');
      });

      // Before debounce timeout
      expect(result.current.results).toEqual([]);
    });

    it('searches after 300ms debounce', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('морков');
      });

      // Before debounce - no results
      expect(result.current.results).toEqual([]);

      // Advance time by 300ms
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // After debounce - results should appear
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    it('cancels previous search on rapid typing', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('м');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setQuery('мо');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setQuery('мор');
      });

      // Only 200ms passed since last change, should not search yet
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Results still empty (debounce not complete)
      expect(result.current.results).toEqual([]);

      // Complete debounce
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Now search should have happened with "мор"
      expect(result.current.query).toBe('мор');
    });
  });

  describe('Integration with RecipesContext (AC: #4)', () => {
    it('consumes allRecipes from context', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('борщ');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].recipe.title).toBe('Борщ');
    });

    it('returns empty results when no matches', async () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('пицца');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('Return value (AC: #2)', () => {
    it('returns object with query, setQuery, results, clearSearch, isLoading, error, isDebouncing', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current).toHaveProperty('query');
      expect(result.current).toHaveProperty('setQuery');
      expect(result.current).toHaveProperty('results');
      expect(result.current).toHaveProperty('clearSearch');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('isDebouncing');
      expect(typeof result.current.setQuery).toBe('function');
      expect(typeof result.current.clearSearch).toBe('function');
    });

    it('returns isLoading from context', () => {
      vi.mocked(RecipesContext.useRecipes).mockReturnValue({
        allRecipes: mockRecipes,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useSearch());
      expect(result.current.isLoading).toBe(true);
    });

    it('returns error from context', () => {
      const errorMessage = 'Failed to load recipes';
      vi.mocked(RecipesContext.useRecipes).mockReturnValue({
        allRecipes: [],
        isLoading: false,
        error: errorMessage,
      });

      const { result } = renderHook(() => useSearch());
      expect(result.current.error).toBe(errorMessage);
    });

    it('returns isDebouncing as false initially', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.isDebouncing).toBe(false);
    });

    it('returns isDebouncing as true during debounce', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setQuery('морков');
      });

      // Before debounce timeout - should be debouncing
      expect(result.current.isDebouncing).toBe(true);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // After debounce timeout - should not be debouncing
      expect(result.current.isDebouncing).toBe(false);
    });
  });
});
