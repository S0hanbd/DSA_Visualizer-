import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  buildDijkstraSteps,
  buildKruskalSteps,
} from "../src/logic/graphInteractive.js";
import {
  buildCountingSortSteps,
  buildRadixSortSteps,
} from "../src/logic/simulations.js";
import { buildAVLInsertSteps } from "../src/logic/treeInteractive.js";
import { buildGraphColoringSteps } from "../src/logic/graphColoringSimulation.js";

test("Dijkstra rejects an unknown destination without hanging (isolated)", () => {
  const child = spawnSync(
    process.execPath,
    [
      "--max-old-space-size=64",
      "--input-type=module",
      "-e",
      `
    import { buildDijkstraSteps } from './src/logic/graphInteractive.js';
    console.log(JSON.stringify(buildDijkstraSteps([{id:'A'}], [], 'A', 'F').at(-1)));
  `,
    ],
    { cwd: process.cwd(), encoding: "utf8", timeout: 1000 },
  );
  assert.equal(child.error, undefined, "Builder must terminate");
  assert.equal(child.status, 0);
  assert.equal(JSON.parse(child.stdout).status, "Error");
});

test("Dijkstra preserves unreachable distances and reports no path", () => {
  const steps = buildDijkstraSteps([{ id: "A" }, { id: "B" }], [], "A", "B");
  assert.equal(steps[0].markers.distances.B, Infinity);
  assert.equal(steps.at(-1).markers.success, false);
});

test("Dijkstra validates start, dangling edges, negative and nonfinite weights", () => {
  const nodes = [{ id: "A" }, { id: "B" }];
  for (const [edges, start] of [
    [[], "Z"],
    [[{ source: "A", target: "Z", weight: 1 }], "A"],
    [[{ source: "A", target: "B", weight: -1 }], "A"],
    [[{ source: "A", target: "B", weight: NaN }], "A"],
  ]) {
    assert.equal(
      buildDijkstraSteps(nodes, edges, start, "B").at(-1).status,
      "Error",
    );
  }
});

test("integer sorts reject decimals and define empty inputs", () => {
  for (const build of [buildCountingSortSteps, buildRadixSortSteps]) {
    assert.throws(() => build([1.5, 2.5]), /integer/i);
    assert.deepEqual(build([]).at(-1).array, []);
  }
});

function verifyAVL(node) {
  if (!node) return 0;
  const l = verifyAVL(node.left),
    r = verifyAVL(node.right);
  assert.ok(Math.abs(l - r) <= 1, `Unbalanced node ${node.val}: ${l}/${r}`);
  assert.equal(node.height, 1 + Math.max(l, r), `Stale height at ${node.val}`);
  return node.height;
}
test("AVL final snapshots include updated heights", () => {
  const steps = buildAVLInsertSteps(null, [10, 20]);
  assert.equal(steps.at(-1).tree.height, 2);
});
test("AVL successive operations maintain true heights and balance", () => {
  let root = null;
  for (const value of [21, 10, 7, 31, 12, 70, 58, 37, 26, 93, 33]) {
    root = buildAVLInsertSteps(root, [value]).at(-1).tree;
    verifyAVL(root);
  }
});

test("graph coloring rejects self loops", () => {
  assert.equal(
    buildGraphColoringSteps(
      [{ id: "A" }],
      [{ source: "A", target: "A" }],
      3,
    ).at(-1).status,
    "Error",
  );
});
test("Kruskal identifies a disconnected minimum spanning forest", () => {
  const final = buildKruskalSteps(
    [{ id: "A" }, { id: "B" }, { id: "C" }],
    [{ source: "A", target: "B", weight: 1 }],
  ).at(-1);
  assert.equal(final.markers.connected, false);
  assert.match(final.explanation, /forest|disconnected/i);
});
