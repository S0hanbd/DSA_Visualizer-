# DSA Visualizer

An interactive React learning lab with **37 implemented algorithm/data-structure entries across 11 topics**, step-by-step playback, educational C++ source, live state explanations, graph editors, and light/dark themes.

[Usage guide](docs/usage.md) · [Remediation report](docs/remediation-status.md) · [Architecture](docs/architecture.md) · [Quality workflow](https://github.com/S0hanbd/DSA_Visualizer-/actions/workflows/quality.yml)

The saved [UI/UX design guide](docs/DSA_UI_UX_Design_Guide.md) informs the shared sorting and searching workspace. See [redesign notes](docs/array-redesign.md) for component reuse, algorithm-specific views, and verification.

## What you can do

- Build and edit data structures, then follow individual operations with play, pause, step, Finish and Cancel controls.
- Inspect algorithm-specific state: array bounds and temporary buffers, linked-list pointer changes, AVL rotations, graph distances, spanning forests and backtracking solutions.
- Compare each simulation with educational C++ and highlights for executable events; presentation-only steps show a source overview.
- Read worst-case **Time Complexity** and **Space Complexity** for every algorithm, with an explanation of both costs, the operation being measured and the meaning of each variable. Best/average-case cards are omitted.
- Navigate on mobile or desktop, use keyboard graph controls and execution-step selection, and choose light/dark themes with reduced-motion support.

The application runs entirely in the browser. No backend, database or account is required. The stack is React 18, Vite 6, React Router 7, Tailwind CSS 4 and Framer Motion.

## Run locally

Use **Node 24 LTS** (or Node 22.13+; Node 25 is outside the tested range) and npm 10–12. The checked-in lockfile is the reproducible dependency source. On Windows PowerShell, use npm.cmd if execution policy blocks npm.ps1.

```sh
git clone https://github.com/S0hanbd/DSA_Visualizer-.git
cd DSA_Visualizer-
npm ci
npm start
```

Open http://127.0.0.1:5173. The development server binds to loopback.

To review the audit-remediation branch before it is merged:

```sh
git switch remediation/diagnostic-audit
npm ci
```

For a local production preview:

```sh
npm run build
npm run preview
```

## Available simulations

- Sorting: bubble, selection, insertion, bottom-up merge, quick, heap, shell, counting, radix.
- Searching: linear and binary (ascending input is required; **Sort and apply** explicitly prepares unsorted input).
- Structures: singly/doubly/circular linked lists, stack, linear/circular queues, min/max priority queue, two-stack queue.
- Trees: binary tree using BST construction, BST, AVL, inorder/preorder/postorder/level-order traversal, max heap.
- Undirected graphs: BFS, DFS, Dijkstra, Prim, Kruskal. Disconnected results are explained.
- Greedy: fractional knapsack and deterministic unit-time profit/deadline scheduling.
- Directed shortest paths: Bellman-Ford and Floyd-Warshall, including negative-cycle handling.
- Strings: naive matching and Rabin-Karp, including overlaps, empty patterns and collision verification.
- Backtracking: N-Queens and bounded graph coloring in a cancellable worker.

## Playback rules

Operations commit their final model when playback reaches completion or **Finish operation** is selected. **Cancel operation** restores the previously committed model. Paused operations cannot start another mutation. Timeline selection, Previous, Next and Reset playback are read-only replay; use **Return to live** before changing the model. **Clear model** is distinct from resetting playback. Navigating to another route starts a fresh local workspace.

## Inputs and limits

| Input                     | Contract                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sorting/search array      | 2–20 integers from 1 to 999                                                                                           |
| List / tree values        | Integers 0–9999; at most 16 list nodes / 31 tree nodes                                                                |
| Stack / array queues      | Capacity 10; linear queue does not reuse exhausted rear slots                                                         |
| Two-stack queue           | Capacity six across both stacks                                                                                       |
| Priority queue / max heap | Capacity 15; clear before switching min/max mode                                                                      |
| Graph editor              | 1–16 unique IDs, up to 80 edges; simple undirected graph; weights within ±9999; Dijkstra requires nonnegative weights |
| Graph coloring            | Up to ten nodes, four colors, 200 solutions, 12,000 steps, 1500ms; partial outcomes clearly marked                    |
| Directed shortest paths   | Up to eight nodes and 32 directed edges; finite weights within ±9999                                                  |
| Greedy inputs             | Up to 12 items/jobs; positive item weights, nonnegative capacity/value/profit, integer job deadlines 1–20             |
| String matching           | ASCII text ≤200 / pattern ≤80 characters; empty pattern matches every boundary                                        |

Malformed, fractional integer tokens and excessive inputs are rejected. Empty delimiter tokens never insert zero. Graph inputs reject self-loops, parallel edges and missing endpoints. Node coordinates do not invalidate a computed run; topology changes do.

## Validation commands

```sh
npm test                 # Algorithm, state-machine, regression and seeded invariant checks
npm run lint             # ESLint, Hooks and unused-variable checks
npm run typecheck        # Strict shared TypeScript playback contracts
npm run build            # Production bundle in dist/
npm run check            # Lint + types + tests + build
npx playwright install chromium
npm run test:e2e         # Chromium routes, playback, worker, responsive and axe checks
npm run audit:check      # Full dependency tree; any advisory or registry error fails
npm run check:cpp        # C++17 compilation/result checks; requires g++ or CXX
node scripts/bundle-report.js
```

The UI/builders are primarily JavaScript; the type check covers the strict shared transaction contract, while tests cover runtime algorithm invariants. Chromium is the local browser target; Firefox/Safari have not been exercised. Tailwind 4 requires modern browsers (Chrome 111+, Safari 16.4+, Firefox 128+).

The GitHub workflow runs reproducible installation, quality checks, C++ checks, dependency audit and browser tests. CI failures are not suppressed. A local C++ compiler is optional for running the app, but the compiler check must pass in CI.

## Latest local verification

Recorded on **21 October 2026** for the audit-remediation changes. These results describe the local checkout; consult the [GitHub workflow](https://github.com/S0hanbd/DSA_Visualizer-/actions/workflows/quality.yml) for remote CI results.

| Check | Result |
| --- | --- |
| `npm run check` | Passed: lint, shared playback types, 30 Node tests and production build |
| Algorithm/invariant coverage | 900 seeded sorting cases; 1,700 structure operations; sequential AVL height/balance checks; N-Queens counts 2/10/4 |
| `npm run test:e2e` | Initial full suite: 10 Chromium tests passed. Complexity follow-up: 3 focused tests passed, checking two explained cards on all 37 routes plus aliases, responsive layouts, storage denial and light/dark accessibility |
| `npm run audit:check` | 0 dependency findings, down from 18 in the baseline audit |
| Initial homepage JavaScript | 389.61 kB / 126.05 kB gzip including the new complexity explanations, down from 1,269.48 / 402.37 kB |
| Production CSS | 99.81 kB / 15.92 kB gzip, up from 81.94 / 13.53 kB |

No C++ compiler is installed locally. The [published remediation workflow](https://github.com/S0hanbd/DSA_Visualizer-/actions/runs/39515738478) passed its C++ gate (37 displayed sources and result assertions for 19 variants), quality checks and browser suite. Follow-up revisions must pass their own workflow. Browser checks cover Chromium; they are smoke checks rather than complete accessibility or cross-browser certification.

See the [complexity guide](docs/complexity-guide.md), [per-finding tracker](docs/remediation-status.md), [dependency migration notes](docs/security-and-migrations.md), [bundle measurements](docs/bundle-final.json) and [PR summary](docs/PR_SUMMARY.md) for scope, evidence and remaining verification.

## Project layout

- src/logic: pure validated builders and transaction reducer.
- src/pages and src/components: route composition, controls and visualizations.
- src/data: catalog and educational source/event anchors.
- src/workers: cancellable bounded backtracking worker.
- tests and e2e: deterministic logic/invariant and browser regressions.
- docs: remediation tracker, architecture, dependency evidence and bundle measurements.
- inspiration: archived standalone HTML references; not production routes.

The Vercel configuration explicitly installs development dependencies, runs npm run build, and serves dist with SPA deep-link rewrites. Generated build output, installed packages and browser/cache artifacts are ignored by Git. Review and merge the remediation branch before deploying; publishing a branch does not merge it or authorize a manual deployment.

Usage guidance is available at `/guide` in the running app and in the [usage guide](docs/usage.md). For design tokens/component demos, visit `/design`.

## Builders and license

Sohanur Rahman Sohan, Sifatul Islam, and Robiul Haque Rhythm. MIT license; see LICENSE.
