import { Category, CategoryInfo } from '../types'

// Category Information
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'appetizer',
    name: 'Appetizers',
    icon: '🥗',
    color: '#FF6B6B'
  },
  {
    id: 'soup',
    name: 'Soups',
    icon: '🍲',
    color: '#4ECDC4'
  },
  {
    id: 'salad',
    name: 'Salads',
    icon: '🥬',
    color: '#45B7D1'
  },
  {
    id: 'main-course',
    name: 'Main Courses',
    icon: '🍝',
    color: '#96CEB4'
  },
  {
    id: 'side-dish',
    name: 'Side Dishes',
    icon: '🍚',
    color: '#DDA0DD'
  },
  {
    id: 'dessert',
    name: 'Desserts',
    icon: '🍰',
    color: '#F7DC6F'
  },
  {
    id: 'drink',
    name: 'Drinks',
    icon: '🍹',
    color: '#85C1E9'
  },
  {
    id: 'snack',
    name: 'Snacks',
    icon: '🍪',
    color: '#F8B500'
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    icon: '🍳',
    color: '#FFB6C1'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '🍽️',
    color: '#D3D3D3'
  }
]

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', color: '#4CAF50', icon: '⭐' },
  { id: 'medium', name: 'Medium', color: '#FF9800', icon: '⭐⭐' },
  { id: 'hard', name: 'Hard', color: '#F44336', icon: '⭐⭐⭐' }
]

// Measurement Units
export const MEASUREMENT_UNITS = [
  { id: 'g', name: 'Gram', type: 'weight' },
  { id: 'kg', name: 'Kilogram', type: 'weight' },
  { id: 'ml', name: 'Milliliter', type: 'volume' },
  { id: 'l', name: 'Liter', type: 'volume' },
  { id: 'tl', name: 'Teaspoon', type: 'volume' },
  { id: 'el', name: 'Tablespoon', type: 'volume' },
  { id: 'tasse', name: 'Cup', type: 'volume' },
  { id: 'stück', name: 'Piece', type: 'count' },
  { id: 'prise', name: 'Pinch', type: 'count' },
  { id: 'bund', name: 'Bunch', type: 'count' },
  { id: 'scheibe', name: 'Slice', type: 'count' },
  { id: 'kopf', name: 'Head', type: 'count' },
  { id: 'zehe', name: 'Clove', type: 'count' }
]

// Ingredient Categories
export const INGREDIENT_CATEGORIES = [
  { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'meat', name: 'Meat', icon: '🥩' },
  { id: 'fish', name: 'Fish & Seafood', icon: '🐟' },
  { id: 'dairy', name: 'Dairy', icon: '🧀' },
  { id: 'grains', name: 'Grains & Starches', icon: '🌾' },
  { id: 'spices', name: 'Spices', icon: '🌶️' },
  { id: 'oils', name: 'Oils & Fats', icon: '🫒' },
  { id: 'nuts', name: 'Nuts & Seeds', icon: '🥜' },
  { id: 'herbs', name: 'Herbs', icon: '🌿' },
  { id: 'liquids', name: 'Liquids', icon: '💧' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'canned', name: 'Canned', icon: '🥫' },
  { id: 'frozen', name: 'Frozen', icon: '🧊' },
  { id: 'other', name: 'Other', icon: '📦' }
]

// Helper Functions
const CATEGORY_MAP = new Map<Category, CategoryInfo>(CATEGORIES.map(cat => [cat.id, cat]))

export const getCategoryById = (id: Category): CategoryInfo | undefined => {
  return CATEGORY_MAP.get(id)
}

export const getCategoryName = (id: Category): string => {
  const category = getCategoryById(id)
  return category?.name || id
}

export const getCategoryIcon = (id: Category): string => {
  const category = getCategoryById(id)
  return category?.icon || '🍽️'
}

export const getCategoryColor = (id: Category): string => {
  const category = getCategoryById(id)
  return category?.color || '#D3D3D3'
}

export const getUnitName = (unitId: string): string => {
  const unit = MEASUREMENT_UNITS.find(u => u.id === unitId)
  return unit?.name || unitId
}

export const getDifficultyName = (difficulty: string): string => {
  const diff = DIFFICULTY_LEVELS.find(d => d.id === difficulty)
  return diff?.name || difficulty
}

export const getDifficultyColor = (difficulty: string): string => {
  const diff = DIFFICULTY_LEVELS.find(d => d.id === difficulty)
  return diff?.color || '#D3D3D3'
}

// Recipe Tags
export const POPULAR_TAGS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'lactose-free',
  'low-carb',
  'high-protein',
  'quick',
  'easy',
  'healthy',
  'for kids',
  'Party',
  'Summer',
  'Winter',
  'Easter',
  'Christmas',
  'Halloween',
  'New Year'
]

// Recipe Templates
export const RECIPE_TEMPLATES = {
  QUICK: {
    name: 'Quick Meal',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    category: 'main-course'
  },
  FAMILY: {
    name: 'Family Meal',
    prepTime: 30,
    cookTime: 60,
    servings: 6,
    difficulty: 'medium',
    category: 'main-course'
  },
  DESSERT: {
    name: 'Sweet Dessert',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    category: 'dessert'
  },
  SALAD: {
    name: 'Refreshing Salad',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    category: 'salad'
  }
}
