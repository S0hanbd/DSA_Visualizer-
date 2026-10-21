import test from "node:test";
import assert from "node:assert/strict";
import { presentArrayTrace } from "../src/logic/arrayPresentation.js";
import { buildSimulationSteps } from "../src/logic/simulations.js";
import { algorithmMap } from "../src/data/algorithms.js";
import { arrayLearning } from "../src/data/arrayLearning.js";

const redesignedSlugs = [
  "linear-search",
  "binary-search",
  "bubble-sort",
  "selection-sort",
  "insertion-sort",
  "merge-sort",
  "quick-sort",
  "heap-sort",
  "shell-sort",
  "counting-sort",
  "radix-sort",
];

test("all eleven redesigned algorithms have implementation-specific learning content", () => {
  assert.deepEqual(Object.keys(arrayLearning).sort(), [...redesignedSlugs].sort());
  for (const slug of redesignedSlugs) {
    assert.ok(algorithmMap[slug], `${slug} must resolve to a catalog entry`);
    for (const field of ["purpose", "variant", "note", "pseudo"])
      assert.ok(arrayLearning[slug][field]?.trim(), `${slug} needs ${field}`);
  }
});

test("every redesigned algorithm emits the teaching state required by its view", () => {
  const expected = {
    "linear-search": ["Comparing", "Found"],
    "binary-search": ["Checking Mid", "Search Right", "Found"],
    "bubble-sort": ["Comparing", "Swapping", "Pass Complete"],
    "selection-sort": ["Comparing", "New Minimum", "Min Found"],
    "insertion-sort": ["Set Key", "Shifting", "Inserted"],
    "merge-sort": ["Merging", "Comparing", "Placing", "Merged"],
    "quick-sort": ["Pivot Chosen", "Comparing", "Pivot Placed", "Base Case"],
    "heap-sort": ["Build Heap", "Heapifying", "Extracted"],
    "shell-sort": ["New Gap", "Pick Key", "Shifting", "Placed"],
    "counting-sort": ["Counting", "Prefix Sum", "Placing"],
    "radix-sort": ["New Digit Pass", "Counting", "Placing", "Pass Done"],
  };
  const inputs = {
    "linear-search": [9, 4, 7, 2],
    "binary-search": [2, 4, 7, 9],
  };
  for (const slug of redesignedSlugs) {
    const trace = buildSimulationSteps(
      inputs[slug] ?? [9, 4, 7, 2],
      algorithmMap[slug],
      7,
    );
    const statuses = new Set(trace.map((step) => step.status));
    for (const status of expected[slug])
      assert.ok(statuses.has(status), `${slug} needs a ${status} state`);
  }
});

for (const slug of [
  "bubble-sort",
  "selection-sort",
  "insertion-sort",
  "merge-sort",
  "quick-sort",
  "heap-sort",
  "shell-sort",
  "counting-sort",
  "radix-sort",
]) {
  test(`${slug}: presentation identities follow values, including duplicates and buffer writes`, () => {
    for (const input of [
      [42, 18, 42, 11, 18, 73, 11],
      [9, 8, 7, 6, 5, 4, 3, 2, 1],
      [1, 1],
      [999, 1, 999, 2],
    ]) {
      const trace = buildSimulationSteps(input, algorithmMap[slug]);
      const before = JSON.stringify(trace);
      const steps = presentArrayTrace(trace, slug);
      assert.equal(
        JSON.stringify(trace),
        before,
        "adapter must not mutate simulation snapshots",
      );
      for (const step of steps) {
        step.presentation.ids.forEach((id, index) => {
          if (index !== step.presentation.hole)
            assert.equal(
              input[Number(id?.slice(5))],
              step.array[index],
              `${step.status} index ${index}`,
            );
        });
        if (step.presentation.held)
          assert.equal(
            input[Number(step.presentation.held.id.slice(5))],
            step.presentation.held.value,
          );
      }
      assert.equal(new Set(steps.at(-1).presentation.ids).size, input.length);
      assert.deepEqual(
        steps.at(-1).array,
        [...input].sort((a, b) => a - b),
      );
    }
  });
}

test("heap positions are settled only after extraction; comparison count is based on actual child checks", () => {
  const steps = buildSimulationSteps([3, 1, 2], algorithmMap["heap-sort"]);
  const sorted = [1, 2, 3];
  for (const step of steps)
    for (const index of step.sorted)
      assert.equal(step.array[index], sorted[index]);
  assert.equal(steps.at(-1).comparisons, 3);
});
