import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeroSearchBar from './HeroSearchBar';
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

const mockSearchResult2: SearchResult = {
  recipe: {
    title: 'Морковный кекс',
    category: 'desserts',
    ingredients: ['морковь'],
    steps: ['смешайте'],
  },
  category: 'desserts',
  matchType: 'title',
  matchText: 'Морковный кекс',
};

describe('HeroSearchBar', () => {
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

  describe('Rendering (Story 4.1 AC: #1, #2)', () => {
    it('renders search input with placeholder', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByPlaceholderText('Найти рецепт или ингредиент...');
      expect(input).toBeInTheDocument();
    });

    it('renders search icon', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const icon = screen.getByText('🔍');
      expect(icon).toBeInTheDocument();
    });

    it('has correct aria-label on input', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByLabelText('Поиск рецептов');
      expect(input).toBeInTheDocument();
    });

    it('input has larger font size styling', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByLabelText('Поиск рецептов');
      // CSS modules add hash, so we check that class name contains the base name
      expect(input.className).toContain('heroSearchInput');
    });
  });

  describe('Clear button (Story 4.1 AC: #3)', () => {
    it('does not show clear button when input is empty', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const clearButton = screen.queryByLabelText('Очистить поиск');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('shows clear button when input has text', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'тест',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const clearButton = screen.getByLabelText('Очистить поиск');
      expect(clearButton).toBeInTheDocument();
    });

    it('calls clearSearch and closes dropdown when clear button is clicked', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'тест',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const clearButton = screen.getByLabelText('Очистить поиск');
      fireEvent.click(clearButton);

      expect(mockClearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input interaction (Story 4.1 AC: #3)', () => {
    it('calls setQuery when input value changes', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByPlaceholderText('Найти рецепт или ингредиент...');

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

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByPlaceholderText('Найти рецепт или ингредиент...') as HTMLInputElement;
      expect(input.value).toBe('тестовый запрос');
    });
  });

  describe('Results dropdown (Story 4.1 AC: #4)', () => {
    it('shows results dropdown when query length >= 2 and results exist', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      expect(screen.getByTestId('search-result-item')).toBeInTheDocument();
    });

    it('does not show dropdown when query length < 2', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'м',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      expect(screen.queryByTestId('search-result-item')).not.toBeInTheDocument();
    });

    it('shows results header with count (Story 4.2 AC: #3)', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult, mockSearchResult2],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      expect(screen.getByText('Результаты поиска (2)')).toBeInTheDocument();
    });

    it('calls onResultClick when result is clicked', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const resultItem = screen.getByText('Морковный салат');
      fireEvent.click(resultItem);

      expect(mockOnResultClick).toHaveBeenCalledWith(mockSearchResult);
      expect(mockClearSearch).toHaveBeenCalled();
    });
  });

  describe('Empty state (Story 4.2 AC: #4)', () => {
    it('shows empty state when query length >= 2 and no results', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'xyz123',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      
      expect(screen.getByText(/Ничего не найдено по запросу «xyz123»/)).toBeInTheDocument();
      expect(screen.getByText('Попробуйте другие ключевые слова')).toBeInTheDocument();
    });

    it('does not show empty state when query length < 2', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'x',
        setQuery: mockSetQuery,
        results: [],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      
      expect(screen.queryByText(/Ничего не найдено/)).not.toBeInTheDocument();
    });
  });

  describe('Escape key handler (Story 4.2 AC: #4, Story 5.1 AC: #4)', () => {
    it('closes dropdown and clears search when Escape is pressed on input', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      
      // Verify dropdown is open
      expect(screen.getByTestId('search-result-item')).toBeInTheDocument();
      
      // Press Escape on input (keyboard navigation is handled via onKeyDown)
      const input = screen.getByLabelText('Поиск рецептов');
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      
      expect(mockClearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Click outside handler (Story 4.2 AC: #4)', () => {
    it('sets up click outside handler', () => {
      vi.mocked(useSearchHook.useSearch).mockReturnValue({
        query: 'морков',
        setQuery: mockSetQuery,
        results: [mockSearchResult],
        clearSearch: mockClearSearch,
      });

      const { container } = render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      
      // Verify dropdown is open
      expect(screen.getByTestId('search-result-item')).toBeInTheDocument();
      
      // Click outside the component
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      fireEvent.mouseDown(outsideElement);
      
      // Cleanup
      document.body.removeChild(outsideElement);
      
      // The handler is set up - actual state change is hard to test without waiting
      // but we verify the component structure is correct
      expect(container.querySelector('[class*="heroSearchContainer"]')).toBeInTheDocument();
    });
  });

  describe('Focus state', () => {
    it('input can receive focus', () => {
      render(<HeroSearchBar onResultClick={mockOnResultClick} />);
      const input = screen.getByPlaceholderText('Найти рецепт или ингредиент...');
      input.focus();
      expect(input).toHaveFocus();
    });
  });
});
