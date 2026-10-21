# DSA Visualizer — Website Design and Redesign Instructions

Use this as the master design brief for the existing website. Apply it consistently to the algorithm catalog, shared navigation, and all 11 simulation pages. The intended result is a calm, spacious learning experience using the established blue, white, and soft gray palette.

## 1. Scope and implementation boundaries

The website already has a working simulation system. Improve its interface and educational presentation while preserving correct algorithms, routes, supported inputs, and existing useful functionality.

Supported pages:

- Searching: Linear Search and Binary Search.
- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort, Counting Sort, and Radix Sort.

Inspect the existing components, trace events, and state before editing. Reuse the current framework and shared components. Add a thin presentation adapter when existing events need clearer visual labels. Do not replace a working algorithm engine merely to simplify a new layout. If an algorithm has an actual correctness defect or lacks events needed for an honest visualization, identify it separately and make the smallest necessary correction.

Every displayed value, pointer, movement, code highlight, and explanation must come from the actual execution state. Cosmetic animation must never imply an operation that did not happen.

## 2. Design direction: spacious by default

Create room by showing fewer things at once, maintaining readable typography, and using consistent spacing.

- Make the visualization the strongest element on the page.
- Show the current explanation and playback controls alongside the visualization.
- Keep code optional. Start with code hidden; provide one clearly labeled “Show code” action.
- Keep execution history, advanced settings, variable watches, and detailed theory collapsed initially.
- Show no more than two important metrics initially. Place additional metrics under “Details.”
- Use white and light gray for most surfaces. Use saturated colors to direct attention to meaningful states.
- Keep ordinary page scrolling. Avoid independently scrolling cards within independently scrolling panels.
- Allow supporting content below the fold. Maintain the relationship between the visual state and its controls.
- Avoid filling empty space with badges, repeated headings, extra statistics, or decorative cards.

The default screen should let a beginner answer: What am I looking at? What is happening now? What can I do next?

## 3. Shared page structure

Keep these sections in the same order across all algorithm pages.

| Order | Section | Default behavior |
| --- | --- | --- |
| 1 | Navigation | A restrained header with a clear route back to the algorithm catalog. Keep the active algorithm identifiable. |
| 2 | Algorithm introduction | Algorithm name and one short sentence explaining its purpose. Avoid a large hero card. |
| 3 | Input summary | Briefly identify the current array, target, or chosen example. Use an “Edit input” action to reveal the full editor. |
| 4 | Visualization workspace | The main visual, a small contextual legend, and any algorithm-specific supporting lane required to understand the current operation. |
| 5 | Current-step explanation | A short statement describing the action and its reason. Keep this directly below the visual. |
| 6 | Playback | Previous, Play/Pause, Next, Reset, and a compact speed selector. Keep these attached to the workspace. |
| 7 | Optional learning tools | Show code, timeline navigation, history, and detailed metrics. Reveal these on demand. |
| 8 | Algorithm guide | Explanation, complexity, limitations, and useful examples below the main task. |

The input summary must expose essential prerequisites. Binary Search must visibly state that its input is sorted; the target must remain visible during a search.

On wide screens, enabling code may open a second column with approximately 60–65% of the width for the visual and 35–40% for code. Leave a 32px gap. Open the code below the visual whenever two columns would reduce readability. Do not force side-by-side panels at tablet widths.

## 4. Spacing and proportions

Treat these as shared starting tokens. Adjust an exceptional visualization without creating a separate design language.

| Element | Desktop | Mobile |
| --- | --- | --- |
| Main content width | Maximum 1200–1280px, centered | Available width |
| Page side padding | 32–48px | 16–20px |
| Space between major sections | 32–40px | 24–32px |
| Main workspace padding | 24–32px | 16–20px |
| Space between related elements | 12–16px | 12–16px |
| Gap between independent panels | 24–32px | 20–24px |
| Button/input height | 44px starting size | At least 44px project target |
| Main panel radius | 12–16px | 12–16px |
| Input/button radius | 8px | 8px |

Use a spacing scale of 4, 8, 12, 16, 24, 32, 40, 48, and 64px. Select larger values between unrelated sections and smaller values within a group.

Start simple array stages around 220–300px high on ordinary laptop screens, excluding controls and explanations. Let trees, merge buffers, and buckets expand as needed. The visual must have room for labels without making a simple array an oversized empty panel.

At a typical 1366 × 768 desktop viewport, aim to show the default visualization, current explanation, and Play control without scrolling. Achieve this through progressive disclosure and a restrained introduction. Preserve readable text when the available height is smaller.

## 5. Color system

Preserve existing equivalent brand tokens where available. Use the following values as the shared reference when tokens need to be standardized.

| Token | Reference | Role |
| --- | --- | --- |
| Primary | `#1760FF` | Primary action, keyboard focus, and selected navigation |
| Primary hover | `#124BD0` | Hover/pressed treatment for primary actions |
| Page background | `#F5F8FD` | Quiet overall background |
| Surface | `#FFFFFF` | Main workspace and revealed tools |
| Subtle blue | `#EDF4FF` | Current-step explanation and selected backgrounds |
| Main text | `#111E37` | Titles, values, and important labels |
| Secondary text | `#637189` | Supporting copy and metadata |
| Divider | `#E4EAF3` | Decorative grouping boundaries |
| Comparison accent | `#C75B0B` | Compared values; combine with a light orange background |
| Movement accent | `#D6424D` | Swap, shift, or write currently taking place |
| Completion accent | `#00846B` | Found target or values proven to be in their final positions |

Use muted blue for idle data and stronger blue for active boundaries or a chosen pivot. Use pale fills with dark text for chips. Color values are tokens, not blanket approval for every foreground/background pairing; check actual combinations.

Pair every important state with a label, marker, outline, shape, or text explanation. Distinguish “visited,” “discarded,” “partially ordered,” and “finished” explicitly. A partially sorted region or a completed digit pass must not appear fully sorted.

Use one subtle border around the main workspace. Avoid nested card borders, heavy shadows, inset shadows, patterned backgrounds, and large gradients on every surface. A restrained gradient on data bars is optional.

## 6. Typography and copy

- Use one existing readable sans-serif family across the website. Use one monospace family for code and compact numeric notation.
- Page title: 28–32px desktop and 24–28px mobile.
- Section title: 18–20px.
- Body copy and explanations: 15–16px with approximately 1.5–1.65 line height.
- Controls and labels: 14px.
- Code: 14–15px with approximately 1.6 line height.
- Secondary metadata: 12–13px. Essential values and controls must remain larger.
- Keep paragraphs to a comfortable reading width of approximately 60–70 characters.
- Use sentence case and plain English. Keep explanations to one or two short sentences.
- Write “Compare 42 and 18. Since 42 is larger, swap them next.” Avoid exposing internal event IDs or annotation comments.
- Use “Ready,” “Not started,” or “—” for absent state. Never expose internal sentinels such as index −1 as ordinary learner-facing status.

If content does not fit, reorganize or reveal it on demand before reducing the font size.

## 7. Shared interaction rules

Use the same position, order, icons, and labels for shared controls on every page.

- Load a valid, small example in a Ready state. Do not autoplay.
- Play becomes Pause while running. Completion offers Replay.
- Previous and Next move between meaningful learning events. Comparison and mutation should be distinguishable steps.
- Disable Previous at the first step and Next at the final step with clear visual and accessible states.
- Reset restores the current input and its initial simulation state.
- Show speed numerically, for example 0.5×, 1×, and 2×.
- Keep the input editor separate from playback. Require an explicit Apply action.
- Applying a new input pauses playback, clears pending animation, and starts a fresh run. Explain this beside Apply when relevant.
- Label inputs persistently. Show supported formats, limits, prerequisites, and inline errors without deleting entered values.
- Keep Randomize and presets in the input editor. Offer examples relevant to the chosen algorithm.
- Keep the exact code, explanation, counters, and data state synchronized when playing, stepping backward, resetting, or scrubbing.
- Label trace navigation “Step 8 of 42” when the total is known. A step percentage represents execution progress, not a percentage of sorted values.
- Preserve element identity for duplicate values so movements remain understandable.
- Keep the view stable during execution. Do not repeatedly jump the page, recenter a tree, or steal keyboard focus.

## 8. Algorithm-specific visualization requirements

Use the shared shell, spacing, typography, controls, and colors. Adapt the visual representation to what the algorithm actually does.

| Algorithm | Main representation | Required teaching detail |
| --- | --- | --- |
| Linear Search | A row of equal-size value cells with indexes | Keep the target visible. Move one current-index marker from left to right. Distinguish checked cells from the current candidate. Show found index or a clear not-found result. |
| Binary Search | Indexed cells with a visibly bounded active interval | Show target, low, mid, and high. Excluded ranges stay visible with subdued styling. Explain the comparison and the exact bound update. |
| Bubble Sort | Proportional bars or indexed cells | Compare adjacent elements, animate an actual exchange, and mark the settled suffix after each pass. Show early exit only when the implementation performs it. |
| Selection Sort | Indexed bars/cells with a current-minimum marker | Separate the scan pointer, chosen minimum, and destination position. The current minimum remains provisional until the selection step completes. |
| Insertion Sort | A sorted prefix, a lifted key, and a visible gap | Move the key into a holding lane, show larger values shifting, then insert the key. Do not turn every shift into an invented pairwise swap. |
| Merge Sort | Active subarray, left/right input lanes, and an output buffer | Show splitting, single-element base cases, recursive return, comparisons, buffer writes, and merging back into the parent range. |
| Quick Sort | Active partition with a clearly labeled pivot and boundary/pointer markers | Display the actual partition scheme and pivot strategy. Show recursive subranges and the reason for each movement. |
| Heap Sort | A heap tree linked to the indexed array | Highlight corresponding nodes/cells together. Show heap construction, sift-down, root extraction, shrinking heap boundary, and the completed output region. |
| Shell Sort | Indexed array with active gap-separated positions connected or marked | Show the current gap and active subsequence. Animate gapped insertion and gap changes. Gapped order must not be labeled as globally sorted. |
| Counting Sort | Input cells, a value-to-count table, and output cells | Show counting and reconstruction. If the implemented variant uses prefix sums and stable output placement, visualize those phases explicitly. |
| Radix Sort | Value cards with the current digit emphasized, plus buckets or digit-count/output lanes | Show each digit pass and stable redistribution. Preserve ordering within equal-digit groups. Mark the final array sorted only after all required passes. |

### Binary Search: required behavior

1. Keep the sorted input and target visible throughout the run.
2. If input is unsorted, identify the prerequisite and offer an explicit way to sort it. Do not silently rearrange values. Make clear whether returned indexes refer to the sorted input or preserved original positions.
3. Show low/mid/high as labeled pointers. Combine or stack labels when they share an index.
4. Highlight the tested midpoint before updating the range.
5. Explain the chosen side, for example: “37 is greater than 29. Discard indexes 0–3 and set low to 4.”
6. Keep excluded values legible. Use a boundary bracket or outline in addition to color.
7. Match the implementation's interval convention: inclusive or half-open. Keep code, markers, formulas, and empty-interval detection consistent.
8. With duplicates, state whether the implementation returns any match, the first match, or the last match.
9. Show one surviving search interval. Binary Search does not explore both halves after choosing a side.

### Divide-and-conquer: shared visual language

Use an optional recursion overview plus an uncluttered active-work area. The default view shows the current range, its parent context, and the work happening now. Keep inactive branches compact.

Represent each subproblem by its real index range, for example `array[0…7]`. Show the split, base case, recursive return, and combination or partition result when those phases apply. Make the active branch clear without showing an entire expanded tree by default. Put a full recursion overview behind “Show recursion.”

For Merge Sort, reveal the two sorted input halves and the output buffer during merging. Explain why the next value comes from the left or right lane. Show equal-value tie handling according to the actual implementation. Distinguish copying/writing from swapping.

For Quick Sort, name the implemented partition approach in the algorithm guide. Lomuto, Hoare, and three-way partitioning have different pointer behavior and guarantees. Mark a pivot as permanently placed only when the implemented scheme guarantees that position. Show genuinely unbalanced recursion when it occurs; do not draw an artificially balanced tree.

Counting Sort and Radix Sort use distribution/counting views. Heap Sort needs heap structure. Do not force these algorithms into the recursion presentation used for Merge Sort.

## 9. Data accuracy, scale, and metrics

- Positive bars must share a consistent scale and baseline. Do not cap individual heights in ways that make different values appear equal.
- Preserve a common scale across subarrays that are being compared. Explain any deliberate scale change.
- If negatives are supported, use a meaningful zero baseline or a representation that makes signed values clear. Otherwise validate that restriction explicitly.
- Keep zero visible through its value label and baseline marker without giving it a misleading positive height.
- Count actual operations. Prefer algorithm-relevant metrics: comparisons and swaps for exchange sorts; comparisons and writes for merge-based work; shifts for insertion-based work; comparisons and remaining interval for Binary Search.
- The two default metrics may differ between algorithms, but their placement and typography stay consistent.
- Counting Sort needs a readable strategy for wide value ranges. Preserve supported inputs; summarize empty ranges or offer horizontal navigation rather than creating thousands of tiny cells.
- Radix Sort must explain its supported number domain and digit/base convention. Decimal leading zeros may be shown as alignment aids, clearly distinguished from changes to input values.
- Use placeholders for output positions not yet written. Do not initialize them visually as real zero-valued results.

## 10. Code, history, and detailed learning

Code is available on demand, with pseudocode and existing language options in one panel. Show one language at a time. Highlight only the lines responsible for the current event. Remove trace annotations and duplicated internal comments from learner-facing code.

Keep variable watches optional. Use names matching the shown code and explain zero-based indexing where relevant.

History is collapsed initially. When opened, show compact, selectable rows around the current step and an option to reveal the full history. Keep the current explanation visible independently of browsing history. Avoid tall cards for one-line events.

The algorithm guide explains prerequisites, the core idea, complexity of the implemented variant, and limitations. Keep long explanations below the simulation. Do not turn the main workspace into a textbook page.

## 11. Catalog and navigation

Use the same colors, spacing, and typography on the rest of the website.

- Group the catalog into Searching and Sorting.
- Use a quiet grid: up to three columns on desktop, two on tablets, one on mobile. Allow 24–32px between cards.
- Each algorithm card needs a name, one-sentence purpose, and one clear action.
- Put difficulty or complexity in restrained secondary text where useful. Avoid stacking multiple badge rows.
- Keep a consistent path back to the catalog. If a sidebar exists, collapse it on narrow screens and keep it visually secondary.
- Preserve existing routes and working navigation.

## 12. Responsive behavior and accessibility

Stack the visual, explanation, playback, and optional code in that order on narrow screens. Wrap controls into understandable groups. Do not squeeze the desktop toolbar into unreadable icon-only controls.

Use horizontal scrolling only for content that genuinely needs it, such as long arrays or wide code. Keep the page itself within the viewport. For trees and recursion diagrams, provide labeled zoom/fit controls when needed and a useful focused view by default.

Use real buttons, labeled fields, visible keyboard focus, logical focus order, and accessible selected/disabled states. Support keyboard operation and 200% zoom. Do not rely on hover or color alone.

Meet WCAG contrast requirements for actual rendered pairings: at least 4.5:1 for normal text, 3:1 for qualifying large text, and 3:1 for meaningful graphical/component state information against adjacent colors. Decorative dividers are a different case; they must not be the sole cue identifying an input or state.

Respect reduced-motion preferences. Playback should preserve understanding when movement is removed. Provide a concise text equivalent for the current visual state. Avoid announcing every frame to assistive technology at high playback speed.

Scope simulation shortcuts to the focused workspace. If using global character shortcuts such as R or ?, provide a way to disable or remap them. Never intercept typing in input fields or normal keyboard operation of controls.

## 13. Motion

Use approximately 200–350ms for small position transitions as a starting point. Keep operation pacing independently controllable with the speed selector. Let learners distinguish comparison, movement, and settlement.

Animate changes that teach: exchanging items, narrowing a range, moving a key, splitting a range, writing a merge output, extracting a heap root, or redistributing a digit pass. Keep navigation, panels, labels, and counters visually steady. Avoid bouncing, decorative page transitions, and flashing entire panels.

## 14. Implementation sequence and acceptance checks

First define shared tokens and reusable page components. Apply the shared shell to one simple sorting page and one searching page. Resolve Binary Search and Merge Sort visualization requirements before migrating the remaining pages. Reuse the resulting components instead of copying page-specific spacing rules.

For every page, verify:

- The visualization is the primary focus and the default view feels spacious.
- Playback and the current explanation are easy to find together.
- Code, history, advanced settings, and detailed metrics remain available on demand.
- The correct algorithm-specific representation is present.
- Labels, code, pointers, values, explanations, and counters agree at each step.
- Play, pause, previous, next, reset, replay, speed changes, and input application behave correctly.
- Reversing and replaying a run preserves stable element identity and accurate state.
- Appropriate cases work: one item and empty input if already supported, duplicates, zeros, sorted/reverse input, and minimum/maximum supported size.
- Search covers targets at both ends, missing targets, duplicate-match policy, and Binary Search prerequisites.
- Merge and Quick Sort expose their real divide-and-conquer process; their visuals are not merely ordinary bar swapping.
- The layout remains readable around 1440px, 1366px, 1024px, 768px, and 390px widths, and at increased zoom.
- Existing algorithm behavior and routes remain intact except for separately identified correctness fixes.

When presenting the completed redesign, explain what changed visually, which algorithm representations improved, what was verified, and any remaining verification limits. Do not describe untested behavior as confirmed.

## Accessibility references

- [W3C: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C: Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)
