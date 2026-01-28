import { filterByMaxTime } from '../utils/recipeUtils';
import { Recipe } from '../types';

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
});
