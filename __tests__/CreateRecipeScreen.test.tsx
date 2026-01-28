import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import { saveRecipe } from '../services/localDataService';

// Mock the saveRecipe service
jest.mock('../services/localDataService', () => ({
  saveRecipe: jest.fn(),
}));

// Mock Alert
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
