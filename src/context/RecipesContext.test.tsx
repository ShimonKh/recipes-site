import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { RecipesProvider, useRecipes } from './RecipesContext';
import type { ReactNode } from 'react';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock categories
vi.mock('../data/categories', () => ({
  categories: [
    { key: 'salads', name: 'Салаты' },
    { key: 'soups', name: 'Супы' },
  ],
}));

const mockSaladsData = [
  { title: 'Салат 1', category: 'salads', ingredients: ['a'], steps: ['b'] },
  { title: 'Салат 2', category: 'salads', ingredients: ['c'], steps: ['d'] },
];

const mockSoupsData = [
  { title: 'Суп 1', category: 'soups', ingredients: ['e'], steps: ['f'] },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <RecipesProvider>{children}</RecipesProvider>
);

describe('RecipesContext', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial loading state (AC: #4)', () => {
    it('isLoading is true initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useRecipes(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it('allRecipes is empty initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useRecipes(), { wrapper });
      expect(result.current.allRecipes).toEqual([]);
    });
  });

  describe('Successful data loading (AC: #2, #3)', () => {
    beforeEach(() => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('salads')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSaladsData),
          });
        }
        if (url.includes('soups')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSoupsData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });
    });

    it('loads all recipes from all categories', async () => {
      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.allRecipes).toHaveLength(3);
    });

    it('maps recipes with their category (AC: #3)', async () => {
      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const saladRecipes = result.current.allRecipes.filter(
        (r) => r.category === 'salads'
      );
      expect(saladRecipes).toHaveLength(2);
      expect(saladRecipes[0]).toHaveProperty('recipe');
      expect(saladRecipes[0]).toHaveProperty('category');
    });

    it('fetches all categories in parallel (AC: #2)', async () => {
      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Both categories should have been fetched
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('sets isLoading to false after load', async () => {
      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Error handling (AC: #5)', () => {
    it('sets error state on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('sets error on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useRecipes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useRecipes hook', () => {
    it('provides context values', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const { result } = renderHook(() => useRecipes(), { wrapper });

      expect(result.current).toHaveProperty('allRecipes');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
    });
  });
});
