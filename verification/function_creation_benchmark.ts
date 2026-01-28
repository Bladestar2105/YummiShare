
import { performance } from 'perf_hooks';

const ITERATIONS = 1000000;

// Baseline: Static function
const staticFunction = (x: number) => x * 2;

function benchmarkStatic() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    staticFunction(i);
  }
  const end = performance.now();
  return end - start;
}

// Case 1: Function creation (simulating inline function definition)
function benchmarkCreation() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const inlineFunction = (x: number) => x * 2;
    inlineFunction(i);
  }
  const end = performance.now();
  return end - start;
}

// Case 2: Closure creation (simulating inline function with captured variable)
function benchmarkClosure() {
  const start = performance.now();
  const factor = 2;
  for (let i = 0; i < ITERATIONS; i++) {
    const closureFunction = (x: number) => x * factor;
    closureFunction(i);
  }
  const end = performance.now();
  return end - start;
}

console.log(`Benchmarking ${ITERATIONS} iterations...`);

const staticTime = benchmarkStatic();
console.log(`Static function call: ${staticTime.toFixed(4)} ms`);

const creationTime = benchmarkCreation();
console.log(`Inline function creation & call: ${creationTime.toFixed(4)} ms`);

const closureTime = benchmarkClosure();
console.log(`Closure creation & call: ${closureTime.toFixed(4)} ms`);

console.log(`\nSlowdown factors:`);
console.log(`Creation vs Static: ${(creationTime / staticTime).toFixed(2)}x`);
console.log(`Closure vs Static: ${(closureTime / staticTime).toFixed(2)}x`);
