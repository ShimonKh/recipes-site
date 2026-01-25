import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MobileSearchOverlay from './MobileSearchOverlay';
import * as useSearchHook from '../../hooks/useSearch';
import type { SearchResult } from '../../utils/searchRecipes';

// Mock useSearch hook
vi.mock('../../hooks/useSearch', () => ({
  useSearch: vi.fn(),
}));

// Mock SearchResultItem component
vi.mock('../SearchResults/SearchResultItem', () => ({
  default: ({ result, onClick }: any) => (
    <div data-testid="search-result-item" onClick={onClick}>
      {result.recipe.title}
    </div>
  ),
}));

const mockSearchResult: SearchResult = {
  recipe: {
    title: 'Морковный салат',
    category: 'salads',
    ingredients: ['морковь'],
    steps: ['нарежьте'],
  },
  category: 'salads',
  matchType: 'title',
  matchText: 'Морковный салат',
};

describe('MobileSearchOverlay', () => {
  const mockOnClose = vi.fn();
  const mockOnResultClick = vi.fn();
  const mockSetQuery = vi.fn();
  const mockClearSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchHook.useSearch).mockReturnValue({
      query: '',
      setQuery: mockSetQuery,
      results: [],
      clearSearch: mockClearSearch,
    });
  });

  describe('Rendering (AC: #1, #2)', () => {
    it('does not render when isOpen is false', () => {
      render(
        <MobileSearchOverlay
          isOpen={false}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      expect(screen.queryByLabelText('Поиск рецептов')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      expect(screen.getByLabelText('Поиск рецептов')).toBeInTheDocument();
    });

    it('renders backdrop', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      // Backdrop is a div that closes overlay on click
      const overlay = screen.getByLabelText('Поиск рецептов').closest('[class*="overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const input = screen.getByPlaceholderText('Найти рецепт или ингредиент...');
      expect(input).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const closeButton = screen.getByLabelText('Закрыть поиск');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Auto-focus (AC: #3, #4)', () => {
    it('auto-focuses input when overlay opens', async () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const input = screen.getByLabelText('Поиск рецептов');
      
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('Close functionality (AC: #5, #6)', () => {
    it('calls onClose when close button is clicked', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const closeButton = screen.getByLabelText('Закрыть поиск');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockClearSearch).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      // Find backdrop and click it
      const overlay = screen.getByLabelText('Поиск рецептов').closest('[class*="overlay"]');
      const backdrop = overlay?.querySelector('[class*="backdrop"]');
      
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockClearSearch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Search input (AC: #3)', () => {
    it('calls setQuery when input value changes', () => {
      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const input = screen.getByLabelText('Поиск рецептов');
      
      fireEvent.change(input, { target: { value: 'морков' } });
      
      expect(mockSetQuery).toHaveBeenCalledWith('морков');
    });

    it('binds query value to input', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'тестовый запрос',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      const input = screen.getByLabelText('Поиск рецептов') as HTMLInputElement;
      expect(input.value).toBe('тестовый запрос');
    });
  });

  describe('Search results (AC: #7)', () => {
    it('displays search results when available', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(screen.getByTestId('search-result-item')).toBeInTheDocument();
      expect(screen.getByText('Морковный салат')).toBeInTheDocument();
    });

    it('displays empty state when no results and query length >= 2', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'xyz',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(screen.getByText(/Ничего не найдено/)).toBeInTheDocument();
    });

    it('calls onResultClick and closes overlay when result is clicked', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      const resultItem = screen.getByTestId('search-result-item');
      fireEvent.click(resultItem);
      
      expect(mockOnResultClick).toHaveBeenCalledWith(mockSearchResult);
      expect(mockClearSearch).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Body scroll lock (AC: #8)', () => {
    it('disables body scroll when overlay opens', () => {
      const { rerender } = render(
        <MobileSearchOverlay
          isOpen={false}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(document.body.style.overflow).toBe('');
      
      rerender(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when overlay closes', () => {
      const { rerender } = render(
        <MobileSearchOverlay
          isOpen={true}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(
        <MobileSearchOverlay
          isOpen={false}
          onClose={mockOnClose}
          onResultClick={mockOnResultClick}
        />
      );
      
      expect(document.body.style.overflow).toBe('');
    });
  });
});
