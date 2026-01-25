import { useEffect, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import type { SearchResult } from '../../utils/searchRecipes';
import SearchResultItem from '../SearchResults/SearchResultItem';
import styles from './MobileSearchOverlay.module.css';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export default function MobileSearchOverlay({ 
  isOpen, 
  onClose, 
  onResultClick 
}: MobileSearchOverlayProps): JSX.Element | null {
  const { query, setQuery, results, clearSearch, error, isDebouncing } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = 'mobile-search-input';
  const listboxId = 'mobile-search-results';

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    clearSearch();
    onClose();
  };

  const handleClose = () => {
    clearSearch();
    onClose();
  };

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(
    results,
    handleResultClick,
    handleClose
  );

  // Auto-focus input when overlay opens (AC: #3, #4)
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Disable body scroll when open (AC: #8)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getOptionId = (index: number) => index >= 0 ? `${listboxId}-option-${index}` : undefined;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {/* Backdrop (AC: #2, #6) */}
      <div className={styles.backdrop} onClick={handleClose} />
      
      {/* Content (AC: #1) */}
      <div className={styles.content}>
        {/* Header with search (AC: #3, #5) */}
        <div className={styles.header}>
          <div className={styles.searchInputContainer}>
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
              aria-expanded={results.length > 0 || query.length >= 2}
              aria-haspopup="listbox"
              aria-controls={query.length >= 2 ? listboxId : undefined}
              aria-activedescendant={getOptionId(focusedIndex)}
              role="combobox"
              autoComplete="off"
            />
          </div>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть поиск"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Results (AC: #7) */}
        <div 
          id={listboxId}
          className={styles.results}
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
          {!error && results.length > 0 && results.map((result, index) => (
            <SearchResultItem
              key={`${result.recipe.title}-${index}`}
              id={getOptionId(index)}
              result={result}
              onClick={() => handleResultClick(result)}
              isFocused={index === focusedIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
