import type { SearchResult, MatchType } from '../../utils/searchRecipes';
import { categoryEmojis } from '../../data/categoryEmojis';
import styles from './SearchResults.module.css';

interface SearchResultItemProps {
  id?: string;
  result: SearchResult;
  onClick: () => void;
  isFocused?: boolean;
}

function getMatchContext(matchType: MatchType, matchText: string): string {
  switch (matchType) {
    case 'title':
      return 'в названии';
    case 'ingredient':
      // Truncate long ingredient text
      const truncated = matchText.length > 30 
        ? matchText.slice(0, 30) + '...' 
        : matchText;
      return `в ингредиентах: ${truncated}`;
    case 'step':
      return 'в шагах приготовления';
    case 'tips':
      return 'в советах';
    case 'notes':
      return 'в заметках';
    default:
      return '';
  }
}

export default function SearchResultItem({ id, result, onClick, isFocused = false }: SearchResultItemProps) {
  const emoji = categoryEmojis[result.category];
  const context = getMatchContext(result.matchType, result.matchText);

  return (
    <div 
      id={id}
      className={`${styles.resultItem} ${isFocused ? styles.focused : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={isFocused}
    >
      <span className={styles.emoji} aria-hidden="true">{emoji}</span>
      <div className={styles.resultContent}>
        <div className={styles.title}>{result.recipe.title}</div>
        <div className={styles.matchContext}>{context}</div>
      </div>
    </div>
  );
}
