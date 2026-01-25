import { describe, it, expect } from 'vitest';
import { searchRecipes } from './searchRecipes';
import type { RecipeWithCategory } from '../context/RecipesContext';
import type { Recipe, Category } from '../data/types';

// Test fixtures
const createRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  title: 'Test Recipe',
  category: 'salads',
  ingredients: ['ingredient 1', 'ingredient 2'],
  steps: ['step 1', 'step 2'],
  ...overrides,
});

const createRecipeWithCategory = (
  recipe: Partial<Recipe> = {},
  category: Category = 'salads'
): RecipeWithCategory => ({
  recipe: createRecipe(recipe),
  category,
});

const mockRecipes: RecipeWithCategory[] = [
  createRecipeWithCategory({ title: 'Морковный салат', ingredients: ['морковь', 'масло'] }, 'salads'),
  createRecipeWithCategory({ title: 'Борщ', ingredients: ['свекла', 'капуста', 'лимон'] }, 'soups'),
  createRecipeWithCategory({ title: 'Курица', steps: ['нарежьте мясо', 'обжарьте'] }, 'meat'),
  createRecipeWithCategory({ title: 'Паста', tips: ['используйте свежий лимон'] }, 'sides'),
  createRecipeWithCategory({ 
    title: 'Торт', 
    metadata: { notes: 'можно добавить лимонную цедру' } 
  }, 'desserts'),
];

describe('searchRecipes', () => {
  describe('Query validation (AC: #5, #8)', () => {
    it('returns empty array for empty query', () => {
      const results = searchRecipes('', mockRecipes);
      expect(results).toEqual([]);
    });

    it('returns empty array for whitespace-only query', () => {
      const results = searchRecipes('   ', mockRecipes);
      expect(results).toEqual([]);
    });

    it('returns empty array for single character query', () => {
      const results = searchRecipes('а', mockRecipes);
      expect(results).toEqual([]);
    });

    it('accepts queries with 2+ characters', () => {
      const results = searchRecipes('мо', mockRecipes);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Title matching (AC: #1)', () => {
    it('finds recipe by title (case-insensitive)', () => {
      const results = searchRecipes('морковный', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].recipe.title).toBe('Морковный салат');
      expect(results[0].matchType).toBe('title');
    });

    it('finds recipe by partial title match', () => {
      const results = searchRecipes('борщ', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('title');
    });

    it('is case-insensitive for Cyrillic', () => {
      const results = searchRecipes('БОРЩ', mockRecipes);
      expect(results).toHaveLength(1);
    });
  });

  describe('Ingredient matching (AC: #2)', () => {
    it('finds recipe by ingredient', () => {
      const results = searchRecipes('свекла', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].recipe.title).toBe('Борщ');
      expect(results[0].matchType).toBe('ingredient');
      expect(results[0].matchText).toBe('свекла');
    });

    it('returns first matching ingredient as matchText', () => {
      const results = searchRecipes('капуста', mockRecipes);
      expect(results[0].matchText).toBe('капуста');
    });
  });

  describe('Step matching (AC: #3)', () => {
    it('finds recipe by step text', () => {
      const results = searchRecipes('нарежьте', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].recipe.title).toBe('Курица');
      expect(results[0].matchType).toBe('step');
    });
  });

  describe('Tips/Notes matching (AC: #4)', () => {
    it('finds recipe by tips', () => {
      const results = searchRecipes('свежий', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].recipe.title).toBe('Паста');
      expect(results[0].matchType).toBe('tips');
    });

    it('finds recipe by metadata.notes', () => {
      const results = searchRecipes('цедру', mockRecipes);
      expect(results).toHaveLength(1);
      expect(results[0].recipe.title).toBe('Торт');
      expect(results[0].matchType).toBe('notes');
    });
  });

  describe('Relevance sorting (AC: #6)', () => {
    it('sorts results by priority: title > ingredient > step > tips > notes', () => {
      // "лимон" appears in multiple places
      const results = searchRecipes('лимон', mockRecipes);
      
      expect(results.length).toBeGreaterThan(1);
      
      // Check order: ingredient should come before tips, tips before notes
      const matchTypes = results.map((r) => r.matchType);
      const priorities = { title: 1, ingredient: 2, step: 3, tips: 4, notes: 5 };
      
      for (let i = 1; i < matchTypes.length; i++) {
        expect(priorities[matchTypes[i]]).toBeGreaterThanOrEqual(priorities[matchTypes[i - 1]]);
      }
    });

    it('title match takes priority over ingredient match for same recipe', () => {
      const recipesWithTitleAndIngredient: RecipeWithCategory[] = [
        createRecipeWithCategory({ 
          title: 'Лимонный пирог', 
          ingredients: ['лимон', 'сахар'] 
        }, 'desserts'),
      ];
      
      const results = searchRecipes('лимон', recipesWithTitleAndIngredient);
      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('title');
    });
  });

  describe('SearchResult interface (AC: #7)', () => {
    it('returns correct structure with recipe, category, matchType, matchText', () => {
      const results = searchRecipes('морковный', mockRecipes);
      
      expect(results[0]).toHaveProperty('recipe');
      expect(results[0]).toHaveProperty('category');
      expect(results[0]).toHaveProperty('matchType');
      expect(results[0]).toHaveProperty('matchText');
      expect(results[0].category).toBe('salads');
    });
  });

  describe('Edge cases', () => {
    it('handles empty recipes array', () => {
      const results = searchRecipes('test', []);
      expect(results).toEqual([]);
    });

    it('returns empty when no matches found', () => {
      const results = searchRecipes('несуществующий', mockRecipes);
      expect(results).toEqual([]);
    });

    it('handles recipes without tips', () => {
      const recipesNoTips: RecipeWithCategory[] = [
        createRecipeWithCategory({ title: 'Simple', tips: undefined }),
      ];
      const results = searchRecipes('test', recipesNoTips);
      expect(results).toEqual([]);
    });

    it('handles recipes without metadata', () => {
      const recipesNoMeta: RecipeWithCategory[] = [
        createRecipeWithCategory({ title: 'Simple', metadata: undefined }),
      ];
      const results = searchRecipes('test', recipesNoMeta);
      expect(results).toEqual([]);
    });
  });
});
