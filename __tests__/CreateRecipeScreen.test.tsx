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

  const MockMenu = ({ visible, onDismiss, anchor, children }: any) => (
    <View>
      {anchor}
      {visible && <View testID="menu-content">{children}</View>}
    </View>
  );
  MockMenu.Item = Actual.Menu.Item; // Preserve Item

  return {
    ...Actual,
    Provider: ({ children }: any) => children,
    Switch: ({ value, onValueChange, testID }: any) => (
      <TouchableOpacity testID={testID} onPress={() => onValueChange(!value)}>
        <Text>{value ? 'On' : 'Off'}</Text>
      </TouchableOpacity>
    ),
    Menu: MockMenu,
  };
});

describe('CreateRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (saveRecipe as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert');
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <PaperProvider>
        {component}
      </PaperProvider>
    );
  };

  it('renders correctly and allows submitting the form', async () => {
    const { getByText, getByTestId, getByLabelText } = renderWithProviders(<CreateRecipeScreen />);

    expect(getByText('Create a New Recipe')).toBeTruthy();

    fireEvent.changeText(getByTestId('recipe-name-input'), 'Test Recipe');
    fireEvent.changeText(getByTestId('description-input'), 'This is a test description for the recipe.');
    fireEvent.changeText(getByTestId('prep-time-input'), '10');
    fireEvent.changeText(getByTestId('cook-time-input'), '20');
    fireEvent.changeText(getByTestId('servings-input'), '4');
    fireEvent.changeText(getByTestId('ingredient-amount-0'), '100');
    fireEvent.changeText(getByTestId('ingredient-unit-0'), 'g');
    fireEvent.changeText(getByTestId('ingredient-name-0'), 'Flour');
    fireEvent.changeText(getByTestId('step-0'), 'Mix everything together.'); // > 5 chars

    // Category
    const categoryInput = getByLabelText('Category');
    fireEvent.press(categoryInput);

    const dessertItem = await waitFor(() => getByText('🍰 Desserts'));
    fireEvent.press(dessertItem);

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

  it('renders difficulty selection and submits correctly', async () => {
    const { getByText, getByTestId } = renderWithProviders(<CreateRecipeScreen />);

    expect(getByText('Make Recipe Public')).toBeTruthy();
    expect(getByTestId('is-public-switch')).toBeTruthy();

    // Fill required
    fireEvent.changeText(getByTestId('recipe-name-input'), 'Difficulty Test');
    fireEvent.changeText(getByTestId('description-input'), 'This is a long enough description');
    fireEvent.changeText(getByTestId('prep-time-input'), '5');
    fireEvent.changeText(getByTestId('cook-time-input'), '5');
    fireEvent.changeText(getByTestId('servings-input'), '2');
    fireEvent.changeText(getByTestId('ingredient-name-0'), 'Ingredient');
    fireEvent.changeText(getByTestId('ingredient-amount-0'), '1');
    fireEvent.changeText(getByTestId('ingredient-unit-0'), 'unit');
    fireEvent.changeText(getByTestId('step-0'), 'Step description'); // > 5 chars

    // Select Difficulty
    fireEvent.press(getByTestId('difficulty-hard'));

    // Submit
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(saveRecipe).toHaveBeenCalled();
    });

    const calledWith = (saveRecipe as jest.Mock).mock.calls[0][0];
    expect(calledWith.difficulty).toBe('hard');
  });

  it('allows adding tags', async () => {
    const { getByText, getByLabelText } = renderWithProviders(<CreateRecipeScreen />);

    const tagInput = getByLabelText('Add Tag');

    fireEvent.changeText(tagInput, 'Vegetarian');
    fireEvent(tagInput, 'submitEditing');

    await waitFor(() => {
        expect(getByText('Vegetarian')).toBeTruthy();
    });
  });

  it('defaults to private and can be toggled to public', async () => {
    const { getByTestId, getByText } = renderWithProviders(<CreateRecipeScreen />);

    // Check default state (Private/False)
    const switchEl = getByTestId('is-public-switch');
    expect(getByText('Off')).toBeTruthy();

    // Fill in required fields
    fireEvent.changeText(getByTestId('recipe-name-input'), 'Public Test');
    fireEvent.changeText(getByTestId('description-input'), 'Valid description text here');
    fireEvent.changeText(getByTestId('prep-time-input'), '5');
    fireEvent.changeText(getByTestId('cook-time-input'), '5');
    fireEvent.changeText(getByTestId('servings-input'), '2');
    fireEvent.changeText(getByTestId('ingredient-name-0'), 'Ing');
    fireEvent.changeText(getByTestId('ingredient-amount-0'), '1');
    fireEvent.changeText(getByTestId('ingredient-unit-0'), 'u');
    fireEvent.changeText(getByTestId('step-0'), 'Step 1 description');

    // Submit (default)
    const saveButton = getByTestId('save-button');
    await act(async () => { fireEvent.press(saveButton); });

    await waitFor(() => {
        expect(saveRecipe).toHaveBeenCalledTimes(1);
        expect((saveRecipe as jest.Mock).mock.calls[0][0].isPublic).toBe(false);
    });

    (saveRecipe as jest.Mock).mockClear();

    // Toggle
    fireEvent.press(switchEl);
    expect(getByText('On')).toBeTruthy();

    await act(async () => { fireEvent.press(saveButton); });

    await waitFor(() => {
        expect(saveRecipe).toHaveBeenCalledTimes(1);
        expect((saveRecipe as jest.Mock).mock.calls[0][0].isPublic).toBe(true);
    });
  });

  it('toggles public switch when label is pressed', async () => {
    const { getByText } = renderWithProviders(<CreateRecipeScreen />);

    // Check default state (Private/False)
    expect(getByText('Off')).toBeTruthy();

    // Find the label text
    const label = getByText('Make Recipe Public');

    // Press the label
    fireEvent.press(label);

    // Expect switch to be On
    expect(getByText('On')).toBeTruthy();

    // Press again
    fireEvent.press(label);

    // Expect switch to be Off
    expect(getByText('Off')).toBeTruthy();
  });
});
