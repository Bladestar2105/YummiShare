import { filterByMaxTime, searchByIngredients } from '../utils/recipeUtils';
import { Recipe, Ingredient } from '../types';

describe('recipeUtils', () => {
  describe('filterByMaxTime', () => {
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Quick',
        totalTime: 15,
        prepTime: 5,
        cookTime: 10,
        // ... other props
      } as Recipe,
      {
        id: '2',
        name: 'Slow',
        totalTime: 60,
        prepTime: 30,
        cookTime: 30,
      } as Recipe,
      {
        id: '3',
        name: 'Medium',
        totalTime: 30,
        prepTime: 10,
        cookTime: 20,
      } as Recipe,
    ];

    it('should filter recipes by max time correctly', () => {
      const result = filterByMaxTime(mockRecipes, 30);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toContain('Quick');
      expect(result.map(r => r.name)).toContain('Medium');
      expect(result.map(r => r.name)).not.toContain('Slow');
    });

    it('should return all recipes if maxMinutes is 0', () => {
      const result = filterByMaxTime(mockRecipes, 0);
      expect(result).toHaveLength(3);
    });
  });

  describe('searchByIngredients', () => {
    const mockIngredients: Ingredient[] = [
      { id: '1', name: 'Tomato', amount: 1, unit: 'pcs' },
      { id: '2', name: 'Cheese', amount: 100, unit: 'g' },
      { id: '3', name: 'Basil', amount: 5, unit: 'leaves' },
    ];

    const mockRecipe: Recipe = {
      id: 'r1',
      name: 'Pizza',
      description: 'Yum',
      category: 'main-course',
      prepTime: 10,
      cookTime: 10,
      totalTime: 20,
      servings: 2,
      defaultServings: 2,
      difficulty: 'easy',
      ingredients: mockIngredients,
      steps: [],
      tags: [],
      isFavorite: false,
      rating: 5,
      reviewCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'u1',
      isPublic: true
    };

    const recipes = [mockRecipe];

    it('returns all recipes if search is empty', () => {
      expect(searchByIngredients(recipes, [])).toEqual(recipes);
    });

    it('finds recipe by exact ingredient name', () => {
      expect(searchByIngredients(recipes, ['Tomato'])).toHaveLength(1);
    });

    it('finds recipe by case-insensitive ingredient name', () => {
      expect(searchByIngredients(recipes, ['tomato'])).toHaveLength(1);
      expect(searchByIngredients(recipes, ['TOMATO'])).toHaveLength(1);
    });

    it('finds recipe by partial ingredient name', () => {
      expect(searchByIngredients(recipes, ['Tom'])).toHaveLength(1);
    });

    it('finds recipe by multiple existing ingredients', () => {
      expect(searchByIngredients(recipes, ['Tomato', 'Cheese'])).toHaveLength(1);
    });

    it('does not find recipe if one ingredient is missing', () => {
      expect(searchByIngredients(recipes, ['Tomato', 'Pineapple'])).toHaveLength(0);
    });

    it('does not find recipe if ingredient is not present', () => {
      expect(searchByIngredients(recipes, ['Pineapple'])).toHaveLength(0);
    });

    it('handles regex special characters safely', () => {
      // If user types '(', it should not crash regex
      expect(searchByIngredients(recipes, ['('])).toHaveLength(0);
    });
  });
});
