import { Category, CategoryInfo } from '../types'

// Category Information
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'appetizer',
    name: 'Vorspeisen',
    icon: '🥗',
    color: '#FF6B6B'
  },
  {
    id: 'soup',
    name: 'Suppen',
    icon: '🍲',
    color: '#4ECDC4'
  },
  {
    id: 'salad',
    name: 'Salate',
    icon: '🥬',
    color: '#45B7D1'
  },
  {
    id: 'main-course',
    name: 'Hauptgerichte',
    icon: '🍝',
    color: '#96CEB4'
  },
  {
    id: 'side-dish',
    name: 'Beilagen',
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
    name: 'Getränke',
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
    name: 'Frühstück',
    icon: '🍳',
    color: '#FFB6C1'
  },
  {
    id: 'other',
    name: 'Sonstiges',
    icon: '🍽️',
    color: '#D3D3D3'
  }
]

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Einfach', color: '#4CAF50', icon: '⭐' },
  { id: 'medium', name: 'Mittel', color: '#FF9800', icon: '⭐⭐' },
  { id: 'hard', name: 'Schwer', color: '#F44336', icon: '⭐⭐⭐' }
]

// Measurement Units
export const MEASUREMENT_UNITS = [
  { id: 'g', name: 'Gramm', type: 'weight' },
  { id: 'kg', name: 'Kilogramm', type: 'weight' },
  { id: 'ml', name: 'Milliliter', type: 'volume' },
  { id: 'l', name: 'Liter', type: 'volume' },
  { id: 'tl', name: 'Teelöffel', type: 'volume' },
  { id: 'el', name: 'Esslöffel', type: 'volume' },
  { id: 'tasse', name: 'Tasse', type: 'volume' },
  { id: 'stück', name: 'Stück', type: 'count' },
  { id: 'prise', name: 'Prise', type: 'count' },
  { id: 'bund', name: 'Bund', type: 'count' },
  { id: 'scheibe', name: 'Scheibe', type: 'count' },
  { id: 'kopf', name: 'Kopf', type: 'count' },
  { id: 'zehe', name: 'Zehe', type: 'count' }
]

// Ingredient Categories
export const INGREDIENT_CATEGORIES = [
  { id: 'vegetables', name: 'Gemüse', icon: '🥕' },
  { id: 'fruits', name: 'Obst', icon: '🍎' },
  { id: 'meat', name: 'Fleisch', icon: '🥩' },
  { id: 'fish', name: 'Fisch & Meeresfrüchte', icon: '🐟' },
  { id: 'dairy', name: 'Milchprodukte', icon: '🧀' },
  { id: 'grains', name: 'Getreide & Stärke', icon: '🌾' },
  { id: 'spices', name: 'Gewürze', icon: '🌶️' },
  { id: 'oils', name: 'Öle & Fette', icon: '🫒' },
  { id: 'nuts', name: 'Nüsse & Saaten', icon: '🥜' },
  { id: 'herbs', name: 'Kräuter', icon: '🌿' },
  { id: 'liquids', name: 'Flüssigkeiten', icon: '💧' },
  { id: 'bakery', name: 'Backwaren', icon: '🍞' },
  { id: 'canned', name: 'Konserven', icon: '🥫' },
  { id: 'frozen', name: 'Tiefkühl', icon: '🧊' },
  { id: 'other', name: 'Sonstiges', icon: '📦' }
]

// Helper Functions
export const getCategoryById = (id: Category): CategoryInfo | undefined => {
  return CATEGORIES.find(cat => cat.id === id)
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
  'vegetarisch',
  'vegan',
  'glutenfrei',
  'laktosefrei',
  'low-carb',
  'proteinreich',
  'schnell',
  'einfach',
  'gesund',
  'für Kinder',
  'Party',
  'Sommer',
  'Winter',
  'Ostern',
  'Weihnachten',
  'Halloween',
  'Silvester'
]

// Recipe Templates
export const RECIPE_TEMPLATES = {
  QUICK: {
    name: 'Schnelles Gericht',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    category: 'main-course'
  },
  FAMILY: {
    name: 'Familienessen',
    prepTime: 30,
    cookTime: 60,
    servings: 6,
    difficulty: 'medium',
    category: 'main-course'
  },
  DESSERT: {
    name: 'Süßer Nachtisch',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    category: 'dessert'
  },
  SALAD: {
    name: 'Erfrischender Salat',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    category: 'salad'
  }
}