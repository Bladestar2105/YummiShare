
import { Recipe, Ingredient } from '../types';
import { performance } from 'perf_hooks';

// Mock escapeRegExp locally as it is not exported
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. Naive Implementation (from task description)
const searchNaive = (recipes: Recipe[], searchIngredients: string[]): Recipe[] => {
  if (searchIngredients.length === 0) return recipes;

  const lowerSearchIngredients = searchIngredients.map(ing => ing.toLowerCase());

  return recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing =>
      ing.name.toLowerCase()
    );

    return lowerSearchIngredients.every(searchIng =>
      recipeIngredients.some(recipeIng =>
        recipeIng.includes(searchIng)
      )
    );
  });
}

// 2. Current Implementation (Regex)
const searchRegex = (recipes: Recipe[], searchIngredients: string[]): Recipe[] => {
  if (searchIngredients.length === 0) return recipes;

  const searchPatterns = searchIngredients.map(ing =>
    new RegExp(escapeRegExp(ing.trim()), 'i')
  );

  return recipes.filter(recipe => {
    return searchPatterns.every(pattern =>
      recipe.ingredients.some(recipeIng =>
        pattern.test(recipeIng.name)
      )
    );
  });
}

// 3. Direct String Implementation (No intermediate array, on-the-fly toLowerCase)
const searchDirect = (recipes: Recipe[], searchIngredients: string[]): Recipe[] => {
  if (searchIngredients.length === 0) return recipes;

  const lowerSearchIngredients = searchIngredients.map(ing => ing.trim().toLowerCase());

  return recipes.filter(recipe => {
    return lowerSearchIngredients.every(searchIng =>
      recipe.ingredients.some(recipeIng =>
        recipeIng.name.toLowerCase().includes(searchIng)
      )
    );
  });
}

// 4. Regex with For Loop (Avoid .every/.some closure overhead)
const searchRegexLoop = (recipes: Recipe[], searchIngredients: string[]): Recipe[] => {
  if (searchIngredients.length === 0) return recipes;

  const searchPatterns = searchIngredients.map(ing =>
    new RegExp(escapeRegExp(ing.trim()), 'i')
  );

  return recipes.filter(recipe => {
    for (let i = 0; i < searchPatterns.length; i++) {
        const pattern = searchPatterns[i];
        let found = false;
        const ingredients = recipe.ingredients;
        for (let j = 0; j < ingredients.length; j++) {
            if (pattern.test(ingredients[j].name)) {
                found = true;
                break;
            }
        }
        if (!found) return false;
    }
    return true;
  });
}

// Data Generation
const generateRecipes = (count: number): Recipe[] => {
  const ingredientsPool = [
    'Tomato', 'Onion', 'Garlic', 'Chicken', 'Beef', 'Pasta', 'Rice', 'Salt', 'Pepper', 'Basil',
    'Oregano', 'Cheese', 'Milk', 'Butter', 'Flour', 'Sugar', 'Egg', 'Potato', 'Carrot', 'Spinach',
    'Mushroom', 'Fish', 'Lemon', 'Lime', 'Cilantro', 'Ginger', 'Soy Sauce', 'Honey', 'Vinegar', 'Oil'
  ];

  const recipes: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const numIngredients = Math.floor(Math.random() * 10) + 5; // 5-15 ingredients
    const ingredients: Ingredient[] = [];
    for (let j = 0; j < numIngredients; j++) {
      const name = ingredientsPool[Math.floor(Math.random() * ingredientsPool.length)] + (Math.random() > 0.5 ? ' Chopped' : '');
      ingredients.push({
        id: `ing-${i}-${j}`,
        name: name,
        amount: 1,
        unit: 'unit'
      });
    }

    recipes.push({
      id: `recipe-${i}`,
      name: `Recipe ${i}`,
      description: 'Desc',
      category: 'main-course',
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 4,
      defaultServings: 4,
      difficulty: 'medium',
      ingredients: ingredients,
      steps: [],
      tags: [],
      isFavorite: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user',
      isPublic: true
    });
  }
  return recipes;
}

const runBenchmark = () => {
  const recipeCount = 10000;
  console.log(`Generating ${recipeCount} recipes...`);
  const recipes = generateRecipes(recipeCount);

  const searchTermsList = [
    ['Tomato'],
    ['Chicken', 'Garlic'],
    ['Salt', 'Pepper', 'Oil'],
    ['ImpossibleIngredient'],
    ['Tomato', 'Impossible']
  ];

  console.log('Running benchmarks...');

  const iterations = 50;

  const approaches = [
    { name: 'Naive (Map)', fn: searchNaive },
    { name: 'Current (Regex)', fn: searchRegex },
    { name: 'Direct (String)', fn: searchDirect },
    { name: 'Regex (Loop)', fn: searchRegexLoop },
  ];

  for (const approach of approaches) {
    let totalTime = 0;

    // Warmup
    for (const terms of searchTermsList) {
       approach.fn(recipes, terms);
    }

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      for (const terms of searchTermsList) {
        approach.fn(recipes, terms);
      }
    }
    const end = performance.now();
    totalTime = end - start;

    console.log(`${approach.name}: ${totalTime.toFixed(2)}ms`);
  }
}

runBenchmark();
