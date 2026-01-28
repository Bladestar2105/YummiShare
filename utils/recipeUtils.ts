import { Recipe, Ingredient } from '../types'
import { DEFAULT_RECIPE_VALUES } from '../config/appConfig'

/**
 * Calculate total time (prep + cook)
 */
export const calculateTotalTime = (prepTime: number, cookTime: number): number => {
  return prepTime + cookTime
}

/**
 * Scale ingredients based on servings
 */
export const scaleIngredients = (
  ingredients: Ingredient[],
  targetServings: number,
  defaultServings: number = DEFAULT_RECIPE_VALUES.DEFAULT_SERVINGS
): Ingredient[] => {
  if (defaultServings === 0) return ingredients
  
  const scaleFactor = targetServings / defaultServings
  
  return ingredients.map(ingredient => ({
    ...ingredient,
    amount: roundToDecimals(ingredient.amount * scaleFactor, 2)
  }))
}

/**
 * Round to specified decimal places
 */
export const roundToDecimals = (num: number, decimals: number): number => {
  return Number(Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals))
}

/**
 * Format time duration to human-readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} Min.`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} Std.`
  }
  
  return `${hours} Std. ${remainingMinutes} Min.`
}

/**
 * Generate recipe share text
 */
export const generateRecipeShareText = (recipe: Recipe): string => {
  const totalTime = recipe.prepTime + recipe.cookTime

  const parts: string[] = [
    `🍽️ ${recipe.name}`,
    '',
    recipe.description,
    '',
    `⏱️ Zubereitung: ${formatDuration(recipe.totalTime)}`,
    `👥 Portionen: ${recipe.servings}`
  ]

  if (recipe.ingredients.length > 0) {
    parts.push('', '📝 Zutaten:')
    for (const ing of recipe.ingredients) {
      parts.push(`• ${ing.amount} ${ing.unit} ${ing.name}`)
    }
  }

  if (recipe.steps.length > 0) {
    parts.push('', '👨‍🍳 Zubereitung:')
    for (let i = 0; i < recipe.steps.length; i++) {
      parts.push(`${i + 1}. ${recipe.steps[i]}`)
    }
  }

  parts.push('', 'Guten Appetit! 🍴')

  return parts.join('\n')
}

/**
 * Helper to escape special characters in regex
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Search recipes by ingredients
 */
export const searchByIngredients = (
  recipes: Recipe[],
  searchIngredients: string[]
): Recipe[] => {
  if (searchIngredients.length === 0) return recipes
  
  // Create regex patterns for each search ingredient once
  // This avoids creating new strings via toLowerCase() inside the loop
  const searchPatterns = searchIngredients.map(ing =>
    new RegExp(escapeRegExp(ing.trim()), 'i')
  )
  
  return recipes.filter(recipe => {
    // Check if all search ingredients are in the recipe
    // Use loops to avoid closure creation overhead for every recipe/pattern combination
    for (let i = 0; i < searchPatterns.length; i++) {
      const pattern = searchPatterns[i]
      let found = false
      for (let j = 0; j < recipe.ingredients.length; j++) {
        if (pattern.test(recipe.ingredients[j].name)) {
          found = true
          break
        }
      }
      if (!found) return false
    }
    return true
  })
}

/**
 * Search recipes by name
 */
export const searchByName = (
  recipes: Recipe[],
  query: string
): Recipe[] => {
  if (!query.trim()) return recipes
  
  const lowerQuery = query.toLowerCase().trim()
  
  return recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Filter recipes by category
 */
export const filterByCategory = (
  recipes: Recipe[],
  category: string
): Recipe[] => {
  if (!category || category === 'all') return recipes
  
  return recipes.filter(recipe => recipe.category === category)
}

/**
 * Filter recipes by difficulty
 */
export const filterByDifficulty = (
  recipes: Recipe[],
  difficulty: string
): Recipe[] => {
  if (!difficulty || difficulty === 'all') return recipes
  
  return recipes.filter(recipe => recipe.difficulty === difficulty)
}

/**
 * Filter recipes by max prep time
 */
export const filterByMaxTime = (
  recipes: Recipe[],
  maxMinutes: number
): Recipe[] => {
  if (!maxMinutes) return recipes
  
  return recipes.filter(recipe => {
    return recipe.totalTime <= maxMinutes
  })
}

/**
 * Sort recipes
 */
export const sortRecipes = (
  recipes: Recipe[],
  sortBy: 'newest' | 'oldest' | 'rating' | 'name' | 'quick'
): Recipe[] => {
  const sorted = [...recipes]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'quick':
      return sorted.sort((a, b) => 
        // Optimization: Use pre-calculated totalTime
        // Replaced dynamic calculation (prepTime + cookTime) with property access
        a.totalTime - b.totalTime
      )
    
    default:
      return sorted
  }
}

/**
 * Calculate recipe rating statistics
 */
export const calculateRatingStats = (ratings: number[]) => {
  if (ratings.length === 0) {
    return { average: 0, count: 0, distribution: {} }
  }
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  const average = sum / ratings.length
  const count = ratings.length
  
  // Calculate distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  ratings.forEach(rating => {
    distribution[rating as keyof typeof distribution]++
  })
  
  return { average: roundToDecimals(average, 1), count, distribution }
}

/**
 * Validate recipe form data
 */
export const validateRecipe = (recipe: Partial<Recipe>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!recipe.name || recipe.name.trim().length < 2) {
    errors.push('Name muss mindestens 2 Zeichen lang sein')
  }
  
  if (!recipe.description || recipe.description.trim().length < 10) {
    errors.push('Beschreibung muss mindestens 10 Zeichen lang sein')
  }
  
  if (!recipe.category) {
    errors.push('Kategorie ist erforderlich')
  }
  
  if (!recipe.prepTime || recipe.prepTime < 0) {
    errors.push('Vorbereitungszeit muss eine positive Zahl sein')
  }
  
  if (!recipe.cookTime || recipe.cookTime < 0) {
    errors.push('Kochzeit muss eine positive Zahl sein')
  }
  
  if (!recipe.servings || recipe.servings < 1) {
    errors.push('Anzahl Portionen muss mindestens 1 sein')
  }
  
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('Mindestens eine Zutat ist erforderlich')
  }
  
  if (!recipe.steps || recipe.steps.length === 0) {
    errors.push('Mindestens ein Zubereitungsschritt ist erforderlich')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Extract ingredients from text
 */
export const extractIngredientsFromText = (text: string): Ingredient[] => {
  const lines = text.split('\n').filter(line => line.trim())
  
  return lines.map((line, index) => {
    // Try to parse ingredient pattern: "amount unit name"
    const match = line.match(/^(\d+\.?\d*)\s*(\w+)?\s*(.+)$/)
    
    if (match) {
      return {
        id: `ing_${Date.now()}_${index}`,
        name: match[3]?.trim() || line,
        amount: parseFloat(match[1]) || 0,
        unit: match[2]?.trim() || ''
      }
    }
    
    return {
      id: `ing_${Date.now()}_${index}`,
      name: line,
      amount: 0,
      unit: ''
    }
  })
}

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}