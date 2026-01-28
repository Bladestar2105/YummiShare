import { filterByMaxTime } from '../utils/recipeUtils';
import { Recipe } from '../types';

const generateRecipes = (count: number): Recipe[] => {
  const recipes: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const prepTime = Math.floor(Math.random() * 60);
    const cookTime = Math.floor(Math.random() * 120);
    recipes.push({
      id: `id_${i}`,
      name: `Recipe ${i}`,
      description: 'Description',
      category: 'main-course',
      prepTime,
      cookTime,
      totalTime: prepTime + cookTime,
      servings: 4,
      defaultServings: 4,
      difficulty: 'medium',
      ingredients: [],
      steps: [],
      tags: [],
      isFavorite: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user_id',
      isPublic: true
    } as Recipe);
  }
  return recipes;
};

const runBenchmark = () => {
  const recipeCount = 1000000;
  console.log(`Generating ${recipeCount} recipes...`);
  const recipes = generateRecipes(recipeCount);
  const maxMinutes = 60;
  const iterations = 100;

  console.log(`Running benchmark (${iterations} iterations)...`);

  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    filterByMaxTime(recipes, maxMinutes);
  }

  const end = process.hrtime.bigint();
  const durationNs = end - start;
  const durationMs = Number(durationNs) / 1000000;
  const averageMs = durationMs / iterations;

  console.log(`Total time: ${durationMs.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${averageMs.toFixed(4)}ms`);
};

runBenchmark();
