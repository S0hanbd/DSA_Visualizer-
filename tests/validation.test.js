import test from "node:test";
import assert from "node:assert/strict";
import {
  parseNumbers,
  parseNumber,
  topologyKey,
  reconcileEndpoints,
} from "../src/logic/validation.js";
import { algorithms, algorithmMap } from "../src/data/algorithms.js";
import { capabilities } from "../src/data/capabilities.js";
import { buildSimulationSteps } from "../src/logic/simulations.js";
import { runGraphColoring } from "../src/logic/graphColoringSimulation.js";

test("strict tokens never invent zeros, truncate or silently discard data", () => {
  assert.deepEqual(parseNumbers(" 10, 20, "), [10, 20]);
  for (const text of ["", " ", "12x, 4", "2.5", "1e2"])
    assert.throws(() => parseNumbers(text));
  assert.throws(() => parseNumbers("1,2,3", { maxCount: 2 }));
  assert.equal(parseNumber("1.25", { integer: false }), 1.25);
});
test("example endpoint selections reconcile with actual nodes", () => {
  assert.deepEqual(reconcileEndpoints([{ id: "A" }, { id: "E" }], "A", "F"), {
    start: "A",
    end: "E",
  });
  assert.deepEqual(reconcileEndpoints([], "A", "F"), { start: "", end: "" });
});
test("coordinates do not alter topology versions", () => {
  assert.equal(
    topologyKey([{ id: "A", x: 0 }], []),
    topologyKey([{ id: "A", x: 999 }], []),
  );
});
test("coloring distinguishes complete, unsatisfiable, invalid, truncated and cancelled", () => {
  const nodes = [{ id: "A" }, { id: "B" }, { id: "C" }];
  const edges = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "C", target: "A" },
  ];
  assert.equal(runGraphColoring(nodes, edges, 2).outcome, "unsatisfiable");
  assert.equal(runGraphColoring(nodes, edges, 3).solutions.length, 6);
  assert.equal(
    runGraphColoring(nodes, [], 3, { maxSteps: 10 }).outcome,
    "truncated",
  );
  assert.equal(
    runGraphColoring(nodes, [], 3, { maxSolutions: 2 }).solutions.length,
    2,
  );
  assert.equal(
    runGraphColoring(nodes, [], 3, { shouldCancel: () => true }).outcome,
    "cancelled",
  );
  assert.equal(
    runGraphColoring(nodes, [{ source: "A", target: "A" }], 3).outcome,
    "invalid",
  );
  let tick = 0;
  assert.equal(
    runGraphColoring(nodes, [], 3, { now: () => tick++, maxMs: 2 }).outcome,
    "truncated",
  );
});
test("bounded coloring retains each solution once, with count-only timeline snapshots", () => {
  const result = runGraphColoring(
    Array.from({ length: 6 }, (_, i) => ({ id: String(i) })),
    [],
    3,
  );
  assert.ok(result.steps.length <= 12000);
  assert.ok(result.solutions.length <= 200);
  assert.ok(
    result.steps.every((s) => !("solutions" in s) && !("solution" in s)),
  );
});

test("capability registration controls availability and unsupported requests never fabricate results", () => {
  assert.equal(Object.keys(capabilities).length, 37);
  assert.deepEqual(
    Object.keys(capabilities).sort(),
    Object.keys(algorithmMap).sort(),
  );
  assert.ok(
    algorithms.every(
      (algorithm) => !algorithm.comingSoon && algorithm.code.length > 0,
    ),
  );
  const unsupported = buildSimulationSteps([3, 1], {
    slug: "missing",
    title: "Missing",
    type: "sorting",
  });
  assert.equal(unsupported.at(-1).status, "Unsupported");
  assert.deepEqual(unsupported.at(-1).array, [3, 1]);
  assert.equal(runGraphColoring(null, [], 3).outcome, "invalid");
});
