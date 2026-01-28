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
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <CreateRecipeScreen />
      </PaperProvider>
    );

    expect(getByText('Make Recipe Public')).toBeTruthy();
    expect(getByTestId('is-public-switch')).toBeTruthy();
  });
});
