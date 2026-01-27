// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: Category;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes (calculated)
  servings: number;
  defaultServings: number; // for scaling calculation
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  isFavorite: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

// Category Types
export type Category =
  | 'appetizer'
  | 'soup'
  | 'salad'
  | 'main-course'
  | 'side-dish'
  | 'dessert'
  | 'drink'
  | 'snack'
  | 'breakfast'
  | 'other';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

// Recipe Form Types
export interface RecipeFormData {
  name: string;
  description: string;
  category: Category;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Difficulty;
  ingredients: Omit<Ingredient, 'id'>[];
  steps: string[];
  tags: string[];
  isPublic: boolean;
}


// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Recipes: undefined;
  Favorites: undefined;
  Profile: undefined;
  RecipeDetail: { recipeId: string };
  CreateRecipe: undefined;
  Search: undefined;
};
