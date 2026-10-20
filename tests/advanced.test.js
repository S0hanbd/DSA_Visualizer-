import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFractionalKnapsack as knapsack,
  buildJobScheduling as jobs,
  buildBellmanFord as bellman,
  buildFloydWarshall as floyd,
  buildStringMatching as naive,
  buildRabinKarp as rabin,
  stringHash,
  advancedExamples,
  advancedBuilders,
} from "../src/logic/advancedSimulations.js";
test("fractional selection, zero capacity and invalid weights", () => {
  const r = knapsack(advancedExamples["fractional-knapsack"]).result;
  assert.equal(r.totalValue, 240);
  assert.equal(r.selected[2].fraction, 2 / 3);
  assert.equal(
    knapsack({ ...advancedExamples["fractional-knapsack"], capacity: 0 }).result
      .totalValue,
    0,
  );
  assert.throws(
    () => knapsack({ capacity: 1, items: [{ weight: 0, value: 1 }] }),
    /Weight/,
  );
  assert.throws(() => knapsack({ capacity: -1, items: [] }));
});
test("unit jobs respect deadlines and deterministic input-order ties", () => {
  assert.equal(
    jobs(advancedExamples["job-scheduling"]).result.totalProfit,
    142,
  );
  assert.equal(
    jobs({
      jobs: [
        { id: "first", deadline: 1, profit: 10 },
        { id: "second", deadline: 1, profit: 10 },
      ],
    }).result.slots[0].id,
    "first",
  );
  assert.throws(() => jobs({ jobs: [{ deadline: 0, profit: 1 }] }));
});
test("Bellman Ford handles unreachable nodes and only reachable negative cycles", () => {
  const r = bellman(advancedExamples["bellman-ford"]).result;
  assert.equal(r.distances.C, 2);
  assert.equal(r.distances.D, Infinity);
  const nodes = ["A", "B", "C"];
  const edges = [
    { source: "B", target: "C", weight: -2 },
    { source: "C", target: "B", weight: 1 },
  ];
  assert.equal(
    bellman({ nodes, edges, start: "A" }).result.outcome,
    "complete",
  );
  assert.equal(
    bellman({
      nodes,
      edges: [{ source: "A", target: "B", weight: 0 }, ...edges],
      start: "A",
    }).result.distances.C,
    -Infinity,
  );
});
test("Floyd Warshall marks unreachable and cycle-affected pairs", () => {
  const r = floyd(advancedExamples["floyd-warshall"]).result;
  assert.equal(r.distances[0][2], 2);
  assert.equal(r.distances[2][0], Infinity);
  const cycle = floyd({
    nodes: ["A", "B", "C"],
    edges: [
      { source: "A", target: "B", weight: -2 },
      { source: "B", target: "A", weight: 1 },
    ],
  }).result;
  assert.equal(cycle.distances[0][1], -Infinity);
  assert.equal(cycle.distances[2][0], Infinity);
});
test("both matchers report overlaps, empty boundaries and longer patterns", () => {
  for (const build of [naive, rabin]) {
    assert.deepEqual(
      build({ text: "AAAA", pattern: "AA" }).result.matches,
      [0, 1, 2],
    );
    assert.deepEqual(
      build({ text: "AB", pattern: "" }).result.matches,
      [0, 1, 2],
    );
    assert.deepEqual(build({ text: "", pattern: "A" }).result.matches, []);
    assert.throws(() => build({ text: "é", pattern: "é" }), /ASCII/);
  }
});
test("Rabin Karp verifies characters when different windows have equal hashes", () => {
  const words = [];
  for (let a = 65; a < 91; a++)
    for (let b = 65; b < 91; b++) words.push(String.fromCharCode(a, b));
  const first = words[0],
    collision = words.find(
      (w) => w !== first && stringHash(w) === stringHash(first),
    );
  const result = rabin({ text: collision, pattern: first }).result;
  assert.deepEqual(result.matches, []);
  assert.equal(result.collisions, 1);
});
test("all six examples generate deterministic snapshots", () => {
  for (const [slug, builder] of Object.entries(advancedBuilders))
    assert.deepEqual(
      builder(advancedExamples[slug]),
      builder(advancedExamples[slug]),
    );
});
