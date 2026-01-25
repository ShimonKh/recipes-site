import { useEffect, useRef } from 'react';
import type { SearchResult } from '../../utils/searchRecipes';
import SearchResultItem from './SearchResultItem';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
  focusedIndex?: number;
  listboxId?: string;
  query?: string;
  error?: string | null;
  isDebouncing?: boolean;
}

export default function SearchResults({ 
  results, 
  onResultClick, 
  onClose, 
  focusedIndex = -1,
  listboxId,
  query = '',
  error = null,
  isDebouncing = false
}: SearchResultsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const showMinCharsHint = query.length === 1;
  // Don't show "no results" if debounce is in progress
  const showNoResults = query.length >= 2 && results.length === 0 && !error && !isDebouncing;
  const showError = error !== null;
  const showResults = results.length > 0 && !error;

  // Don't show dropdown if nothing to show
  if (!showMinCharsHint && !showNoResults && !showError && !showResults) return null;

  const getOptionId = (index: number) => listboxId ? `${listboxId}-option-${index}` : undefined;

  return (
    <div 
      ref={dropdownRef} 
      id={listboxId}
      className={styles.dropdown}
      role="listbox"
      aria-label="Результаты поиска"
    >
      {/* Error state */}
      {showError && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
          <p>Не удалось загрузить рецепты.</p>
          <p className={styles.hint}>Попробуйте обновить страницу.</p>
        </div>
      )}
      
      {/* Min chars hint */}
      {!showError && showMinCharsHint && (
        <div className={styles.hintState}>
          <p>Введите минимум 2 символа</p>
        </div>
      )}
      
      {/* No results */}
      {!showError && showNoResults && (
        <div className={styles.emptyState}>
          <span className={styles.emoji} aria-hidden="true">😕</span>
          <p>Ничего не найдено по запросу «{query}»</p>
          <p className={styles.hint}>Попробуйте другие ключевые слова</p>
        </div>
      )}
      
      {/* Results */}
      {showResults && results.map((result, index) => (
        <SearchResultItem
          key={`${result.recipe.title}-${index}`}
          id={getOptionId(index)}
          result={result}
          onClick={() => onResultClick(result)}
          isFocused={index === focusedIndex}
        />
      ))}
    </div>
  );
}
