import { useState, useEffect, useMemo } from 'react';
import { useRecipes } from '../context/RecipesContext';
import { searchRecipes } from '../utils/searchRecipes';
import type { SearchResult } from '../utils/searchRecipes';

// Task 1: Hook return type (AC: #2)
interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  clearSearch: () => void;
  isLoading: boolean;
  error: string | null;
  isDebouncing: boolean;
}

/**
 * Custom hook for search functionality with debounce
 * AC: #1 - custom hook, #2 - returns query/setQuery/results/clearSearch
 * AC: #3 - 300ms debounce, #4 - consumes RecipesContext
 */
export function useSearch(): UseSearchReturn {
  // Task 4: Consume RecipesContext (AC: #4)
  const { allRecipes, isLoading, error } = useRecipes();

  // Task 2: Query state (AC: #2)
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Task 3: Debounce effect (AC: #3)
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [query, debouncedQuery]);

  // Task 4: Search results (AC: #2, #4)
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }
    return searchRecipes(debouncedQuery, allRecipes);
  }, [debouncedQuery, allRecipes]);

  // Task 2: Clear search function (AC: #2)
  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsDebouncing(false);
  };

  return {
    query,
    setQuery,
    results,
    clearSearch,
    isLoading,
    error,
    isDebouncing,
  };
}
