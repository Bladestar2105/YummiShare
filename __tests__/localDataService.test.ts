import { saveRecipe } from '../services/localDataService';
import { RecipeFormData } from '../types';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

// Mock userService
jest.mock('../services/userService', () => ({
  getUserId: jest.fn(() => Promise.resolve('test-user-id')),
}));

describe('localDataService', () => {
  it('should save a recipe with isPublic true', async () => {
    const data: RecipeFormData = {
      name: 'Test Recipe',
      description: 'Test Description',
      category: 'main-course',
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
      ingredients: [],
      steps: ['Step 1'],
      tags: [],
      isPublic: true,
    };

    const result = await saveRecipe(data);

    expect(result).toBeDefined();
    expect(result.isPublic).toBe(true);
    expect(result.id).toBe('test-uuid');
  });
});
