import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, RecipeFormData, Ingredient } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getUserId } from './userService';


const RECIPES_KEY = 'recipes';

let cachedRecipes: Recipe[] | null = null;

// Helper function to get all recipes
const getRecipes = async (): Promise<Recipe[]> => {
  if (cachedRecipes) {
    return cachedRecipes;
  }

  try {
    const jsonValue = await AsyncStorage.getItem(RECIPES_KEY);

    // Check again if cache was populated while we were waiting
    if (cachedRecipes) {
      return cachedRecipes;
    }

    const recipes = jsonValue != null ? JSON.parse(jsonValue) : [];
    cachedRecipes = recipes.map((recipe: any) => ({
      ...recipe,
      createdAt: new Date(recipe.createdAt),
      updatedAt: new Date(recipe.updatedAt),
    }));
    return cachedRecipes!;
  } catch (e) {
    console.error('Failed to fetch recipes.', e);
    return [];
  }
};

// Helper function to set all recipes
const setRecipes = async (recipes: Recipe[]): Promise<void> => {
  cachedRecipes = recipes;
  try {
    const jsonValue = JSON.stringify(recipes);
    await AsyncStorage.setItem(RECIPES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save recipes.', e);
  }
};

export const resetCache = () => {
  cachedRecipes = null;
};

// --- Public API ---

/**
 * Saves a new recipe to local storage.
 * @param formData The recipe data from the form.
 * @returns The newly created recipe object.
 */
export const saveRecipe = async (formData: RecipeFormData): Promise<Recipe> => {
  const allRecipes = await getRecipes();

  const ingredientsWithIds: Ingredient[] = formData.ingredients.map(ingredient => ({
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

    let ingredients = originalRecipe.ingredients;
    if (formData.ingredients) {
        ingredients = formData.ingredients.map(ingredient => ({
            ...ingredient,
            id: uuidv4(),
        }));
    }

    const updatedRecipe: Recipe = {
        ...originalRecipe,
        ...formData,
        ingredients,
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

/**
 * Seeds the database with a list of recipes.
 * WARNING: This overwrites all existing recipes!
 * @param recipes The list of recipes to save.
 */
export const seedRecipes = async (recipes: Recipe[]): Promise<void> => {
  await setRecipes(recipes);
};
