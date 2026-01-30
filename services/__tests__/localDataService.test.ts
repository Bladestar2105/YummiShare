import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveRecipe, getAllRecipes, resetCache } from '../localDataService';
import { getUserId } from '../userService';
import { v4 as uuidv4 } from 'uuid';
import { RecipeFormData } from '../../types';

jest.mock('../userService');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('localDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetCache(); // Ensure cache is empty before each test
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  describe('saveRecipe', () => {
    it('should save a new recipe with the correct user ID', async () => {
      const mockUserId = 'mock-user-id';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');

      // Mock getRecipes to return empty array
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const formData: RecipeFormData = {
        name: 'Test Recipe',
        description: 'Test Description',
        category: 'main-course',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: 'medium',
        ingredients: [
          { name: 'Ingredient 1', amount: 100, unit: 'g' },
        ],
        steps: ['Step 1'],
        tags: ['tag1'],
        isPublic: false,
      };

      const savedRecipe = await saveRecipe(formData);

      expect(savedRecipe).toEqual(expect.objectContaining({
        ...formData,
        id: 'mock-uuid',
        userId: mockUserId,
        ingredients: [
             expect.objectContaining({
                 name: 'Ingredient 1',
                 id: 'mock-uuid',
             })
        ]
      }));

      expect(getUserId).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'recipes',
        expect.stringContaining(mockUserId)
      );
    });

    it('should not use hardcoded "local-user" as userId', async () => {
      const mockUserId = 'generated-user-id';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const formData: RecipeFormData = {
        name: 'Test Recipe',
        description: 'Test Description',
        category: 'main-course',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: 'medium',
        ingredients: [],
        steps: [],
        tags: [],
        isPublic: false,
      };

      const savedRecipe = await saveRecipe(formData);

      expect(savedRecipe.userId).toBe(mockUserId);
      expect(savedRecipe.userId).not.toBe('local-user');
    });
  });

  describe('getAllRecipes', () => {
    it('should return recipes with Date objects for createdAt and updatedAt', async () => {
      const mockRecipes = [
        {
          id: '1',
          name: 'Test',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        }
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockRecipes));

      const recipes = await getAllRecipes();

      expect(recipes).toHaveLength(1);
      expect(recipes[0].createdAt).toBeInstanceOf(Date);
      expect(recipes[0].updatedAt).toBeInstanceOf(Date);
      expect(recipes[0].createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should use cache on second call', async () => {
      const mockRecipes = [
        {
          id: '1',
          name: 'Test',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        }
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockRecipes));

      // First call
      await getAllRecipes();
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);

      // Second call
      (AsyncStorage.getItem as jest.Mock).mockClear();
      const cachedRecipes = await getAllRecipes();
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(cachedRecipes).toHaveLength(1);
      expect(cachedRecipes[0].id).toBe('1');
    });
  });
});
