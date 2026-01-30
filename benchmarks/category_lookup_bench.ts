import { getCategoryById } from '../config/categories';
import { Category } from '../types';

const CATEGORY_IDS: Category[] = [
  'appetizer',
  'soup',
  'salad',
  'main-course',
  'side-dish',
  'dessert',
  'drink',
  'snack',
  'breakfast',
  'other'
];

const runBenchmark = () => {
  const iterations = 10_000_000;
  console.log(`Running benchmark (${iterations} iterations)...`);

  // Pre-generate random indices to avoid measuring Math.random() overhead too much
  // although for 10M, array of 10M might be too big for memory?
  // 10M integers is ~40MB, it's fine.
  const randomIndices = new Uint8Array(iterations);
  for (let i = 0; i < iterations; i++) {
    randomIndices[i] = Math.floor(Math.random() * CATEGORY_IDS.length);
  }

  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    const categoryId = CATEGORY_IDS[randomIndices[i]];
    getCategoryById(categoryId);
  }

  const end = process.hrtime.bigint();
  const durationNs = end - start;
  const durationMs = Number(durationNs) / 1_000_000;
  const averageNs = Number(durationNs) / iterations;

  console.log(`Total time: ${durationMs.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${averageNs.toFixed(4)}ns`);
};

runBenchmark();
