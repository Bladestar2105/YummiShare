import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { saveRecipe } from '../services/localDataService';
import { Alert, TouchableOpacity, View, Text } from 'react-native';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock services
jest.mock('../services/localDataService', () => ({
  saveRecipe: jest.fn(),
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

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const Actual = jest.requireActual('react-native-paper');

  const Menu = ({ visible, onDismiss, anchor, children }: any) => {
    return (
      <View>
        {anchor}
        {visible && <View testID="mock-menu">{children}</View>}
      </View>
    );
  };

  const MenuItem = ({ onPress, title }: any) => (
    <TouchableOpacity onPress={onPress} testID={`menu-item-${title}`}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );

  // Attach Item to Menu
  (Menu as any).Item = MenuItem;

  return {
    ...Actual,
    Provider: ({ children }: any) => children,
    Menu: Menu,
    // We don't export MenuItem directly as it is accessed via Menu.Item
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and allows submitting the form with category selection', async () => {
    (saveRecipe as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert');

    const { getByText, getByLabelText, getByTestId } = renderWithProviders(<CreateRecipeScreen />);

    // Check if title exists
    expect(getByText('Create a New Recipe')).toBeTruthy();

    // Fill in required fields
    fireEvent.changeText(getByTestId('recipe-name-input'), 'Test Recipe');
    fireEvent.changeText(getByTestId('description-input'), 'This is a test description for the recipe.');

    // Fill numbers
    fireEvent.changeText(getByTestId('prep-time-input'), '10');
    fireEvent.changeText(getByTestId('cook-time-input'), '20');
    fireEvent.changeText(getByTestId('servings-input'), '4');

    // Fill ingredient (assuming default one exists)
    fireEvent.changeText(getByTestId('ingredient-amount-0'), '100');
    fireEvent.changeText(getByTestId('ingredient-unit-0'), 'g');
    fireEvent.changeText(getByTestId('ingredient-name-0'), 'Flour');

    // Fill step
    fireEvent.changeText(getByTestId('step-0'), 'Mix everything together.');

    // --- Category Selection ---
    // Open the menu
    const categoryInputTrigger = getByLabelText('Category');
    fireEvent.press(categoryInputTrigger);

    // Select 'Desserts' (id: dessert).
    const dessertItem = getByText(/Desserts/);
    fireEvent.press(dessertItem);

    // Submit
    const saveButton = getByTestId('save-button');
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
