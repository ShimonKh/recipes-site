import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import type { SearchResult } from '../../utils/searchRecipes';
import styles from './SearchBar.module.css';
import SearchResults from '../SearchResults/SearchResults';

interface SearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

export default function SearchBar({ onResultClick }: SearchBarProps) {
  const { query, setQuery, results, clearSearch, error, isDebouncing } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = 'search-input';
  const listboxId = 'search-results';

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    clearSearch();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearSearch();
    inputRef.current?.focus();
  };

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(
    results,
    handleResultClick,
    handleClose
  );

  // Open dropdown when there are results, query >= 1 (for min chars hint), or error
  useEffect(() => {
    setIsOpen(query.length >= 1 || error !== null);
  }, [query, error]);

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  const getOptionId = (index: number) => index >= 0 ? `${listboxId}-option-${index}` : undefined;

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon} aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        className={styles.searchInput}
        placeholder="Найти рецепт или ингредиент..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Поиск рецептов"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={getOptionId(focusedIndex)}
        role="combobox"
        autoComplete="off"
      />
      {query && (
        <button 
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Очистить поиск"
          type="button"
        >
          ✕
        </button>
      )}
      
      {isOpen && (
        <SearchResults
          results={results}
          onResultClick={handleResultClick}
          onClose={handleClose}
          focusedIndex={focusedIndex}
          listboxId={listboxId}
          query={query}
          error={error}
          isDebouncing={isDebouncing}
        />
      )}
    </div>
  );
}
