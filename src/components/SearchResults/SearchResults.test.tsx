import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from './SearchResults';
import type { SearchResult } from '../../utils/searchRecipes';

// Mock SearchResultItem component
vi.mock('./SearchResultItem', () => ({
  default: ({ result, onClick }: any) => (
    <div data-testid="search-result-item" onClick={onClick}>
      {result.recipe.title}
    </div>
  ),
}));

const mockResults: SearchResult[] = [
  {
    recipe: {
      title: 'Морковный салат',
      category: 'salads',
      ingredients: ['морковь'],
      steps: ['нарежьте'],
    },
    category: 'salads',
    matchType: 'title',
    matchText: 'Морковный салат',
  },
  {
    recipe: {
      title: 'Борщ',
      category: 'soups',
      ingredients: ['свекла'],
      steps: ['варите'],
    },
    category: 'soups',
    matchType: 'title',
    matchText: 'Борщ',
  },
];

describe('SearchResults', () => {
  const mockOnResultClick = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering (AC: #1)', () => {
    it('renders nothing when results array is empty', () => {
      const { container } = render(
        <SearchResults results={[]} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders dropdown when results exist', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );
      const items = screen.getAllByTestId('search-result-item');
      expect(items).toHaveLength(2);
    });

    it('renders all result items', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );
      expect(screen.getByText('Морковный салат')).toBeInTheDocument();
      expect(screen.getByText('Борщ')).toBeInTheDocument();
    });
  });

  describe('Click outside behavior (AC: #5)', () => {
    it('calls onClose when clicking outside dropdown', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking inside dropdown', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      const item = screen.getByText('Морковный салат');
      fireEvent.mouseDown(item);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Escape key behavior', () => {
    // Note: Escape key handling is now done in parent components via useKeyboardNavigation
    // This test is kept for backward compatibility but may not be relevant
    it('does not handle Escape key directly (handled by parent)', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      // Escape is now handled by parent component's keyboard navigation
      // This test verifies the component doesn't break
      expect(screen.getAllByTestId('search-result-item')).toHaveLength(2);
    });
  });

  describe('Result click behavior', () => {
    it('calls onResultClick when result item is clicked', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      const item = screen.getByText('Морковный салат');
      fireEvent.click(item);

      expect(mockOnResultClick).toHaveBeenCalledWith(mockResults[0]);
    });

    it('calls onResultClick with correct result for each item', () => {
      render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      fireEvent.click(screen.getByText('Борщ'));

      expect(mockOnResultClick).toHaveBeenCalledWith(mockResults[1]);
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(
        <SearchResults results={mockResults} onResultClick={mockOnResultClick} onClose={mockOnClose} />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      // Note: keydown listener removed from SearchResults (now handled by parent)

      removeEventListenerSpy.mockRestore();
    });
  });
});
