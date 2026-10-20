# Simulation contracts

`src/logic` contains pure algorithm builders. No builder should mutate caller-owned models. Validation is enforced by builders as well as forms. The shared number contract accepts complete integer tokens, drops empty delimiter tokens before conversion, rejects malformed/out-of-range/excessive input, and never silently truncates values. Graph weights may be finite decimals within ±9999; Dijkstra further requires nonnegative weights.

## Transactions and replay

`playbackState.ts` is a strict generic reducer; `usePlayback` owns its timer and cleanup. Stateful visualizers share `StructurePage` and `PlaybackControls`. The transaction has a previously committed model, immutable presentation steps, and an independently computed pending final model.

1. Begin is accepted only at the latest completed state.
2. Reaching the final step or Finish atomically commits the final model once.
3. Pause and step navigation retain the pending transaction; they cannot enable mutations.
4. Cancel restores the previous committed model and removes the pending timeline.
5. Earlier completed snapshots are read-only. Return to live selects the latest completed state.
6. Reset playback only changes the cursor. Clear model is separate and available only at live state.
7. A route change unmounts the workspace, clearing its timer. Models are local to a route session rather than persisted across navigation.

`TimelineStep` documents shared metadata, while arrays/lists, tree layouts, queue pointers and other algorithms retain distinct payloads. The strict type check currently covers the shared TypeScript transaction contract; the remaining UI/builders are JavaScript with JSDoc plus invariant tests, not a claim of full application type safety.

## Backtracking workers and retained history

Graph coloring uses a topology key containing node IDs and edges, deliberately excluding coordinates. Topology/color changes cancel and invalidate a run; dragging or keyboard-position edits preserve it. A new explicit Run search creates a worker and version ID. Obsolete messages are ignored, handlers are removed on cleanup, and workers are terminated on cancellation/unmount.

The generator streams at most 100 events per batch, 12,000 retained steps, 200 separately stored solutions, ten nodes, and 1500ms of wall time. It distinguishes complete, truncated, cancelled, invalid and unsatisfiable. Steps store only a solution count. The execution panel mounts a window of at most 41 rows, and coloring solutions are paged eight at a time. Search budgets are teaching limits, not textbook algorithm bounds.

N-Queens has the bounded 4/5/6 board-size choices. The known complete solution counts are tested. Tree input is capped at 31 nodes, and inorder-rank layout grows linearly in width. Traversals reuse an immutable layout; heap node IDs remain stable through swaps.

## Source and metrics

Educational source lives in `educationalCode.js` and `graphSource.js`; legacy snippets that remain in the catalog have centralized statement mappings. Named anchors identify executable events. Presentation-only snapshots explicitly display a source overview rather than inventing a highlighted statement. Source assertions check selected semantics and every event produced by the six newer algorithms. `scripts/check-cpp.js` compiles all displayed examples and executes result assertions when a C++17 compiler is available.

Comparisons count value comparisons; swaps count exchanges; shifts are separate. Merge records input-array writes. Counting/radix are non-comparison algorithms: their comparison counter stays zero, input reads count values processed in frequency/reconstruction passes, and writes count mutations to count/output/input arrays after initialization. Heap comparisons count actual existing-child comparisons. Advanced algorithms provide appropriate metrics such as relaxations and verified hash collisions. Allocation/initialization and snapshot/layout/rendering costs are excluded from textbook counters.

Complexity metadata describes the displayed algorithm variant. The application additionally retains bounded snapshots and DOM state; this overhead is separate from textbook auxiliary space. Graph editors demonstrate simple undirected graphs; Bellman-Ford/Floyd-Warshall use separate directed inputs. A two-stack queue's capacity is six total items, including both stacks. Binary Tree explicitly states that construction uses BST insertion.
