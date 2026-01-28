import React from 'react';
import { render } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { Provider as PaperProvider } from 'react-native-paper';

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
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import * as localDataService from '../services/localDataService';

// Mock the service
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { saveRecipe } from '../services/localDataService';

// Mock the saveRecipe service
jest.mock('../services/localDataService', () => ({
  saveRecipe: jest.fn(),
}));

// Mock react-native-paper to avoid SafeAreaContext issues
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Actual = jest.requireActual('react-native-paper');
  return {
    ...Actual,
    Provider: ({ children }) => children,
    Switch: (props) => <View testID={props.testID}><Text>Switch: {props.value ? 'On' : 'Off'}</Text></View>,
  };
});

describe('CreateRecipeScreen', () => {
  it('renders "Make Recipe Public" switch', () => {
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

    const { getByText, getByLabelText } = renderWithProviders(<CreateRecipeScreen />);

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
// Mock Alert
jest.spyOn(require('react-native').Alert, 'alert');

describe('CreateRecipeScreen', () => {
  it('renders difficulty selection and submits correctly', async () => {
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <CreateRecipeScreen />
      </PaperProvider>
    );

    expect(getByText('Make Recipe Public')).toBeTruthy();
    expect(getByTestId('is-public-switch')).toBeTruthy();
    // Check if SegmentedButtons labels exist
    expect(getByText('Easy')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Hard')).toBeTruthy();

    // Verify testIDs exist
    expect(getByTestId('difficulty-easy')).toBeTruthy();
    expect(getByTestId('difficulty-medium')).toBeTruthy();
    expect(getByTestId('difficulty-hard')).toBeTruthy();

    // Fill required fields
    fireEvent.changeText(getByTestId('recipe-name-input'), 'Test Recipe');
    fireEvent.changeText(getByTestId('description-input'), 'This is a test recipe description');

    // Fill numeric fields
    fireEvent.changeText(getByTestId('prep-time-input'), '10');
    fireEvent.changeText(getByTestId('cook-time-input'), '20');
    fireEvent.changeText(getByTestId('servings-input'), '4');

    // Fill Ingredient (default one)
    fireEvent.changeText(getByTestId('ingredient-name-0'), 'Salt');
    fireEvent.changeText(getByTestId('ingredient-amount-0'), '1');
    fireEvent.changeText(getByTestId('ingredient-unit-0'), 'tsp');

    // Fill Step (default one)
    fireEvent.changeText(getByTestId('step-0'), 'Mix everything together.');

    // Select Difficulty 'Hard' using testID
    fireEvent.press(getByTestId('difficulty-hard'));

    // Submit
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(localDataService.saveRecipe).toHaveBeenCalled();
    });

    const calledWith = (localDataService.saveRecipe as jest.Mock).mock.calls[0][0];
    expect(calledWith.difficulty).toBe('hard');
    expect(calledWith.name).toBe('Test Recipe');
jest.spyOn(Alert, 'alert');

describe('CreateRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows adding tags and submitting the form', async () => {
    const { getByText, getAllByTestId } = render(<CreateRecipeScreen />);

    const inputs = getAllByTestId('text-input-outlined');
    // Order:
    // 0: Name
    // 1: Description
    // 2: Prep Time
    // 3: Cook Time
    // 4: Servings
    // 5: Ingredient Amount
    // 6: Ingredient Unit
    // 7: Ingredient Name
    // 8: Step 1
    // 9: Add Tag

    // Fill in required fields
    fireEvent.changeText(inputs[0], 'Test Recipe');
    fireEvent.changeText(inputs[1], 'This is a test recipe description');
    fireEvent.changeText(inputs[2], '10');
    fireEvent.changeText(inputs[3], '20');
    fireEvent.changeText(inputs[4], '4');

    // Fill in Ingredient
    fireEvent.changeText(inputs[5], '100');
    fireEvent.changeText(inputs[6], 'g');
    fireEvent.changeText(inputs[7], 'Flour');

    // Fill in Step
    fireEvent.changeText(inputs[8], 'Mix everything together.');

    // Add a Tag
    const tagInput = inputs[9];
    fireEvent.changeText(tagInput, 'Vegetarian');
    fireEvent(tagInput, 'submitEditing'); // Simulate pressing Enter/Submit on keyboard

    // Verify tag is displayed
    await waitFor(() => {
        expect(getByText('Vegetarian')).toBeTruthy();
    });

    // Add another tag
    fireEvent.changeText(tagInput, 'Healthy');
    fireEvent(tagInput, 'submitEditing');

    await waitFor(() => {
        expect(getByText('Healthy')).toBeTruthy();
    });

    // Submit the form
    const saveButton = getByText('Save Recipe');
    fireEvent.press(saveButton);

    // Verify saveRecipe was called with correct data
    await waitFor(() => {
      expect(saveRecipe).toHaveBeenCalledTimes(1);
      const calledArg = (saveRecipe as jest.Mock).mock.calls[0][0];
      expect(calledArg).toEqual(expect.objectContaining({
        name: 'Test Recipe',
        description: 'This is a test recipe description',
        tags: ['Vegetarian', 'Healthy'],
      }));
    });
  });
});
