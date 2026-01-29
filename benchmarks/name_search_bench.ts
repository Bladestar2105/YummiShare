
import { Recipe, Ingredient } from '../types';
import { performance } from 'perf_hooks';

// Mock escapeRegExp locally as it is not exported
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. Current Implementation (toLowerCase)
const searchByNameCurrent = (recipes: Recipe[], query: string): Recipe[] => {
  if (!query.trim()) return recipes

  const lowerQuery = query.toLowerCase().trim()

  return recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// 2. Optimized Implementation (Regex)
const searchByNameOptimized = (recipes: Recipe[], query: string): Recipe[] => {
  if (!query.trim()) return recipes

  const pattern = new RegExp(escapeRegExp(query.trim()), 'i');

  return recipes.filter(recipe =>
    pattern.test(recipe.name) ||
    pattern.test(recipe.description) ||
    recipe.tags.some(tag => pattern.test(tag))
  )
}

// Data Generation
const generateRecipes = (count: number): Recipe[] => {
  const recipes: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    recipes.push({
      id: `recipe-${i}`,
      name: `Recipe ${i} with some interesting text`,
      description: `This is a description for recipe ${i}. It has some length to it to simulate real descriptions. It might contain words like Tomato or Chicken.`,
      category: 'main-course',
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 4,
      defaultServings: 4,
      difficulty: 'medium',
      ingredients: [],
      steps: [],
      tags: ['healthy', 'quick', 'dinner'],
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

  const searchQueries = [
    'Recipe',
    'Tomato',
    'quick',
    'impossible',
    'description'
  ];

  console.log('Running benchmarks...');

  const iterations = 50;

  const approaches = [
    { name: 'Current (toLowerCase)', fn: searchByNameCurrent },
    { name: 'Optimized (Regex)', fn: searchByNameOptimized },
  ];

  for (const approach of approaches) {
    let totalTime = 0;

    // Warmup
    for (const query of searchQueries) {
       approach.fn(recipes, query);
    }

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      for (const query of searchQueries) {
        approach.fn(recipes, query);
      }
    }
    const end = performance.now();
    totalTime = end - start;

    console.log(`${approach.name}: ${totalTime.toFixed(2)}ms`);
  }
}

runBenchmark();
