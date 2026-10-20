import { LIMITS, validateGraph } from "./validation.js";
const requireInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Input must be a JSON object using the example fields.");
};

const finite = (value, name, min = 0, max = LIMITS.value) => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw new Error(`${name} must be a finite number from ${min} to ${max}.`);
  return value;
};
const records = (items, name = "Items") => {
  if (!Array.isArray(items) || items.length > 12)
    throw new Error(`${name}: use at most 12 records.`);
  const ids = new Set();
  return items.map((item, i) => {
    if (!item || typeof item !== "object")
      throw new Error(`${name} must be objects.`);
    const id = item.id ?? String(i + 1);
    if (typeof id !== "string" || !id.trim() || id.length > 16 || ids.has(id))
      throw new Error(`${name} need unique IDs of 1–16 characters.`);
    ids.add(id);
    return { ...item, id, order: i };
  });
};
const recorder = () => {
  const steps = [];
  return {
    steps,
    add: (event, explanation, state, metrics = {}) =>
      steps.push({
        event,
        status: event === "complete" ? "Done" : event,
        explanation,
        state: structuredClone(state),
        metrics: { ...metrics },
        markers: {},
      }),
  };
};

/** Greedy value/weight ordering; equal ratios retain original input order. */
export function buildFractionalKnapsack(input) {
  requireInput(input);
  const capacity = finite(input.capacity, "Capacity");
  const items = records(input.items).map((item) => ({
    ...item,
    weight: finite(item.weight, "Weight", Number.EPSILON),
    value: finite(item.value, "Value"),
  }));
  const { steps, add } = recorder();
  let remaining = capacity,
    totalValue = 0,
    comparisons = 0;
  const sorted = [...items].sort((a, b) => {
    comparisons++;
    return b.value / b.weight - a.value / a.weight || a.order - b.order;
  });
  const selected = [];
  const state = () => ({
    items: sorted,
    capacity,
    remaining,
    totalValue,
    selected,
  });
  add(
    "sort",
    "Order items by descending value/weight ratio; ties keep input order.",
    state(),
    { comparisons },
  );
  for (const item of sorted) {
    if (remaining <= 0) break;
    const fraction = Math.min(1, remaining / item.weight);
    selected.push({
      id: item.id,
      fraction,
      weight: item.weight * fraction,
      value: item.value * fraction,
    });
    remaining = Math.max(0, remaining - item.weight * fraction);
    totalValue += item.value * fraction;
    add(
      "select",
      `Take ${(fraction * 100).toFixed(2)}% of ${item.id}.`,
      state(),
      { comparisons, selected: selected.length },
    );
  }
  add(
    "complete",
    `Total value ${totalValue.toFixed(2)}; unused capacity ${remaining.toFixed(2)}.`,
    state(),
    { comparisons, selected: selected.length },
  );
  return { steps, result: structuredClone(state()) };
}

/** Unit-time jobs; profit descending and input-order ties, latest free slot first. */
export function buildJobScheduling(input) {
  requireInput(input);
  const jobs = records(input.jobs, "Jobs").map((job) => {
    finite(job.profit, "Profit");
    if (
      !Number.isInteger(job.deadline) ||
      job.deadline < 1 ||
      job.deadline > 20
    )
      throw new Error("Deadlines must be integers from 1 to 20.");
    return job;
  });
  let comparisons = 0,
    totalProfit = 0;
  const sorted = [...jobs].sort((a, b) => {
    comparisons++;
    return b.profit - a.profit || a.order - b.order;
  });
  const slots = Array(
    Math.min(jobs.length, Math.max(0, ...jobs.map((j) => j.deadline))),
  ).fill(null);
  const { steps, add } = recorder();
  const state = () => ({ jobs: sorted, slots, totalProfit });
  add(
    "sort",
    "Sort unit-time jobs by descending profit; equal-profit jobs retain input order.",
    state(),
    { comparisons },
  );
  for (const job of sorted) {
    let slot = Math.min(slots.length, job.deadline) - 1;
    while (slot >= 0 && slots[slot] !== null) {
      comparisons++;
      add(
        "compare",
        `Slot ${slot + 1} is occupied for job ${job.id}.`,
        state(),
        { comparisons },
      );
      slot--;
    }
    if (slot >= 0) {
      slots[slot] = job;
      totalProfit += job.profit;
      add("assign", `Schedule ${job.id} in slot ${slot + 1}.`, state(), {
        comparisons,
      });
    } else
      add("skip", `No free slot before ${job.id}'s deadline.`, state(), {
        comparisons,
      });
  }
  add("complete", `Schedule complete. Profit ${totalProfit}.`, state(), {
    comparisons,
  });
  return { steps, result: structuredClone(state()) };
}

function directedInput(input, sourceRequired = false) {
  requireInput(input);
  if (!Array.isArray(input.nodes) || input.nodes.length > 8)
    throw new Error("Use 1–8 node IDs.");
  const nodes = input.nodes.map((id) => ({ id }));
  validateGraph(nodes, input.edges, {
    directed: true,
    ...(sourceRequired ? { startId: input.start } : {}),
  });
  if (sourceRequired && typeof input.start !== "string")
    throw new Error("Choose an existing start node.");
  if (input.edges.length > 32)
    throw new Error("Use at most 32 directed edges.");
  return { nodes, edges: input.edges.map((e) => ({ ...e })) };
}

export function buildBellmanFord(input) {
  const { nodes, edges } = directedInput(input, true),
    { steps, add } = recorder();
  const distances = Object.fromEntries(nodes.map((n) => [n.id, Infinity])),
    parents = Object.fromEntries(nodes.map((n) => [n.id, null]));
  distances[input.start] = 0;
  let relaxations = 0,
    comparisons = 0;
  const state = () => ({
    nodes: input.nodes,
    edges,
    start: input.start,
    distances,
    parents,
    negativeCycle: [],
  });
  add(
    "start",
    `Directed shortest paths from ${input.start}; unreachable distances are ∞.`,
    state(),
  );
  for (let pass = 1; pass < nodes.length; pass++) {
    let changed = false;
    for (const edge of edges) {
      comparisons++;
      add(
        "compare",
        `Pass ${pass}: inspect ${edge.source} → ${edge.target} (${edge.weight}).`,
        { ...state(), activeEdge: edge },
        { comparisons, relaxations },
      );
      if (
        Number.isFinite(distances[edge.source]) &&
        distances[edge.source] + edge.weight < distances[edge.target]
      ) {
        distances[edge.target] = distances[edge.source] + edge.weight;
        parents[edge.target] = edge.source;
        changed = true;
        relaxations++;
        add(
          "relax",
          `Update distance to ${edge.target}: ${distances[edge.target]}.`,
          state(),
          { comparisons, relaxations },
        );
      }
    }
    if (!changed) break;
  }
  const affected = new Set();
  for (const edge of edges) {
    comparisons++;
    if (
      Number.isFinite(distances[edge.source]) &&
      distances[edge.source] + edge.weight < distances[edge.target]
    )
      affected.add(edge.target);
  }
  for (let pass = 0; pass < nodes.length; pass++)
    for (const edge of edges)
      if (affected.has(edge.source)) affected.add(edge.target);
  for (const id of affected) {
    distances[id] = -Infinity;
    parents[id] = null;
  }
  const result = {
    ...state(),
    negativeCycle: [...affected],
    outcome: affected.size ? "negative-cycle" : "complete",
  };
  if (affected.size)
    add(
      "negativeCycle",
      "A reachable negative cycle makes the marked destinations unbounded (−∞).",
      result,
      { comparisons, relaxations },
    );
  add(
    "complete",
    affected.size
      ? "Reachable negative cycle detected; affected shortest paths are undefined."
      : "Shortest paths complete; unreachable cycles do not affect the source.",
    result,
    { comparisons, relaxations },
  );
  return { steps, result: structuredClone(result) };
}

export function buildFloydWarshall(input) {
  const { nodes, edges } = directedInput(input),
    n = nodes.length,
    { steps, add } = recorder();
  const ids = nodes.map((n) => n.id),
    index = new Map(ids.map((id, i) => [id, i]));
  const distances = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)),
  );
  for (const edge of edges)
    distances[index.get(edge.source)][index.get(edge.target)] = edge.weight;
  let comparisons = 0,
    writes = 0;
  const state = () => ({ nodes: ids, edges, distances, negativeCycle: [] });
  add(
    "start",
    "Initialize diagonal zeroes, directed edge weights and unreachable pairs as ∞.",
    state(),
  );
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        comparisons++;
        const candidate = distances[i][k] + distances[k][j];
        if (
          Number.isFinite(distances[i][k]) &&
          Number.isFinite(distances[k][j]) &&
          candidate < distances[i][j]
        ) {
          distances[i][j] = candidate;
          writes++;
          add(
            "relax",
            `Using ${ids[k]}, update ${ids[i]} → ${ids[j]} to ${candidate}.`,
            { ...state(), active: [i, j, k] },
            { comparisons, writes },
          );
        }
      }
  const cycle = ids.filter((_, i) => distances[i][i] < 0);
  const reachable = distances.map((row) => row.map((v) => v !== Infinity));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (
        cycle.some(
          (id) => reachable[i][index.get(id)] && reachable[index.get(id)][j],
        )
      )
        distances[i][j] = -Infinity;
  const result = {
    ...state(),
    negativeCycle: cycle,
    outcome: cycle.length ? "negative-cycle" : "complete",
  };
  if (cycle.length)
    add(
      "negativeCycle",
      "Mark every pair reachable through a negative cycle as −∞.",
      result,
      { comparisons, writes },
    );
  add(
    "complete",
    cycle.length
      ? "All-pairs computation complete with negative-cycle-affected pairs marked."
      : "All-pairs shortest paths complete. ∞ means no path.",
    result,
    { comparisons, writes },
  );
  return { steps, result: structuredClone(result) };
}

function strings(input) {
  requireInput(input);
  if (
    typeof input.text !== "string" ||
    typeof input.pattern !== "string" ||
    input.text.length > 200 ||
    input.pattern.length > 80
  )
    throw new Error(
      "Use text up to 200 characters and a pattern up to 80 characters.",
    );
  if (
    [...(input.text + input.pattern)].some(
      (c) =>
        !["\t", "\n"].includes(c) &&
        (c.charCodeAt(0) < 32 || c.charCodeAt(0) > 126),
    )
  )
    throw new Error(
      "This byte-oriented demonstration accepts ASCII text, tabs and newlines.",
    );
  return input;
}
export function stringHash(text) {
  let h = 0;
  for (const c of text) h = (h * 256 + c.charCodeAt(0)) % 101;
  return h;
}
function matchBuilder(input, rolling) {
  const { text, pattern } = strings(input),
    n = text.length,
    m = pattern.length,
    matches = [],
    { steps, add } = recorder();
  let comparisons = 0,
    collisions = 0;
  const state = (start = 0) => ({ text, pattern, matches, start, length: m });
  add(
    "start",
    `${rolling ? "Rabin–Karp (base 256, modulus 101)" : "Naive matching"} checks every possible position and includes overlapping matches.`,
    state(),
  );
  if (m === 0) {
    for (let i = 0; i <= n; i++) {
      matches.push(i);
      add("match", `Empty pattern matches boundary ${i}.`, state(i), {
        comparisons,
      });
    }
  } else if (m <= n) {
    let power = 1;
    for (let i = 1; i < m; i++) power = (power * 256) % 101;
    const patternHash = stringHash(pattern);
    let windowHash = stringHash(text.slice(0, m));
    for (let i = 0; i <= n - m; i++) {
      let equal = true;
      if (rolling)
        add(
          "hash",
          `Window ${i}: hash ${windowHash}; pattern hash ${patternHash}.`,
          { ...state(i), windowHash, patternHash },
          { comparisons, collisions },
        );
      if (!rolling || windowHash === patternHash) {
        for (let j = 0; j < m; j++) {
          comparisons++;
          add(
            "compare",
            `Compare text[${i + j}] with pattern[${j}].`,
            { ...state(i), active: [i + j, j] },
            { comparisons, collisions },
          );
          if (text[i + j] !== pattern[j]) {
            equal = false;
            break;
          }
        }
        if (equal) {
          matches.push(i);
          add("match", `Verified match at index ${i}.`, state(i), {
            comparisons,
            collisions,
          });
        } else if (rolling) {
          collisions++;
          add(
            "collision",
            "Equal hashes were a collision; character verification rejected the candidate.",
            state(i),
            { comparisons, collisions },
          );
        }
      }
      if (rolling && i < n - m)
        windowHash =
          ((((windowHash - text.charCodeAt(i) * power) % 101) + 101) * 256 +
            text.charCodeAt(i + m)) %
          101;
    }
  }
  const result = { ...state(), comparisons, collisions };
  add(
    "complete",
    `Complete: ${matches.length} matches at [${matches.join(", ")}].`,
    result,
    { comparisons, collisions },
  );
  return { steps, result: structuredClone(result) };
}
export const buildStringMatching = (input) => matchBuilder(input, false);
export const buildRabinKarp = (input) => matchBuilder(input, true);

export const advancedBuilders = {
  "fractional-knapsack": buildFractionalKnapsack,
  "job-scheduling": buildJobScheduling,
  "bellman-ford": buildBellmanFord,
  "floyd-warshall": buildFloydWarshall,
  "string-matching": buildStringMatching,
  "rabin-karp": buildRabinKarp,
};
export const advancedExamples = {
  "fractional-knapsack": {
    capacity: 50,
    items: [
      { id: "A", weight: 10, value: 60 },
      { id: "B", weight: 20, value: 100 },
      { id: "C", weight: 30, value: 120 },
    ],
  },
  "job-scheduling": {
    jobs: [
      { id: "A", deadline: 2, profit: 100 },
      { id: "B", deadline: 1, profit: 19 },
      { id: "C", deadline: 2, profit: 27 },
      { id: "D", deadline: 1, profit: 25 },
      { id: "E", deadline: 3, profit: 15 },
    ],
  },
  "bellman-ford": {
    nodes: ["A", "B", "C", "D"],
    start: "A",
    edges: [
      { source: "A", target: "B", weight: 4 },
      { source: "A", target: "C", weight: 5 },
      { source: "B", target: "C", weight: -2 },
    ],
  },
  "floyd-warshall": {
    nodes: ["A", "B", "C"],
    edges: [
      { source: "A", target: "B", weight: 3 },
      { source: "B", target: "C", weight: -1 },
    ],
  },
  "string-matching": { text: "ABABABA", pattern: "ABA" },
  "rabin-karp": { text: "ABABABA", pattern: "ABA" },
};
