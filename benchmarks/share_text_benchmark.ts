import { generateRecipeShareText } from '../utils/recipeUtils';
import { Recipe, Ingredient } from '../types';

const generateLargeRecipe = (ingredientCount: number, stepCount: number): Recipe => {
  const ingredients: Ingredient[] = [];
  for (let i = 0; i < ingredientCount; i++) {
    ingredients.push({
      id: `ing_${i}`,
      name: `Ingredient ${i}`,
      amount: i + 1,
      unit: 'units'
    });
  }

  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    steps.push(`Step ${i}: Do something important.`);
  }

  return {
    id: 'benchmark_recipe',
    name: 'Benchmark Recipe',
    description: 'A very complex recipe for benchmarking purposes.',
    category: 'main-course',
    prepTime: 30,
    cookTime: 60,
    totalTime: 90,
    servings: 4,
    defaultServings: 4,
    difficulty: 'hard',
    ingredients,
    steps,
    tags: [],
    isFavorite: false,
    rating: 5,
    reviewCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
    isPublic: true
  };
};

const runBenchmark = () => {
  const ingredientCount = 1000;
  const stepCount = 1000;
  const iterations = 5000;

  console.log(`Generating recipe with ${ingredientCount} ingredients and ${stepCount} steps...`);
  const recipe = generateLargeRecipe(ingredientCount, stepCount);

  console.log(`Running benchmark (${iterations} iterations)...`);

  // Warmup
  for (let i = 0; i < 100; i++) {
    generateRecipeShareText(recipe);
  }

  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    generateRecipeShareText(recipe);
  }

  const end = process.hrtime.bigint();
  const durationNs = end - start;
  const durationMs = Number(durationNs) / 1000000;
  const averageMs = durationMs / iterations;

  console.log(`Total time: ${durationMs.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${averageMs.toFixed(4)}ms`);
};

runBenchmark();
