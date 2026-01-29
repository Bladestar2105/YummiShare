import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRecipes } from '../services/localDataService';
import { getRecipeSuggestions } from '../utils/recipeUtils';
import { Recipe } from '../types';
import RecipeItem from '../components/RecipeItem';
import { Title, ActivityIndicator, Button } from 'react-native-paper';

const HomeScreen: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const allRecipes = await getAllRecipes();
      const newSuggestions = getRecipeSuggestions(allRecipes, 3);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSuggestions();
    }, [loadSuggestions])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.header}>Daily Suggestions 🍽️</Title>
        <Text style={styles.subheader}>
          Check out these delicious recipes for today!
        </Text>

        {isLoading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : suggestions.length > 0 ? (
          <View>
            {suggestions.map((recipe) => (
              <RecipeItem key={recipe.id} item={recipe} />
            ))}
            <Button
              mode="outlined"
              onPress={loadSuggestions}
              style={styles.refreshButton}
            >
              Get New Suggestions
            </Button>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes available yet.</Text>
            <Text style={styles.emptySubtext}>
              Add some recipes to get suggestions!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  refreshButton: {
    marginTop: 16,
    marginHorizontal: 8,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
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
});

export default HomeScreen;
