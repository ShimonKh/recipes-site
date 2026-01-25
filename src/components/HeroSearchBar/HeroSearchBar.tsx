import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import type { SearchResult } from '../../utils/searchRecipes';
import SearchResultItem from '../SearchResults/SearchResultItem';
import styles from './HeroSearchBar.module.css';

interface HeroSearchBarProps {
  onResultClick: (result: SearchResult) => void;
}

export default function HeroSearchBar({ onResultClick }: HeroSearchBarProps) {
  const { query, setQuery, results, clearSearch, error, isDebouncing } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = 'hero-search-input';
  const listboxId = 'hero-search-results';

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
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

  // Open dropdown when query is long enough or results exist
  useEffect(() => {
    setIsOpen(query.length >= 1 || results.length > 0 || error !== null);
  }, [query, results, error]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  const getOptionId = (index: number) => index >= 0 ? `${listboxId}-option-${index}` : undefined;

  return (
    <div ref={containerRef} className={styles.heroSearchContainer}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={styles.heroSearchInput}
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
      </div>

      {isOpen && (
        <div 
          id={listboxId}
          className={styles.resultsDropdown}
          role="listbox"
          aria-label="Результаты поиска"
        >
          {/* Error state */}
          {error && (
            <div className={styles.errorState}>
              <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
              <p>Не удалось загрузить рецепты.</p>
              <p className={styles.hint}>Попробуйте обновить страницу.</p>
            </div>
          )}
          
          {/* Min chars hint */}
          {!error && query.length === 1 && (
            <div className={styles.hintState}>
              <p>Введите минимум 2 символа</p>
            </div>
          )}
          
          {/* No results */}
          {!error && query.length >= 2 && results.length === 0 && !isDebouncing && (
            <div className={styles.emptyState}>
              <span className={styles.emoji} aria-hidden="true">😕</span>
              <p>Ничего не найдено по запросу «{query}»</p>
              <p className={styles.hint}>Попробуйте другие ключевые слова</p>
            </div>
          )}
          
          {/* Results */}
          {!error && results.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                Результаты поиска ({results.length})
              </div>
              {results.map((result, index) => (
                <SearchResultItem
                  key={`${result.recipe.title}-${index}`}
                  id={getOptionId(index)}
                  result={result}
                  onClick={() => handleResultClick(result)}
                  isFocused={index === focusedIndex}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
