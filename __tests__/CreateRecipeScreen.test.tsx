import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { saveRecipe } from '../services/localDataService';
import { Alert } from 'react-native';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock the saveRecipe service
jest.mock('../services/localDataService', () => ({
  saveRecipe: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaInsetsContext: React.createContext(inset),
  };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('CreateRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and allows submitting the form', async () => {
    (saveRecipe as jest.Mock).mockResolvedValue({});

    const { getByText, getByTestId, getAllByTestId } = renderWithProviders(<CreateRecipeScreen />);

    // Check if title exists
    expect(getByText('Create a New Recipe')).toBeTruthy();

    // Verify switch exists
    expect(getByTestId('is-public-switch')).toBeTruthy();
    expect(getByText('Make Recipe Public')).toBeTruthy();

    // Fill in required fields
    const inputs = getAllByTestId('text-input-outlined');

    fireEvent.changeText(inputs[0], 'Test Recipe');
    fireEvent.changeText(inputs[1], 'This is a test description');
    fireEvent.changeText(inputs[2], '10');
    fireEvent.changeText(inputs[3], '20');
    fireEvent.changeText(inputs[4], '4');

    // Ingredient
    fireEvent.changeText(inputs[5], '100');
    fireEvent.changeText(inputs[6], 'g');
    fireEvent.changeText(inputs[7], 'Flour');

    // Step
    fireEvent.changeText(inputs[8], 'Mix everything together.');

    // Difficulty
    // fireEvent.press(getByTestId('difficulty-medium')); // Assuming default or specific ID

    // Submit
    const saveButton = getByText('Save Recipe');
    await act(async () => {
        fireEvent.press(saveButton);
    });

    await waitFor(() => {
        expect(saveRecipe).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Recipe',
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            ingredients: [expect.objectContaining({ name: 'Flour', amount: 100, unit: 'g' })],
            steps: ['Mix everything together.']
        }));
    });
  });
});
