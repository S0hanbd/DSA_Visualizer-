import { Link } from "react-router-dom";
export default function GuidePage() {
  return (
    <article className="neo-panel mx-auto my-8 w-full max-w-4xl p-6 sm:p-10 space-y-6">
      <h1 className="text-4xl font-black">DSA Visualizer usage guide</h1>
      <p>
        Choose an algorithm from the catalog, sidebar, or Choose visualization
        menu. All 37 catalog entries have dedicated simulations.
      </p>
      <h2 className="text-2xl font-black">Playback and live models</h2>
      <p>
        Sorting and searching use a focused workspace. Edit input reveals draft
        values and presets; Apply input starts a paused run. Binary Search needs
        ascending input, with an explicit Sort and apply action. Code, History,
        Details, and the algorithm guide open on demand. Playback offers 0.5× to
        4× speed, Reset, and Replay on completion.
      </p>
      <p>
        An operation commits only when it finishes or you press Finish
        operation. Cancel operation restores the previous live model. Paused
        operations cannot start another mutation. Previous, Next, Reset playback
        and execution-step selection replay the timeline; Return to live enables
        new operations. Clear model is a separate action.
      </p>
      <h2 className="text-2xl font-black">Inputs and limits</h2>
      <p>
        Arrays accept 2–20 integers from 1 to 999. Lists accept up to 16 values
        and trees up to 31; values are integers 0–9999. Stack/array queue
        capacity is 10; two-stack queues hold six items total; priority queues
        and heaps hold 15. Empty tokens never insert zero. Invalid tokens and
        excessive input are rejected.
      </p>
      <h2 className="text-2xl font-black">Graph editors</h2>
      <p>
        These demonstrate simple undirected graphs with unique node IDs, no
        parallel edges, and no self-loops. Use Add node without a mouse, enter
        source/target IDs and weights to add edges, or drag nodes. Focus a node
        and use arrow keys to move it. Dijkstra accepts nonnegative weights. BFS
        finds minimum edge-count paths; DFS finds a path without a shortest-path
        guarantee. Directed negative-weight algorithms use their own JSON input
        pages.
      </p>
      <h2 className="text-2xl font-black">Graph coloring and backtracking</h2>
      <p>
        Run search starts a cancellable worker; moving nodes preserves the run.
        Limits are 10 nodes, 200 solutions, 12,000 recorded steps and 1500ms. A
        truncated or cancelled search is partial. Unsatisfiable means the search
        completed with no valid coloring. N-Queens enumerates all solutions for
        sizes 4, 5 and 6.
      </p>
      <h2 className="text-2xl font-black">
        Greedy, directed graph and string examples
      </h2>
      <p>
        Edit the documented JSON example. Use up to 12 items/jobs, eight graph
        nodes with 32 edges, or ASCII text of 200 characters and a pattern of
        80. String matching includes overlaps; an empty pattern matches every
        boundary. Negative-cycle-affected distances are marked −∞ and
        unreachable distances are ∞.
      </p>
      <p>
        Educational C++ source uses named event anchors. Presentation-only steps
        show a source overview. Complexity cards describe the displayed
        algorithm; the application also retains bounded snapshots for teaching.
      </p>
      <Link className="primary-button" to="/">
        Browse algorithms
      </Link>
    </article>
  );
}
