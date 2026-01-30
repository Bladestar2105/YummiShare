import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { getRecipeById } from '../services/localDataService';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    useRoute: () => ({
      params: { recipeId: 'test-recipe-id' },
    }),
    RouteProp: {},
  };
});

// Mock services
jest.mock('../services/localDataService', () => ({
  getRecipeById: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (inset: any) => React.ReactNode }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaInsetsContext: React.createContext(inset),
  };
});

// Mock react-native-paper List.Icon to check if it's rendered
jest.mock('react-native-paper', () => {
    const React = require('react');
    const { View } = require('react-native');
    const Actual = jest.requireActual('react-native-paper');
    return {
        ...Actual,
        List: {
            ...Actual.List,
            Icon: (props: any) => <View testID="list-icon" {...props} />,
        }
    };
});

describe('RecipeDetailScreen', () => {
  const mockRecipe = {
    id: 'test-recipe-id',
    name: 'Test Recipe',
    description: 'Test Description',
    category: 'main-course',
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    servings: 4,
    defaultServings: 4,
    difficulty: 'medium',
    ingredients: [
      { id: '1', name: 'Ingredient 1', amount: 100, unit: 'g' },
      { id: '2', name: 'Ingredient 2', amount: 2, unit: 'pcs' },
    ],
    steps: ['Step 1', 'Step 2'],
    tags: [],
    isFavorite: false,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
    isPublic: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <PaperProvider>
        {component}
      </PaperProvider>
    );
  };

  it('renders recipe details and ingredients correctly', async () => {
    const { getByText, getAllByTestId } = renderWithProviders(<RecipeDetailScreen />);

    // Wait for recipe to load
    await waitFor(() => {
        expect(getByText('Test Recipe')).toBeTruthy();
    });

    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Ingredient 1')).toBeTruthy();
    expect(getByText('100 g')).toBeTruthy();
    expect(getByText('Ingredient 2')).toBeTruthy();

    // Check if icons are rendered
    const icons = getAllByTestId('list-icon');
    expect(icons.length).toBe(2); // 2 ingredients
  });
});
