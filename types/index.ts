// User Types
export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
}

// Recipe Types
export interface Recipe {
  id: string
  name: string
  description: string
  category: Category
  images: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  totalTime: number // in minutes (calculated)
  servings: number
  defaultServings: number // for scaling calculation
  difficulty: Difficulty
  ingredients: Ingredient[]
  steps: string[]
  tags: string[]
  nutrition?: Nutrition
  isFavorite: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
  userId: string
  userName?: string
  userPhotoURL?: string
  isPublic: boolean
}

export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  category?: string // e.g., vegetables, dairy, meat
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
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
  | 'other'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface CategoryInfo {
  id: Category
  name: string
  icon: string
  color: string
}

// Search Types
export interface SearchFilters {
  query?: string
  category?: Category
  difficulty?: Difficulty
  maxPrepTime?: number
  maxCookTime?: number
  ingredients?: string[]
  tags?: string[]
  rating?: number
}

export interface SearchResult {
  recipes: Recipe[]
  totalCount: number
  hasMore: boolean
  lastVisible?: any // Firestore document snapshot
}

// Shopping List Types
export interface ShoppingItem {
  id: string
  name: string
  amount: number
  unit: string
  checked: boolean
  recipeId?: string
  recipeName?: string
  createdAt: Date
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Recipe Form Types
export interface RecipeFormData {
  name: string
  description: string
  category: Category
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  ingredients: Ingredient[]
  steps: string[]
  tags: string[]
  isPublic: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination Types
export interface PaginationParams {
  limit?: number
  startAfter?: any
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  RecipeDetail: { recipeId: string }
  CreateRecipe: undefined
  EditRecipe: { recipeId: string }
  Search: undefined
  IngredientSearch: { ingredient: string }
  Profile: undefined
  Settings: undefined
  ShoppingList: undefined
}

export type MainTabParamList = {
  Home: undefined
  Search: undefined
  Favorites: undefined
  Add: undefined
  Profile: undefined
}

// Share Types
export interface ShareContent {
  title: string
  message: string
  url?: string
}

// Favorites Types
export interface FavoriteRecipe {
  recipeId: string
  userId: string
  createdAt: Date
}

// Rating Types
export interface Rating {
  recipeId: string
  userId: string
  rating: number
  comment?: string
  createdAt: Date
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'recipe_liked' | 'comment' | 'follow' | 'recipe_shared'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

// App State Types
export interface AppState {
  user: User | null
  recipes: Recipe[]
  favorites: string[]
  shoppingLists: ShoppingList[]
  isLoading: boolean
  error: string | null
}

// Settings Types
export interface AppSettings {
  darkMode: boolean
  notifications: boolean
  language: 'de' | 'en'
  unitSystem: 'metric' | 'imperial'
  offlineMode: boolean
}