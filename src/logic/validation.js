/** Shared browser/builder input contracts. All limits are enforced before generation. */
export const LIMITS = Object.freeze({
  array: 20,
  list: 16,
  tree: 31,
  graphNodes: 16,
  graphEdges: 80,
  value: 9999,
  weight: 9999,
});

export function validateNumbers(
  values,
  {
    min = 0,
    max = LIMITS.value,
    maxCount = LIMITS.array,
    integer = true,
    allowEmpty = true,
  } = {},
) {
  if (!Array.isArray(values) || (!allowEmpty && !values.length))
    throw new Error("Enter at least one number.");
  if (values.length > maxCount)
    throw new Error(`Enter at most ${maxCount} numbers.`);
  for (const value of values) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (integer && !Number.isSafeInteger(value))
    )
      throw new Error(`Enter finite ${integer ? "integers" : "numbers"} only.`);
    if (value < min || value > max)
      throw new Error(`Values must be between ${min} and ${max}.`);
  }
  return values;
}

export function parseNumbers(input, options = {}) {
  const tokens = String(input)
    .trim()
    .split(/[,\s]+/)
    .filter(Boolean);
  if (!tokens.length) throw new Error("Enter at least one number.");
  const integer = options.integer ?? true;
  const pattern = integer
    ? /^[+-]?\d+$/
    : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  if (tokens.some((token) => !pattern.test(token)))
    throw new Error(
      `Use comma or space separated ${integer ? "integers" : "numbers"}; every value must be valid.`,
    );
  return validateNumbers(tokens.map(Number), { ...options, allowEmpty: false });
}

export function parseNumber(input, options = {}) {
  return parseNumbers(input, { ...options, maxCount: 1 })[0];
}

/** Simple graph policy: unique IDs, no self-loops, no parallel undirected edges. */
export function validateGraph(
  nodes,
  edges,
  {
    weighted = true,
    nonnegative = false,
    startId,
    endId,
    directed = false,
  } = {},
) {
  if (!Array.isArray(nodes) || !Array.isArray(edges))
    throw new Error("Provide nodes and edges.");
  if (!nodes.length || nodes.length > LIMITS.graphNodes)
    throw new Error(`Use 1–${LIMITS.graphNodes} nodes.`);
  if (edges.length > LIMITS.graphEdges)
    throw new Error(`Use at most ${LIMITS.graphEdges} edges.`);
  const ids = new Set();
  for (const node of nodes) {
    if (
      !node ||
      typeof node.id !== "string" ||
      !/^[A-Za-z0-9_-]{1,16}$/.test(node.id) ||
      ["__proto__", "constructor", "prototype"].includes(node.id)
    )
      throw new Error(
        "Node IDs must contain 1–16 letters, digits, underscores or hyphens.",
      );
    if (ids.has(node.id)) throw new Error(`Duplicate node ID: ${node.id}.`);
    ids.add(node.id);
  }
  if (startId !== undefined && !ids.has(startId))
    throw new Error("Start node not found. Choose an existing node.");
  if (endId !== undefined && !ids.has(endId))
    throw new Error("Destination node not found. Choose an existing node.");
  const pairs = new Set();
  for (const edge of edges) {
    if (!edge || !ids.has(edge.source) || !ids.has(edge.target))
      throw new Error("Every edge endpoint must exist.");
    if (edge.source === edge.target)
      throw new Error("Self-loops are not supported.");
    const pair = JSON.stringify(
      directed ? [edge.source, edge.target] : [edge.source, edge.target].sort(),
    );
    if (pairs.has(pair)) throw new Error("Parallel edges are not supported.");
    pairs.add(pair);
    if (
      weighted &&
      (typeof edge.weight !== "number" ||
        !Number.isFinite(edge.weight) ||
        Math.abs(edge.weight) > LIMITS.weight)
    )
      throw new Error(
        `Edge weights must be finite numbers from -${LIMITS.weight} to ${LIMITS.weight}.`,
      );
    if (weighted && nonnegative && edge.weight < 0)
      throw new Error("Dijkstra requires nonnegative edge weights.");
  }
  return { ids };
}

export const errorSteps = (error) => [
  {
    status: "Error",
    outcome: "invalid",
    explanation: error instanceof Error ? error.message : String(error),
    markers: { success: false },
    event: "invalid",
  },
];

/** Coordinates deliberately excluded: moving a node does not change a run's topology. */
export function topologyKey(nodes, edges) {
  return JSON.stringify({
    nodes: nodes.map((n) => n.id),
    edges: edges
      .map(({ source, target, weight }) => [source, target, weight])
      .sort(),
  });
}

export function reconcileEndpoints(nodes, start, end) {
  const ids = nodes.map((n) => n.id);
  return {
    start: ids.includes(start) ? start : (ids[0] ?? ""),
    end: ids.includes(end) ? end : (ids.at(-1) ?? ""),
  };
}
