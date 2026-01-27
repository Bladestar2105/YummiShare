import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Title, Paragraph, List, Divider, ActivityIndicator, Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getRecipeById } from '../services/localDataService';
import { Recipe } from '../types';
import { RootStackParamList } from '../types'; // Ensure this is defined

// Define the type for the route prop
type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen: React.FC = () => {
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const fetchedRecipe = await getRecipeById(recipeId);
        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error("Failed to fetch recipe details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  if (isLoading) {
    return <ActivityIndicator animating={true} size="large" style={styles.center} />;
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Title>Recipe Not Found</Title>
        <Paragraph>This recipe could not be found or may have been deleted.</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{recipe.name}</Title>
      <Paragraph style={styles.description}>{recipe.description}</Paragraph>

      <Divider style={styles.divider} />

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Paragraph style={styles.infoLabel}>Prep Time</Paragraph>
          <Title style={styles.infoValue}>{recipe.prepTime} min</Title>
        </View>
        <View style={styles.infoBox}>
          <Paragraph style={styles.infoLabel}>Cook Time</Paragraph>
          <Title style={styles.infoValue}>{recipe.cookTime} min</Title>
        </View>
        <View style={styles.infoBox}>
          <Paragraph style={styles.infoLabel}>Servings</Paragraph>
          <Title style={styles.infoValue}>{recipe.servings}</Title>
        </View>
      </View>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader style={styles.subheader}>Ingredients</List.Subheader>
        {recipe.ingredients.map((ingredient) => (
          <List.Item
            key={ingredient.id}
            title={`${ingredient.name}`}
            description={`${ingredient.amount} ${ingredient.unit}`}
            left={() => <List.Icon icon="food-variant" />}
          />
        ))}
      </List.Section>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader style={styles.subheader}>Instructions</List.Subheader>
        {recipe.steps.map((step, index) => (
          <List.Item
            key={index}
            title={step}
            titleNumberOfLines={5}
            left={() => <Text style={styles.stepNumber}>{index + 1}</Text>}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontSize: 18,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    marginHorizontal: 16,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  }
});

export default RecipeDetailScreen;
