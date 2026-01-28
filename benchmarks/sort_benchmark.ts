import { sortRecipes } from '../utils/recipeUtils';
import { Recipe } from '../types';

// Mock function to generate a recipe
const createMockRecipe = (i: number): Recipe => {
  const prepTime = Math.floor(Math.random() * 60) + 1;
  const cookTime = Math.floor(Math.random() * 120) + 1;

  return {
    id: `recipe-${i}`,
    name: `Recipe ${i}`,
    description: `Description for recipe ${i}`,
    category: 'main-course',
    prepTime,
    cookTime,
    totalTime: prepTime + cookTime, // Ensure this is correct
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
    userId: 'user-1',
    isPublic: true
  };
};

const runBenchmark = () => {
  const COUNT = 1000000; // Increased to 1M to make diff more visible
  console.log(`Generating ${COUNT} recipes...`);
  const recipes: Recipe[] = [];
  for (let i = 0; i < COUNT; i++) {
    recipes.push(createMockRecipe(i));
  }

  console.log('Running sort benchmark (sortBy="quick")...');

  const start = process.hrtime();
  // sortRecipes creates a copy, so we are safe calling it multiple times if we wanted,
  // but here we just call it once.
  sortRecipes(recipes, 'quick');
  const end = process.hrtime(start);

  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
  console.log(`Sort completed in ${timeInMs} ms`);
};

runBenchmark();
