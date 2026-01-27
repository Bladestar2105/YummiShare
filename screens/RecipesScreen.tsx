import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Title, Paragraph, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllRecipes } from '../services/localDataService';
import { Recipe } from '../types';

const RecipesScreen: React.FC = () => {
  const navigation = useNavigation();
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

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <Card style={styles.card} onPress={() => console.log("Navigate to", item.id)}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No recipes yet.</Text>
      <Text style={styles.emptySubtext}>Tap the '+' button to create your first one!</Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmptyComponent}
      />
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
