import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { saveRecipe } from '../services/localDataService';

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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('CreateRecipeScreen', () => {
  it('renders correctly and allows submitting the form', async () => {
    (saveRecipe as jest.Mock).mockResolvedValue({});

    const { getByText, getByLabelText, getAllByText } = renderWithProviders(<CreateRecipeScreen />);

    // Check if title exists
    expect(getByText('Create a New Recipe')).toBeTruthy();

    // Fill in required fields
    fireEvent.changeText(getByLabelText('Recipe Name'), 'Test Recipe');
    fireEvent.changeText(getByLabelText('Description'), 'This is a test description for the recipe.');

    // Fill numbers
    fireEvent.changeText(getByLabelText('Prep Time (min)'), '10');
    fireEvent.changeText(getByLabelText('Cook Time (min)'), '20');
    fireEvent.changeText(getByLabelText('Servings'), '4');

    // Fill ingredient
    // Note: The form has initial empty ingredient
    fireEvent.changeText(getByLabelText('Amount'), '100');
    fireEvent.changeText(getByLabelText('Unit'), 'g');
    fireEvent.changeText(getByLabelText('Name'), 'Flour');

    // Fill step
    fireEvent.changeText(getByLabelText('Step 1'), 'Mix everything together.');

    // Select Category - Now using Menu
    // 'Hauptgerichte' corresponds to 'main-course' which is default.
    // 1. Open Menu
    // We added accessibilityLabel="Category" to the TextInput
    const categoryInput = getByLabelText('Category');
    fireEvent.press(categoryInput);

    // 2. Select Item 'Desserts' (id: dessert)
    // The Menu Item text includes the icon. "🍰 Desserts"
    const dessertItem = await waitFor(() => getByText('🍰 Desserts'));
    fireEvent.press(dessertItem);

    // Submit
    const saveButton = getByText('Save Recipe');
    await act(async () => {
        fireEvent.press(saveButton);
    });

    await waitFor(() => {
        expect(saveRecipe).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Recipe',
            category: 'dessert',
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            ingredients: [expect.objectContaining({ name: 'Flour', amount: 100, unit: 'g' })],
            steps: ['Mix everything together.']
        }));
    });
  });
});
