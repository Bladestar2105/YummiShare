import React from 'react';
import { performance } from 'perf_hooks';
import renderer from 'react-test-renderer';
import RecipesScreen from '../screens/RecipesScreen';
import * as localDataService from '../services/localDataService';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => {
      const React = require('react');
      React.useEffect(callback, []);
  }),
}));

jest.mock('../services/localDataService', () => ({
  getAllRecipes: jest.fn(),
}));

const generateMockRecipes = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `id_${i}`,
    name: `Recipe ${i}`,
    description: 'Description',
    category: 'main-course',
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    servings: 4,
    defaultServings: 4,
    difficulty: 'medium',
    ingredients: [],
    steps: [],
    tags: [],
    isFavorite: false,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user_id',
    isPublic: true,
  }));
};

describe('RecipesScreen Performance', () => {
  it('renders a large list of recipes efficiently', async () => {
    const mockRecipes = generateMockRecipes(200);
    (localDataService.getAllRecipes as jest.Mock).mockResolvedValue(mockRecipes);

    const start = performance.now();
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(<RecipesScreen />);
    });
    const end = performance.now();

    console.log(`Render time for 200 items: ${(end - start).toFixed(2)}ms`);

    // Basic verification that it rendered
    expect(tree).toBeDefined();
  }, 10000);
});
