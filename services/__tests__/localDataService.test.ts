import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveRecipe } from '../localDataService';
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
  });
});
