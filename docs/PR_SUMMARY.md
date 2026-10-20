# Remediate DSA Visualizer algorithm, playback, security and accessibility defects

Invalid Dijkstra endpoints could hang the browser, fractional counting-sort input could crash rendering, graph coloring could allocate unbounded histories, and stale AVL snapshots could corrupt later balancing. Validated builders, guarded reconstruction, bounded cancellable workers and independent final models correct these failures. Stateful operations now commit on completion or Finish; Cancel restores the prior model and replay cannot mutate it.

## Changes

- B1–B14: graph/numeric contracts, AVL, dependency updates, aliases, zoom, graph invalidation/forest reporting, shared playback transactions and guarded theme storage.
- M1–M8: six new algorithms; aligned source/events, linked-pointer stages, traversal/bounds/buffers and metrics; strict inputs, keyboard selection, responsive navigation and usage documentation.
- A1–A9: shared stateful workspace, lazy routes/highlighter, bounded mounted history, verified legacy cleanup, corrected styling, compact/capped trees, lifecycle cleanup, build hygiene and archived prototypes with corrected counters.
- Complexity follow-up: all 37 pages now show only worst-case Time Complexity and Space Complexity, each with reasons, operation scope and variable definitions. Catalog and showcase follow the same convention.
- Reproducible CI gates, dependency policy, regression/browser suites and raw audit/bundle evidence. Per-finding details: [remediation-status.md](remediation-status.md).

## Validation

- Clean `npm ci`; `npm run check` passes lint, strict playback type checks, 30 Node tests and production build.
- Tests include 900 seeded sorts, 1,700 structure operations, sequential AVL invariants, all six new algorithms, intermediate/source checks and N-Queens counts 2/10/4.
- `npm run test:e2e`: ten Chromium tests pass, covering 37 routes/all aliases, playback/route lifecycle, worker cancellation/budgets, denied storage, reduced motion, viewport and axe smoke. Windows sandbox helper teardown required scoped cleanup after assertions.
- Complexity follow-up: three focused Chromium tests pass, asserting two explained cards across all 37 routes and checking responsive, light/dark axe and storage-denial behavior; `npm run check` still passes.
- `npm run audit:check`: 18 affected package entries reduced to zero; Tailwind 4 migration separately validated; no suppressed advisories.
- Homepage JavaScript after the complexity-card follow-up: 1,269.48 → 389.61 kB, gzip 402.37 → 126.05 kB. CSS: 81.94 → 99.81 kB. No large-chunk warning.
- Diff whitespace checks pass. Original user audit preserved; generated output ignored.

## Review and release limits

The GitHub plugin is unconnected, but publishing used Git and the public API confirmed the [original remediation workflow](https://github.com/S0hanbd/DSA_Visualizer-/actions/runs/39515738478) passed quality, C++17 compilation/result checks and browser tests. No local C++ compiler is installed; follow-up source changes require their own CI result. Chromium and Node 24 were exercised locally; strict types cover the shared transaction reducer rather than all JavaScript. Tailwind 4 requires the documented modern browser baseline.

Vercel explicitly builds from source with development dependencies. Three original dist files are removed from Git tracking; regenerated output remains on disk and ignored. Review the deployment contract before release. This summary is prepared for branch publication; merging and deployment remain user actions.
