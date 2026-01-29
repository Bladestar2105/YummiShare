import React from 'react';
import { create, act } from 'react-test-renderer';
import RecipeItem from '../components/RecipeItem';
import { Recipe } from '../types';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

const mockItem: Recipe = {
  id: '1',
  name: 'Test Recipe',
  description: 'Test Description',
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
  userId: 'user1',
  isPublic: true,
};

describe('RecipeItem', () => {
  it('renders correctly', () => {
    let root;
    act(() => {
      root = create(<RecipeItem item={mockItem} />);
    });
    // @ts-ignore
    expect(root.toJSON()).toBeDefined();
  });
});
