import { validateGraph, errorSteps } from "./validation.js";

export const COLORING_LIMITS = Object.freeze({
  maxNodes: 10,
  maxSolutions: 200,
  maxSteps: 12000,
  maxMs: 1500,
  batchSize: 100,
});

/** Streaming DFS. Each solution is retained once; steps store only its count. */
export function* graphColoringEvents(nodes, edges, numColors, options = {}) {
  const limits = Object.fromEntries(
    Object.entries(COLORING_LIMITS).map(([key, value]) => [
      key,
      Math.max(1, Math.min(value, options[key] ?? value)),
    ]),
  );
  const now = options.now ?? (() => performance.now());
  const started = now();
  let stepCount = 0,
    solutionCount = 0;
  const color = Array(Array.isArray(nodes) ? nodes.length : 0).fill(0);
  const snapshot = (status, explanation, event, markers = {}, extra = {}) => ({
    color: [...color],
    solutionCount,
    status,
    explanation,
    event,
    markers,
    ...extra,
  });
  try {
    validateGraph(nodes, edges, { weighted: false });
    if (nodes.length > limits.maxNodes)
      throw new Error(
        `Graph coloring supports at most ${limits.maxNodes} nodes.`,
      );
    if (!Number.isInteger(numColors) || numColors < 1 || numColors > 4)
      throw new Error("Choose 1–4 colors.");
  } catch (error) {
    yield { ...errorSteps(error)[0], color, solutionCount };
    return;
  }
  const adj = nodes.map(() => []),
    indexes = new Map(nodes.map((node, i) => [node.id, i]));
  for (const edge of edges) {
    const u = indexes.get(edge.source),
      v = indexes.get(edge.target);
    adj[u].push(v);
    adj[v].push(u);
  }
  const checkBudget = () => {
    if (options.shouldCancel?.())
      throw { outcome: "cancelled", reason: "Search cancelled." };
    if (stepCount >= limits.maxSteps - 1)
      throw {
        outcome: "truncated",
        reason: `Step limit (${limits.maxSteps}) reached.`,
      };
    if (now() - started >= limits.maxMs)
      throw {
        outcome: "truncated",
        reason: `Time limit (${limits.maxMs}ms) reached.`,
      };
  };
  function* emit(status, explanation, event, markers = {}, extra = {}) {
    checkBudget();
    stepCount++;
    yield snapshot(status, explanation, event, markers, extra);
  }
  function* solve(v) {
    checkBudget();
    if (v === nodes.length) {
      solutionCount++;
      yield* emit(
        "Solution",
        `Valid coloring ${solutionCount} recorded.`,
        "solution",
        {},
        { solution: [...color] },
      );
      if (solutionCount >= limits.maxSolutions)
        throw {
          outcome: "truncated",
          reason: `Solution limit (${limits.maxSolutions}) reached.`,
        };
      return;
    }
    for (let c = 1; c <= numColors; c++) {
      yield* emit(
        "Checking",
        `Check color ${c} for node ${nodes[v].id}.`,
        "compare",
        { checking: [v] },
      );
      const conflict = adj[v].find((neighbor) => color[neighbor] === c);
      if (conflict !== undefined) {
        yield* emit(
          "Conflict",
          `Adjacent node ${nodes[conflict].id} already has color ${c}.`,
          "conflict",
          { checking: [v], attacking: [conflict] },
        );
        continue;
      }
      color[v] = c;
      yield* emit(
        "Coloring",
        `Assign color ${c} to node ${nodes[v].id}.`,
        "assign",
        { colored: [v] },
      );
      yield* solve(v + 1);
      color[v] = 0;
      yield* emit(
        "Backtracking",
        `Remove color from ${nodes[v].id} and explore alternatives.`,
        "backtrack",
        { backtracking: [v] },
      );
    }
  }
  try {
    yield* emit(
      "Start",
      `Enumerate colorings for ${nodes.length} nodes using ${numColors} colors.`,
      "start",
    );
    yield* solve(0);
    yield snapshot(
      "Done",
      solutionCount
        ? `Complete: ${solutionCount} valid colorings.`
        : "Unsatisfiable: no valid coloring exists.",
      "complete",
      {},
      { outcome: solutionCount ? "complete" : "unsatisfiable" },
    );
  } catch (stop) {
    if (!stop?.outcome) throw stop;
    yield snapshot(
      stop.outcome === "cancelled" ? "Cancelled" : "Truncated",
      `${stop.reason} Retained ${solutionCount} solutions.`,
      "complete",
      {},
      { outcome: stop.outcome },
    );
  }
}

/** Synchronous API for small test inputs; the browser uses the streaming worker. */
export function runGraphColoring(nodes, edges, colors, options) {
  const steps = [],
    solutions = [];
  for (const event of graphColoringEvents(nodes, edges, colors, options)) {
    if (event.solution) solutions.push(event.solution);
    const { solution: _solution, ...step } = event;
    steps.push(step);
  }
  return { steps, solutions, outcome: steps.at(-1)?.outcome };
}
export const buildGraphColoringSteps = (...args) =>
  runGraphColoring(...args).steps;
