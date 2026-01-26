import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RecipesScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Recipes will be listed here.</Text>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateRecipe')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RecipesScreen;
