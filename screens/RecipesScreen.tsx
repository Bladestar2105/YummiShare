import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Title, Paragraph, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllRecipes } from '../services/localDataService';
import { Recipe, RootStackParamList } from '../types';

const ListEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No recipes yet.</Text>
    <Text style={styles.emptySubtext}>Tap the '+' button to create your first one!</Text>
  </View>
);

const RecipeItem = React.memo(({ item }: { item: Recipe }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = useCallback(() => {
    navigation.navigate('RecipeDetail', { recipeId: item.id });
  }, [navigation, item.id]);

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );
});

const renderRecipe = ({ item }: { item: Recipe }) => <RecipeItem item={item} />;

const keyExtractor = (item: Recipe) => item.id;

const RecipesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchRecipes = async () => {
        try {
          setIsLoading(true);
          const storedRecipes = await getAllRecipes();
          setRecipes(storedRecipes);
        } catch (error) {
          console.error("Failed to load recipes:", error);
          // Optionally, show an error message to the user
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecipes();

      // Return a cleanup function if needed, not necessary here
      return () => {};
    }, [])
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
  card: {
    marginVertical: 8,
    marginHorizontal: 8,
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
