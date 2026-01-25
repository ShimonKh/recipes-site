import { useState, useEffect } from 'react';
import type { SearchResult } from '../utils/searchRecipes';

interface UseKeyboardNavigationReturn {
  focusedIndex: number;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * Hook for keyboard navigation in search results
 * AC: #1, #2, #3, #4 - Arrow keys, Enter, Escape
 */
export function useKeyboardNavigation(
  results: SearchResult[],
  onSelect: (result: SearchResult) => void,
  onClose: () => void
): UseKeyboardNavigationReturn {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Reset focus when results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [results]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        if (focusedIndex >= 0 && results[focusedIndex]) {
          onSelect(results[focusedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
}
