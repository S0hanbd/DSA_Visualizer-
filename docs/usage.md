# Using the visualizer

Start with `npm start`, then open the local URL. Browse the catalog, filter/search by title or category, use the desktop sidebar, or choose an algorithm from the mobile navigation menu. The app's `/guide` route contains this guidance within the product.

## Stateful structures

Enter a complete integer or a comma/space separated batch. Invalid tokens, out-of-range values and excessive model sizes are rejected. Lists provide insertion at head/tail/index, search, deletion and traversal; doubly linked lists also traverse backward. Trees provide insertion plus all four traversal orders. The Binary Tree route explicitly builds by BST rules.

Operations start as pending transactions. Finish commits immediately; otherwise reaching the final step commits once. Pause and selecting an earlier step leave the operation pending. Cancel restores the live model from before the operation. Earlier completed timelines are read-only; Return to live enables mutations. Reset playback never clears the model. Use Clear model for that purpose.

## Graphs

Choose an example or use Add node and the source/target/weight fields. Graphs are undirected and simple: self-loops and parallel edges are rejected. Dijkstra needs nonnegative weights. Focus a graph node and use arrow keys to reposition it. Position changes preserve valid runs; node/edge changes invalidate them. Endpoint selections reconcile after example changes. Prim reports the start component if disconnected; Kruskal reports a minimum spanning forest.

Graph coloring begins only with Run search. The worker can be cancelled and has explicit node/time/step/solution budgets. Complete means all possibilities were explored, unsatisfiable means a complete search found no coloring, and truncated/cancelled means only partial results. Solutions are paged; execution histories provide a keyboard-operable step selector.

## Greedy, directed paths and strings

These pages provide an editable JSON example with exactly the expected field names. Fractional knapsack requires positive weights and allows partial items. Job scheduling uses unit-duration jobs, integer deadlines and input-order ties. Directed graph pages accept node IDs and `{source, target, weight}` edges; Bellman-Ford also needs `start`. Negative-cycle-affected paths are marked −∞ and unreachable paths ∞. String pages take `text` and `pattern`, support ASCII and overlapping matches, and treat an empty pattern as matching every boundary. Rabin-Karp verifies characters after hash matches.

The README lists every input/model limit. Source highlighting identifies named executable events; presentation-only snapshots show an overview. Complexity excludes the application's bounded teaching history. Theme persistence is optional: a denied storage write does not prevent changing themes in memory.
