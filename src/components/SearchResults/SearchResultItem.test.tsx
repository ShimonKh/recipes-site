import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResultItem from './SearchResultItem';
import type { SearchResult } from '../../utils/searchRecipes';

// Mock categoryEmojis
vi.mock('../../data/categoryEmojis', () => ({
  categoryEmojis: {
    salads: '🥗',
    fish: '🐟',
    meat: '🍖',
    sides: '🍽️',
    breakfasts: '🍳',
    soups: '🥣',
    sauces: '🧄',
    desserts: '🍰',
    other: '📦',
  },
}));

const createMockResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  recipe: {
    title: 'Морковный салат',
    category: 'salads',
    ingredients: ['морковь'],
    steps: ['нарежьте'],
  },
  category: 'salads',
  matchType: 'title',
  matchText: 'Морковный салат',
  ...overrides,
});

describe('SearchResultItem', () => {
  const mockOnClick = vi.fn();

  describe('Rendering (AC: #2)', () => {
    it('displays recipe title', () => {
      const result = createMockResult();
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText('Морковный салат')).toBeInTheDocument();
    });

    it('displays category emoji', () => {
      const result = createMockResult();
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText('🥗')).toBeInTheDocument();
    });

    it('displays correct emoji for different categories', () => {
      const result = createMockResult({ category: 'soups' });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText('🥣')).toBeInTheDocument();
    });
  });

  describe('Match context (AC: #3)', () => {
    it('displays "в названии" for title match', () => {
      const result = createMockResult({ matchType: 'title' });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText(/в названии/)).toBeInTheDocument();
    });

    it('displays "в ингредиентах: {ingredient}" for ingredient match', () => {
      const result = createMockResult({
        matchType: 'ingredient',
        matchText: 'морковь',
      });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText(/в ингредиентах: морковь/)).toBeInTheDocument();
    });

    it('truncates long ingredient text', () => {
      const longIngredient = 'очень длинный ингредиент который нужно обрезать';
      const result = createMockResult({
        matchType: 'ingredient',
        matchText: longIngredient,
      });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      const context = screen.getByText(/в ингредиентах:/);
      expect(context.textContent).toContain('...');
      expect(context.textContent?.length).toBeLessThan(longIngredient.length + 20);
    });

    it('displays "в шагах приготовления" for step match', () => {
      const result = createMockResult({ matchType: 'step' });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText(/в шагах приготовления/)).toBeInTheDocument();
    });

    it('displays "в советах" for tips match', () => {
      const result = createMockResult({ matchType: 'tips' });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText(/в советах/)).toBeInTheDocument();
    });

    it('displays "в заметках" for notes match', () => {
      const result = createMockResult({ matchType: 'notes' });
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      expect(screen.getByText(/в заметках/)).toBeInTheDocument();
    });
  });

  describe('Click behavior', () => {
    it('calls onClick when item is clicked', () => {
      const result = createMockResult();
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      
      const item = screen.getByText('Морковный салат').closest('div[role="option"]');
      if (item) {
        fireEvent.click(item);
      }

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('has correct role attribute', () => {
      const result = createMockResult();
      render(<SearchResultItem result={result} onClick={mockOnClick} />);
      
      const item = screen.getByRole('option');
      expect(item).toBeInTheDocument();
    });
  });
});
