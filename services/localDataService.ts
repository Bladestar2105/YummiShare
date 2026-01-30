import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, RecipeFormData, Ingredient } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getUserId } from './userService';


const RECIPES_KEY = 'recipes';
const RECIPE_PREFIX = 'recipe_';

interface StoredRecipe extends Omit<Recipe, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

let cachedRecipes: Recipe[] | null = null;

// Helper to parse dates
const parseDates = (recipe: StoredRecipe): Recipe => ({
  ...recipe,
  createdAt: new Date(recipe.createdAt),
  updatedAt: new Date(recipe.updatedAt),
});

// Helper function to get all recipes
const getRecipes = async (): Promise<Recipe[]> => {
  // Optimization: Return cached recipes if available to avoid expensive JSON parsing
  if (cachedRecipes) {
    return cachedRecipes;
  }

  try {
    // 1. Check legacy key for migration
    const legacyJson = await AsyncStorage.getItem(RECIPES_KEY);
    if (legacyJson) {
        console.log('Migrating legacy recipes...');
        const parsed = JSON.parse(legacyJson);
        const recipes = (Array.isArray(parsed) ? parsed : []) as StoredRecipe[];

        // Save individually
        const pairs: [string, string][] = recipes.map(r => [RECIPE_PREFIX + r.id, JSON.stringify(r)]);
        if (pairs.length > 0) {
            await AsyncStorage.multiSet(pairs);
        }
        await AsyncStorage.removeItem(RECIPES_KEY);

        cachedRecipes = recipes.map(parseDates);
        return cachedRecipes!;
    }

    // 2. Load individual keys
    const keys = await AsyncStorage.getAllKeys();
    const recipeKeys = keys.filter(k => k.startsWith(RECIPE_PREFIX));

    if (recipeKeys.length === 0) {
        cachedRecipes = [];
        return cachedRecipes;
    }

    const pairs = await AsyncStorage.multiGet(recipeKeys);
    const recipes = pairs
        .map(([_, value]) => value ? JSON.parse(value) : null)
        .filter((r): r is StoredRecipe => r !== null);

    cachedRecipes = recipes.map(parseDates);
    return cachedRecipes!;
  } catch (e) {
    console.error('Failed to fetch recipes.', e);
    return [];
  }
};

// Helper function to set all recipes (used by seedRecipes)
const setRecipes = async (recipes: Recipe[]): Promise<void> => {
  cachedRecipes = recipes;
  try {
    // Clear old data first to avoid duplicates or stale data.
    const allKeys = await AsyncStorage.getAllKeys();
    const recipeKeys = allKeys.filter(k => k.startsWith(RECIPE_PREFIX));
    if (recipeKeys.length > 0) {
        await AsyncStorage.multiRemove(recipeKeys);
    }
    // Also remove legacy key just in case
    await AsyncStorage.removeItem(RECIPES_KEY);

    const pairs: [string, string][] = recipes.map(r => [RECIPE_PREFIX + r.id, JSON.stringify(r)]);
    if (pairs.length > 0) {
        await AsyncStorage.multiSet(pairs);
    }
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
  // Ensure cache is populated
  if (!cachedRecipes) {
      await getRecipes();
  }

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
    // Ensure persistent user ID is used
    userId: await getUserId(),
    defaultServings: formData.servings,
  };

  cachedRecipes!.push(newRecipe);

  // Optimized save: save only the new recipe
  try {
      await AsyncStorage.setItem(RECIPE_PREFIX + newRecipe.id, JSON.stringify(newRecipe));
  } catch (e) {
      console.error('Failed to save recipe individually.', e);
  }

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
    // Ensure cache is populated
    if (!cachedRecipes) {
        await getRecipes();
    }

    const recipeIndex = cachedRecipes!.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        console.error('Recipe not found for update.');
        return null;
    }

    const originalRecipe = cachedRecipes![recipeIndex];

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

    cachedRecipes![recipeIndex] = updatedRecipe;

    // Optimized save
    try {
        await AsyncStorage.setItem(RECIPE_PREFIX + updatedRecipe.id, JSON.stringify(updatedRecipe));
    } catch (e) {
        console.error('Failed to update recipe individually.', e);
    }

    return updatedRecipe;
};

/**
 * Deletes a recipe by its ID.
 * @param id The ID of the recipe to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteRecipe = async (id: string): Promise<boolean> => {
    // Ensure cache is populated
    if (!cachedRecipes) {
        await getRecipes();
    }

    const recipeIndex = cachedRecipes!.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        console.error('Recipe not found for deletion.');
        return false;
    }

    cachedRecipes!.splice(recipeIndex, 1);

    try {
        await AsyncStorage.removeItem(RECIPE_PREFIX + id);
    } catch (e) {
        console.error('Failed to delete recipe individually.', e);
        return false;
    }
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
