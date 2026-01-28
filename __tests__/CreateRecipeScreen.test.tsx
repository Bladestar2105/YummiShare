import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import * as localDataService from '../services/localDataService';

// Mock the service
jest.mock('../services/localDataService', () => ({
  saveRecipe: jest.fn(),
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

    // Check if SegmentedButtons labels exist
    expect(getByText('Easy')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Hard')).toBeTruthy();

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

    // Select Difficulty 'Hard'
    fireEvent.press(getByText('Hard'));

    // Submit
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(localDataService.saveRecipe).toHaveBeenCalled();
    });

    const calledWith = (localDataService.saveRecipe as jest.Mock).mock.calls[0][0];
    expect(calledWith.difficulty).toBe('hard');
    expect(calledWith.name).toBe('Test Recipe');
  });
});
