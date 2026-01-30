
// benchmarks/inline_render_bench.ts

const ITERATIONS = 10000;
const LIST_SIZE = 1000;

// Mock ingredient data
const ingredients = Array.from({ length: LIST_SIZE }, (_, i) => ({
  id: `ing-${i}`,
  name: `Ingredient ${i}`,
  amount: 1,
  unit: 'cup'
}));

// Simulate List.Item or React Element creation
const createElement = (type: any, props: any) => {
    return { type, props };
};

// Case 1: Inline function
const runInline = () => {
    for (let i = 0; i < ITERATIONS; i++) {
         ingredients.map(ingredient => createElement('ListItem', {
            key: ingredient.id,
            title: ingredient.name,
            description: `${ingredient.amount} ${ingredient.unit}`,
            left: () => "Icon" // Inline function - new closure every time
         }));
    }
};

// Case 2: Extracted function
const IconComponent = () => "Icon";

const runExtracted = () => {
    for (let i = 0; i < ITERATIONS; i++) {
         ingredients.map(ingredient => createElement('ListItem', {
            key: ingredient.id,
            title: ingredient.name,
            description: `${ingredient.amount} ${ingredient.unit}`,
            left: IconComponent // Stable reference
         }));
    }
};

const measure = (name: string, fn: () => void) => {
    // Force GC if possible (not reliably in JS but we can try to separate runs)
    if (global.gc) {
        global.gc();
    }

    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1000000;
    console.log(`${name}: ${durationMs.toFixed(2)}ms`);
    return durationMs;
};

console.log(`Running benchmark with ${ITERATIONS} iterations on list of size ${LIST_SIZE}...`);

// Warmup
runInline();
runExtracted();

const inlineTime = measure("Inline Function", runInline);
const extractedTime = measure("Extracted Function", runExtracted);

const improvement = inlineTime - extractedTime;
const ratio = inlineTime / extractedTime;

console.log(`Improvement: ${improvement.toFixed(2)}ms`);
console.log(`Speedup: ${ratio.toFixed(2)}x`);
