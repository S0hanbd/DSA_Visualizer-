import test from "node:test";
import assert from "node:assert/strict";
import { algorithms, algorithmMap } from "../src/data/algorithms.js";
import {
  buildSimulationSteps,
  buildInsertionSortSteps,
  buildMergeSortSteps,
} from "../src/logic/simulations.js";
import { buildBubbleSortSteps } from "../src/logic/bubbleSortSimulation.js";
import { buildNQueensSteps } from "../src/logic/nQueensSimulation.js";
import * as stack from "../src/logic/stackInteractive.js";
import * as cq from "../src/logic/circularQueueInteractive.js";
import * as pq from "../src/logic/priorityQueueInteractive.js";
import * as lists from "../src/logic/linkedListInteractive.js";
import {
  buildBSTInsertSteps,
  buildTraversalSteps,
  calculateTreeLayout,
  buildAVLInsertResult,
} from "../src/logic/treeInteractive.js";
import {
  educationalSource,
  highlightedLine,
} from "../src/data/educationalCode.js";
import {
  advancedBuilders,
  advancedExamples,
} from "../src/logic/advancedSimulations.js";

function random(seed = 42) {
  return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}
test("900 seeded sorting cases preserve input and produce numerically sorted output", () => {
  const rnd = random();
  let cases = 0;
  for (const algorithm of algorithms.filter((a) => a.type === "sorting"))
    for (let t = 0; t < 100; t++) {
      const input = Array.from(
          { length: 2 + Math.floor(rnd() * 19) },
          () => 1 + Math.floor(rnd() * 999),
        ),
        copy = [...input];
      const steps = buildSimulationSteps(input, algorithm);
      assert.deepEqual(
        steps.at(-1).array,
        [...input].sort((a, b) => a - b),
        algorithm.slug,
      );
      assert.deepEqual(input, copy);
      cases++;
    }
  assert.equal(cases, 900);
});
test("1700 seeded structure operations preserve FIFO/LIFO, heap and list invariants", () => {
  const rnd = random(81);
  let queue = cq.buildInitialCQStep()[0],
    reference = [];
  for (let i = 0; i < 500; i++) {
    if (rnd() < 0.6) {
      const value = Math.floor(rnd() * 100);
      queue = cq.buildCQEnqueueSteps(queue, value).at(-1);
      if (reference.length < 10) reference.push(value);
    } else {
      queue = cq.buildCQDequeueSteps(queue).at(-1);
      reference.shift();
    }
    assert.deepEqual(
      reference.map((_, i) => queue.array[(queue.front + i) % 10]),
      reference,
    );
  }
  let model = [];
  reference = [];
  for (let i = 0; i < 500; i++) {
    if (rnd() < 0.6) {
      const value = Math.floor(rnd() * 100);
      model = stack.buildPushSteps(model, value).at(-1).array;
      if (reference.length < 10) reference.push(value);
    } else {
      model = stack.buildPopSteps(model).at(-1).array;
      reference.pop();
    }
    assert.deepEqual(model, reference);
  }
  for (const max of [true, false]) {
    let model = [],
      reference = [];
    for (let i = 0; i < 200; i++) {
      if (!model.length || (model.length < 15 && rnd() < 0.6)) {
        const value = Math.floor(rnd() * 100);
        model = pq.buildPQInsertSteps(model, [value], max).at(-1).array;
        reference.push(value);
      } else {
        reference.sort((a, b) => (max ? b - a : a - b));
        assert.equal(model[0].val, reference.shift());
        model = pq.buildPQExtractSteps(model, max).at(-1).array;
      }
      for (let j = 1; j < model.length; j++)
        assert.ok(
          max
            ? model[(j - 1) >> 1].val >= model[j].val
            : model[(j - 1) >> 1].val <= model[j].val,
        );
    }
  }
  for (const type of ["linked-list", "doubly-list", "circular-list"]) {
    let model = [],
      reference = [];
    for (let i = 0; i < 100; i++) {
      const value = Math.floor(rnd() * 10),
        op = model.length >= 16 ? 3 : Math.floor(rnd() * 4);
      if (op === 0) {
        model = lists.buildInsertHeadSteps(model, value, type).at(-1).array;
        reference.unshift(value);
      } else if (op === 1) {
        model = lists.buildInsertTailSteps(model, value, type).at(-1).array;
        reference.push(value);
      } else if (op === 2) {
        const index = Math.floor(rnd() * (reference.length + 1));
        model = lists
          .buildInsertAtSteps(model, value, index, type)
          .at(-1).array;
        reference.splice(index, 0, value);
      } else {
        model = lists.buildDeleteSteps(model, value, type).at(-1).array;
        const index = reference.indexOf(value);
        if (index >= 0) reference.splice(index, 1);
      }
      assert.deepEqual(model, reference);
    }
  }
});
test("intermediate states, metrics and explanations describe actual operations", () => {
  assert.equal(buildBubbleSortSteps([1, 2, 3, 4]).at(-1).comparisons, 3);
  assert.equal(buildInsertionSortSteps([3, 2, 1]).at(-1).swaps, 0);
  assert.equal(buildInsertionSortSteps([3, 2, 1]).at(-1).shifts, 3);
  assert.ok(
    buildMergeSortSteps([3, 1, 2]).some(
      (s) => s.leftBuffer.length && s.rightBuffer.length,
    ),
  );
  for (const slug of ["counting-sort", "radix-sort"]) {
    const steps = buildSimulationSteps([3, 1, 2], algorithmMap[slug]);
    assert.equal(steps.at(-1).comparisons, 0);
    assert.ok(steps.some((s) => s.output?.some((v) => v !== null)));
  }
  const steps = lists.buildInsertAtSteps([1, 3], 2, 1, "doubly-list");
  assert.ok(steps.some((s) => s.markers.customEdges.length));
  assert.ok(steps.some((s) => s.explanation.includes("backward links")));
  assert.match(
    lists
      .buildDeleteSteps([1, 2], 2, "circular-list")
      .find((s) => s.status === "Delete Tail").explanation,
    /HEAD/,
  );
  assert.match(
    lists.buildSearchSteps([1, 2], 3, "circular-list").at(-1).explanation,
    /Returned to HEAD/,
  );
  assert.deepEqual(
    lists
      .buildTraverseSteps([1, 2, 3], "doubly-list", true)
      .filter((s) => s.status === "Visiting")
      .at(-1).markers.history,
    [3, 2, 1],
  );
});
test("tree traversal uses level order and compact linear-width layout", () => {
  const root = buildBSTInsertSteps(null, [4, 2, 6, 1, 3, 5, 7]).at(-1).tree;
  assert.deepEqual(
    buildTraversalSteps(root, "level").at(-1).markers.history,
    [4, 2, 6, 1, 3, 5, 7],
  );
  let skew = buildBSTInsertSteps(
    null,
    Array.from({ length: 25 }, (_, i) => i),
  ).at(-1).tree;
  const layout = calculateTreeLayout(skew),
    positions = [];
  while (skew) {
    positions.push(skew.x);
    skew = skew.right;
  }
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 25 * 64);
  assert.ok(layout);
  const result = buildAVLInsertResult(null, [10, 20]);
  assert.equal(result.finalModel.height, 2);
  assert.notEqual(result.finalModel, result.steps.at(-1).tree);
});
test("N Queens enumerates exactly 2, 10 and 4 safe solutions", () => {
  for (const [size, count] of [
    [4, 2],
    [5, 10],
    [6, 4],
  ]) {
    const solutions = buildNQueensSteps(size).at(-1).solutions;
    assert.equal(solutions.length, count);
    for (const solution of solutions)
      for (let row = 0; row < size; row++)
        for (let r = 0; r < row; r++) {
          assert.notEqual(solution[row], solution[r]);
          assert.notEqual(Math.abs(solution[row] - solution[r]), row - r);
        }
  }
});
test("source anchors highlight real matching statements; six advanced variants have mapped events", () => {
  for (const [slug, step, statement] of [
    ["bubble-sort", { status: "Comparing" }, /if \(arr\[j\]/],
    ["heap-sort", { status: "Heapifying" }, /if \(l </],
    ["n-queens", { status: "Placing" }, /board\[row\]=col/],
    ["avl", { event: "height" }, /height = 1|height =|height=|height = 1/],
  ]) {
    const result = highlightedLine(algorithmMap[slug], step);
    assert.ok(result.line, slug);
    assert.match(result.code.split("\n")[result.line - 1], statement);
  }
  for (const [slug, builder] of Object.entries(advancedBuilders)) {
    const source = educationalSource(algorithmMap[slug]);
    for (const step of builder(advancedExamples[slug]).steps)
      assert.ok(source.anchors[step.event], `${slug}: ${step.event}`);
  }
  assert.notEqual(
    educationalSource(algorithmMap["priority-queue"], "min").code,
    educationalSource(algorithmMap["priority-queue"], "max").code,
  );
});
