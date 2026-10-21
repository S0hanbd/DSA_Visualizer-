# Sorting and Searching Workspace

The sorting and searching routes share one learning workspace built around the existing simulation step generators. The redesign follows [`DSA_UI_UX_Design_Guide.md`](DSA_UI_UX_Design_Guide.md) and keeps algorithm state, playback, code, history, and supporting material in a consistent order.

## Shared structure

- `AlgorithmPage` owns input validation, playback state, optional panels, and the common page layout.
- `ArrayStage` selects an algorithm-specific representation from the current simulation snapshot.
- `arrayPresentation` converts existing snapshots into stable display identities and derived presentation data without changing algorithm state.
- `PlaybackBar`, `ExecutionSteps`, `StatsPanel`, and `CodeViewerContent` expose reusable variants while retaining their existing behavior on other routes.
- `arrayLearning` stores each algorithm's purpose, exact variant, limitations, pseudocode, and presets.

The initial view emphasizes the visualization, current explanation, two meaningful metrics, and playback controls. Code, execution history, and the full complexity guide remain available through explicit disclosure controls.

## Algorithm-specific representations

| Algorithms | Representation |
| --- | --- |
| Linear search | Indexed cells showing the current, checked, and found positions |
| Binary search | Sorted indexed cells with low, mid, and high pointers plus the active interval |
| Bubble, selection, quick | Proportional bars with algorithm-specific pointers and partition context |
| Insertion, shell | A held key and visible insertion gap |
| Merge | Left and right input lanes with a separate output lane |
| Heap | Linked heap tree synchronized with its indexed array |
| Counting | Count table and output positions alongside the input |
| Radix | Active digit emphasis with count and output buffers |

Duplicate values keep stable occurrence identities so movement remains understandable. The adapter uses the generated steps as its source of truth and never reruns an algorithm for display purposes.

## Input and playback behavior

- Input changes remain drafts until **Apply input** is selected.
- Binary search requires sorted data and offers an explicit **Sort and apply** action.
- Search targets remain visible while the input editor is collapsed.
- Every route supports Previous, Play/Pause or Replay, Next, Reset, Random array, and a working 0.5x–4x speed control.
- Reaching the final step changes Play to Replay.

## Verification

The unit suite checks presentation identity and state derivation across all sorting algorithms, including duplicates, reverse-ordered input, maximum supported input sizes, and heap completion timing. The Playwright suite covers all eleven sorting/searching routes at desktop, tablet, and mobile widths; algorithm-specific intermediate states; binary-search validation; keyboard use; dark mode; 200% zoom; and automated accessibility checks.
