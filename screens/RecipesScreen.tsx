import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllRecipes, getDataVersion } from '../services/localDataService';
import { Recipe, RootStackParamList } from '../types';
import RecipeItem from '../components/RecipeItem';

const ListEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No recipes yet.</Text>
    <Text style={styles.emptySubtext}>Tap the '+' button to create your first one!</Text>
  </View>
);

const renderRecipe = ({ item }: { item: Recipe }) => <RecipeItem item={item} />;

const keyExtractor = (item: Recipe) => item.id;

const RecipesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastVersionRef = useRef(-1);

  // useFocusEffect runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const currentVersion = getDataVersion();

      // If the data hasn't changed since the last fetch, skip updating state
      // to avoid unnecessary async calls and re-renders.
      if (currentVersion === lastVersionRef.current) {
        return;
      }

      const fetchRecipes = async () => {
        try {
          // Only show loader on the very first load
          if (lastVersionRef.current === -1) {
            setIsLoading(true);
          }
          const storedRecipes = await getAllRecipes();
          setRecipes(storedRecipes);
          lastVersionRef.current = currentVersion;
        } catch (error) {
          console.error("Failed to load recipes:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecipes();

      return () => {};
    }, []) // Empty dependencies to prevent re-running when 'recipes' state updates
  );

  const handleCreateRecipe = useCallback(() => {
    navigation.navigate('CreateRecipe');
  }, [navigation]);

  if (isLoading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmptyComponent}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateRecipe}
        accessibilityLabel="create-recipe-fab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150, // Adjust as needed
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RecipesScreen;
