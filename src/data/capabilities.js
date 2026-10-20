// A catalog entry is available only when it has a registered, dedicated view.
const groups = {
  array: [
    "bubble-sort",
    "selection-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
    "heap-sort",
    "shell-sort",
    "counting-sort",
    "radix-sort",
    "linear-search",
    "binary-search",
  ],
  structure: [
    "singly-linked-list",
    "doubly-linked-list",
    "circular-linked-list",
    "stack-array",
    "linear-queue",
    "circular-queue",
    "priority-queue",
    "queue-using-stacks",
    "binary-tree",
    "bst",
    "avl",
    "tree-traversal",
    "max-heap",
  ],
  graph: ["dijkstra", "bfs", "dfs", "prim", "kruskal"],
  queens: ["n-queens"],
  coloring: ["graph-coloring"],
  advanced: [
    "fractional-knapsack",
    "job-scheduling",
    "bellman-ford",
    "floyd-warshall",
    "string-matching",
    "rabin-karp",
  ],
};
export const capabilities = Object.freeze(
  Object.fromEntries(
    Object.entries(groups).flatMap(([view, slugs]) =>
      slugs.map((slug) => [slug, { view }]),
    ),
  ),
);
export const aliases = Object.freeze({
  "/sorting": "bubble-sort",
  "/searching": "linear-search",
  "/linked-list": "singly-linked-list",
  "/stack": "stack-array",
  "/queue": "linear-queue",
  "/trees": "binary-tree",
  "/graph": "bfs",
});
