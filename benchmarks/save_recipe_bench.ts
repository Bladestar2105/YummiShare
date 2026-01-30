
// Setup mocks before imports
(global as any).mockStorage = {};

// Mocking dependencies via Module.prototype.require
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(request: string) {
  if (request === '@react-native-async-storage/async-storage') {
     return {
        getItem: async (key: string) => {
            return (global as any).mockStorage[key] || null;
        },
        setItem: async (key: string, value: string) => {
            (global as any).mockStorage[key] = value;
        },
        removeItem: async (key: string) => {
            delete (global as any).mockStorage[key];
        },
        getAllKeys: async () => {
             return Object.keys((global as any).mockStorage);
        },
        multiGet: async (keys: string[]) => {
             return keys.map(key => [key, (global as any).mockStorage[key] || null]);
        },
        multiSet: async (kvPairs: [string, string][]) => {
             kvPairs.forEach(([key, value]) => {
                 (global as any).mockStorage[key] = value;
             });
        },
        multiRemove: async (keys: string[]) => {
             keys.forEach(key => {
                 delete (global as any).mockStorage[key];
             });
        }
    };
  }
  if (request === 'react-native-get-random-values') {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

// Now import the service
// @ts-ignore
const { saveRecipe, resetCache, getAllRecipes } = require('../services/localDataService');

// Helper to generate recipes (simplified version of Recipe)
const generateLargeRecipeData = (count: number) => {
    const recipes = [];
    for (let i = 0; i < count; i++) {
        recipes.push({
             id: `id_${i}`,
            name: `Recipe ${i}`,
            description: `Description for recipe ${i}`,
            category: 'main-course',
            prepTime: 10,
            cookTime: 20,
            totalTime: 30,
            servings: 4,
            defaultServings: 4,
            difficulty: 'medium',
            ingredients: [],
            steps: [],
            tags: [],
            isFavorite: false,
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString(), // Storage stores strings
            updatedAt: new Date().toISOString(),
            userId: 'user_1',
            isPublic: false
        });
    }
    return recipes;
}

const runBenchmark = async () => {
    const RECIPE_COUNT = 5000;
    const ITERATIONS = 20;

    console.log(`Generating ${RECIPE_COUNT} recipes...`);
    const recipes = generateLargeRecipeData(RECIPE_COUNT);
    const jsonStr = JSON.stringify(recipes);

    // Seed the mock storage
    (global as any).mockStorage['recipes'] = jsonStr;
    resetCache();

    // Warm up cache
    await getAllRecipes();

    console.log(`Running benchmark: saveRecipe (${ITERATIONS} iterations)...`);

    const start = process.hrtime.bigint();

    for (let i = 0; i < ITERATIONS; i++) {
        await saveRecipe({
            name: `New Recipe ${i}`,
            description: 'New Description',
            category: 'dessert',
            prepTime: 5,
            cookTime: 5,
            servings: 2,
            difficulty: 'easy',
            ingredients: [],
            steps: [],
            tags: [],
            isPublic: false
        });
    }

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1000000;

    console.log(`Total time: ${durationMs.toFixed(2)}ms`);
    console.log(`Average time per save: ${(durationMs / ITERATIONS).toFixed(4)}ms`);
}

runBenchmark().catch(console.error);
