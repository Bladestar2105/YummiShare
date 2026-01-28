import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, RecipeFormData } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getUserId } from './userService';


const RECIPES_KEY = 'recipes';

// Helper function to get all recipes
const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(RECIPES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch recipes.', e);
    return [];
  }
};

// Helper function to set all recipes
const setRecipes = async (recipes: Recipe[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(recipes);
    await AsyncStorage.setItem(RECIPES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save recipes.', e);
  }
};

// --- Public API ---

/**
 * Saves a new recipe to local storage.
 * @param formData The recipe data from the form.
 * @returns The newly created recipe object.
 */
export const saveRecipe = async (formData: RecipeFormData): Promise<Recipe> => {
  const allRecipes = await getRecipes();

  const ingredientsWithIds = formData.ingredients.map(ingredient => ({
    ...ingredient,
    id: uuidv4(),
  }));

  const newRecipe: Recipe = {
    ...formData,
    id: uuidv4(),
    ingredients: ingredientsWithIds,
    totalTime: formData.prepTime + formData.cookTime,
    isFavorite: false,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: await getUserId(),
    defaultServings: formData.servings,
  };

  allRecipes.push(newRecipe);
  await setRecipes(allRecipes);

  return newRecipe;
};

/**
 * Retrieves a single recipe by its ID.
 * @param id The ID of the recipe to retrieve.
 * @returns The recipe object or null if not found.
 */
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const allRecipes = await getRecipes();
  const recipe = allRecipes.find(r => r.id === id);
  return recipe || null;
};

/**
 * Retrieves all saved recipes.
 * @returns An array of all recipe objects.
 */
export const getAllRecipes = async (): Promise<Recipe[]> => {
  return await getRecipes();
};

/**
 * Updates an existing recipe.
 * @param id The ID of the recipe to update.
 * @param formData The updated recipe data.
 * @returns The updated recipe object.
 */
export const updateRecipe = async (id: string, formData: Partial<RecipeFormData>): Promise<Recipe | null> => {
    const allRecipes = await getRecipes();
    const recipeIndex = allRecipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        console.error('Recipe not found for update.');
        return null;
    }

    const originalRecipe = allRecipes[recipeIndex];
    const updatedRecipe: Recipe = {
        ...originalRecipe,
        ...formData,
        ingredients: formData.ingredients
            ? formData.ingredients.map(ing => ({ ...ing, id: uuidv4() }))
            : originalRecipe.ingredients,
        updatedAt: new Date(),
    };

    // Recalculate total time if prep or cook time changed
    if (formData.prepTime !== undefined || formData.cookTime !== undefined) {
        updatedRecipe.totalTime = (formData.prepTime || originalRecipe.prepTime) + (formData.cookTime || originalRecipe.cookTime);
    }

    allRecipes[recipeIndex] = updatedRecipe;
    await setRecipes(allRecipes);

    return updatedRecipe;
};

/**
 * Deletes a recipe by its ID.
 * @param id The ID of the recipe to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteRecipe = async (id: string): Promise<boolean> => {
    const allRecipes = await getRecipes();
    const filteredRecipes = allRecipes.filter(r => r.id !== id);

    if (allRecipes.length === filteredRecipes.length) {
        console.error('Recipe not found for deletion.');
        return false;
    }

    await setRecipes(filteredRecipes);
    return true;
};
