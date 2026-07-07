import { buildBubbleSortSteps } from "./bubbleSortSimulation.js";

const sortedIndexes = (length) => Array.from({ length }, (_, index) => index);

const makeStep = ({
  array,
  line = 1,
  pass = 1,
  index = 0,
  comparisons = 0,
  swaps = 0,
  explanation,
  status,
  comparing = [],
  swapping = [],
  sorted = [],
  structure = "array",
  markers = {},
}) => ({
  array,
  line,
  pass,
  index,
  comparisons,
  swaps,
  explanation,
  status,
  comparing,
  swapping,
  sorted,
  structure,
  markers,
});

export function buildSelectionSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let cmp = 0;
  let swaps = 0;

  const pushStep = (line, desc, status, pass, index, extra) => {
    const sortedUpTo = extra?.sortedUpTo ?? 0;
    steps.push({
      array: [...arr],
      line,
      explanation: desc,
      status,
      pass,
      index,
      comparisons: cmp,
      swaps,
      comparing: extra?.compareIdx !== undefined && extra.compareIdx !== null ? [extra.compareIdx] : [],
      minIdx: extra?.minIdx ?? null,
      swapping: extra?.swapIdx ?? [],
      sorted: Array.from({ length: sortedUpTo }, (_, k) => k),
    });
  };

  pushStep(1, "Starting selection sort.", "Ready", 0, -1, { sortedUpTo: 0 });

  for (let i = 0; i < n - 1; i++) {
    pushStep(2, `Beginning pass ${i + 1}: find the minimum in the unsorted part of the array.`, "Start Pass", i + 1, i, { sortedUpTo: i, minIdx: i });
    let minIdx = i;
    pushStep(3, `Assume the element at index ${i} is the minimum for now.`, "Set Minimum", i + 1, i, { sortedUpTo: i, minIdx: i });

    for (let j = i + 1; j < n; j++) {
      cmp++;
      pushStep(5, `Compare arr[${j}] = ${arr[j]} with the current minimum arr[${minIdx}] = ${arr[minIdx]}.`, "Comparing", i + 1, j, { sortedUpTo: i, minIdx, compareIdx: j });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        pushStep(6, `${arr[j]} is smaller, so index ${j} becomes the new minimum.`, "New Minimum", i + 1, j, { sortedUpTo: i, minIdx, compareIdx: j });
      }
    }

    const needSwap = minIdx !== i;
    pushStep(9, needSwap
      ? `Minimum found at index ${minIdx}. It needs to move to index ${i}.`
      : `The element at index ${i} is already the minimum. No swap needed.`,
      "Min Found", i + 1, i, { sortedUpTo: i, minIdx });

    if (needSwap) {
      pushStep(10, `Swap arr[${i}] and arr[${minIdx}].`, "Swapping", i + 1, i, { sortedUpTo: i, minIdx, swapIdx: [i, minIdx] });
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      swaps++;
      pushStep(10, `Swapped. arr[${i}] is now ${arr[i]}.`, "Swapped", i + 1, i, { sortedUpTo: i + 1, minIdx: null, swapIdx: [i, minIdx] });
    } else {
      // Just mark it sorted in the next step
      steps[steps.length - 1].sorted = Array.from({ length: i + 1 }, (_, k) => k);
    }
  }

  pushStep(13, "The array is fully sorted.", "Completed", Math.max(1, n - 1), n - 1, { sortedUpTo: n });
  return steps;
}

export function buildInsertionSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let cmp = 0;
  let shifts = 0;

  const pushStep = (line, desc, status, pass, index, extra) => {
    const sortedUpTo = extra?.sortedUpTo ?? 1;
    steps.push({
      array: [...arr],
      line,
      explanation: desc,
      status,
      pass,
      index,
      comparisons: cmp,
      swaps: shifts, // using shifts for stats panel
      comparing: extra?.compareIdx !== undefined && extra.compareIdx !== null ? [extra.compareIdx] : [],
      keyIdx: extra?.keyIdx ?? null,
      swapping: extra?.shiftIdx ?? [], // Map shiftIdx to swapping for highlighting in visualizer
      sorted: Array.from({ length: sortedUpTo }, (_, k) => k),
    });
  };

  pushStep(1, "Starting insertion sort. The first element counts as a sorted list of one.", "Ready", 0, -1, { sortedUpTo: 1 });

  for (let i = 1; i < n; i++) {
    pushStep(2, `Beginning pass ${i}: pick up arr[${i}] as the key to insert into the sorted part on its left.`, "Start Pass", i, i, { sortedUpTo: i, keyIdx: i });
    const keyVal = arr[i];
    pushStep(3, `key = arr[${i}] = ${keyVal}.`, "Set Key", i, i, { sortedUpTo: i, keyIdx: i });

    let j = i - 1;
    let holeIdx = i;
    pushStep(4, `Start comparing from the end of the sorted part, j = ${j}.`, "Start Compare", i, j, { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j >= 0 ? j : null });

    while (j >= 0 && arr[j] > keyVal) {
      cmp++;
      pushStep(5, `Compare arr[${j}] = ${arr[j]} with key = ${keyVal}. Since it is greater, it must move right.`, "Comparing", i, j, { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j });
      pushStep(6, `Shift arr[${j}] into the open slot at index ${holeIdx}.`, "Shifting", i, j, { sortedUpTo: i, keyIdx: holeIdx, shiftIdx: [j, holeIdx] });

      arr[holeIdx] = arr[j];
      shifts++;
      holeIdx = j;
      j = j - 1;

      pushStep(7, `Move the pointer left. The open slot is now at index ${holeIdx}.`, "Move Pointer", i, j, { sortedUpTo: i, keyIdx: holeIdx });
    }

    if (j >= 0) {
      cmp++;
      pushStep(5, `Compare arr[${j}] = ${arr[j]} with key = ${keyVal}. It is not greater, so the key has found its place.`, "Comparing", i, j, { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j });
    } else {
      pushStep(5, `Reached the start of the array. The key belongs at the front.`, "Comparing", i, 0, { sortedUpTo: i, keyIdx: holeIdx });
    }

    arr[holeIdx] = keyVal;
    pushStep(9, `Place key = ${keyVal} into the open slot at index ${holeIdx}.`, "Inserted", i, holeIdx, { sortedUpTo: i + 1, keyIdx: holeIdx });
  }

  pushStep(11, "The array is fully sorted.", "Completed", Math.max(1, n - 1), n - 1, { sortedUpTo: n });
  return steps;
}

export function buildLinearSearchSteps(inputArray, target) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;
  let comparisons = 0;

  // Helper to build a consistent step object, minimizing repetition
  // and guaranteeing every field in the schema is always present.
  const makeStep = ({
    line,
    pass = 0,
    index = -1,
    explanation = "",
    status = "",
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => ({
    array: [...arr],
    line,
    pass,
    index,
    comparisons,
    explanation,
    status,
    comparing,
    swapping,
    sorted,
    structure: "array",
    markers,
  });

  // 1. Initial step (Line 1)
  steps.push(
    makeStep({
      line: 1,
      pass: 0,
      index: -1,
      explanation: `Initialize linear search for target ${target}.`,
      status: "Ready",
      comparing: [],
      swapping: [],
      sorted: [],
      markers: {},
    })
  );

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    // 2. Loop iteration step (Line 2)
    steps.push(
      makeStep({
        line: 2,
        pass: i + 1,
        index: i,
        explanation: `Start pass ${i + 1}: check index ${i} (loop condition i < ${n} holds).`,
        status: "Start Pass",
        comparing: [],
        swapping: [],
        sorted: [],
        markers: { i },
      })
    );

    // 3. Comparison step (Line 3)
    comparisons++;
    steps.push(
      makeStep({
        line: 3,
        pass: i + 1,
        index: i,
        explanation: `Compare arr[${i}] (${arr[i]}) with target (${target}).`,
        status: "Comparing",
        comparing: [i],
        swapping: [],
        sorted: [],
        markers: { i },
      })
    );

    if (arr[i] === target) {
      // 4. Found step (Line 5)
      foundIndex = i;
      steps.push(
        makeStep({
          line: 5,
          pass: i + 1,
          index: i,
          explanation: `Target found at index ${i}!`,
          status: "Found",
          comparing: [],
          swapping: [],
          sorted: [i],
          markers: { i },
        })
      );
      break;
    }
  }

  // 5. Not found step (Line 8) - only if the loop completed without a match
  if (foundIndex === -1) {
    steps.push(
      makeStep({
        line: 8,
        pass: n,
        index: -1,
        explanation: "Loop completed. Target not found in the array.",
        status: "Not Found",
        comparing: [],
        swapping: [],
        sorted: [],
        markers: {},
      })
    );
  }

  return steps;
}

export function buildBinarySearchSteps(inputArray, target) {
  const steps = [];

  // Binary Search requires a sorted array — sort a copy, never mutate the caller's array.
  const sortedArray = [...inputArray].sort((a, b) => a - b);

  let comparisons = 0;
  let pass = 0;

  // Helper to keep step objects consistent and reduce repetition.
  const makeStep = ({
    line,
    index,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => ({
    array: [...sortedArray],
    line,
    pass,
    index,
    comparisons,
    explanation,
    status,
    comparing,
    swapping,
    sorted,
    structure: "array",
    markers,
  });

  // --- Step 1: Initialization (Line 1) ---
  steps.push(
    makeStep({
      line: 1,
      index: -1,
      explanation: `Starting Binary Search on the sorted array for target ${target}.`,
      status: "Ready",
      comparing: [],
      swapping: [],
      sorted: [],
      markers: {},
    })
  );

  let left = 0;
  let right = sortedArray.length - 1;

  // --- Step 2: Set left/right bounds (Line 2 & 3) ---
  steps.push(
    makeStep({
      line: 2,
      index: -1,
      explanation: `Initializing left boundary to index ${left}.`,
      status: "Init Left",
      comparing: [left],
      swapping: [],
      sorted: [],
      markers: { left, right },
    })
  );

  steps.push(
    makeStep({
      line: 3,
      index: -1,
      explanation: `Initializing right boundary to index ${right}.`,
      status: "Init Right",
      comparing: [right],
      swapping: [],
      sorted: [],
      markers: { left, right },
    })
  );

  let found = false;

  while (left <= right) {
    pass += 1;

    // --- Loop condition check (Line 4) ---
    steps.push(
      makeStep({
        line: 4,
        index: -1,
        explanation: `Checking loop condition: left (${left}) <= right (${right}).`,
        status: "Checking Bounds",
        comparing: [left, right],
        swapping: [],
        sorted: [],
        markers: { left, right },
      })
    );

    const mid = left + Math.floor((right - left) / 2);
    comparisons += 1;

    // --- Step: Calculate mid (Line 5) ---
    steps.push(
      makeStep({
        line: 5,
        index: mid,
        explanation: `Calculating mid index: left (${left}) + (right (${right}) - left (${left})) / 2 = ${mid}. Comparing arr[${mid}] = ${sortedArray[mid]} against target ${target}.`,
        status: "Checking Mid",
        comparing: [left, mid, right],
        swapping: [],
        sorted: [],
        markers: { left, mid, right },
      })
    );

    // --- Step: Equality check (Line 6) ---
    steps.push(
      makeStep({
        line: 6,
        index: mid,
        explanation: `Is arr[${mid}] (${sortedArray[mid]}) equal to target (${target})?`,
        status: "Comparing",
        comparing: [left, mid, right],
        swapping: [],
        sorted: [],
        markers: { left, mid, right },
      })
    );

    if (sortedArray[mid] === target) {
      // --- Step: Found (Line 7) ---
      steps.push(
        makeStep({
          line: 7,
          index: mid,
          explanation: `Target found! arr[${mid}] equals ${target}. Returning index ${mid}.`,
          status: "Found",
          comparing: [],
          swapping: [],
          sorted: [mid],
          markers: { left, mid, right },
        })
      );
      found = true;
      break;
    }

    // --- Step: Less-than check (Line 9) ---
    steps.push(
      makeStep({
        line: 9,
        index: mid,
        explanation: `Is arr[${mid}] (${sortedArray[mid]}) less than target (${target})?`,
        status: "Comparing",
        comparing: [left, mid, right],
        swapping: [],
        sorted: [],
        markers: { left, mid, right },
      })
    );

    if (sortedArray[mid] < target) {
      left = mid + 1;

      // --- Step: Move left bound (Line 10) ---
      steps.push(
        makeStep({
          line: 10,
          index: mid,
          explanation: `arr[${mid}] (${sortedArray[mid]}) is less than target (${target}). Search range moves right: left = ${left}.`,
          status: "Search Right",
          comparing: [left, right],
          swapping: [],
          sorted: [],
          markers: { left, mid, right },
        })
      );
    } else {
      right = mid - 1;

      // --- Step: Move right bound (Line 12) ---
      steps.push(
        makeStep({
          line: 12,
          index: mid,
          explanation: `arr[${mid}] (${sortedArray[mid]}) is greater than target (${target}). Search range moves left: right = ${right}.`,
          status: "Search Left",
          comparing: [left, right],
          swapping: [],
          sorted: [],
          markers: { left, mid, right },
        })
      );
    }
  }

  if (!found) {
    // --- Step: Not found (Line 15) ---
    steps.push(
      makeStep({
        line: 15,
        index: -1,
        explanation: `Search range exhausted (left > right). Target ${target} not found, returning -1.`,
        status: "Not Found",
        comparing: [],
        swapping: [],
        sorted: [],
        markers: { left, right },
      })
    );
  }

  return steps;
}

export function buildStackSteps(input) {
  const stack = [];
  const steps = [makeStep({ array: [], line: 1, structure: "stack", explanation: "Start with an empty stack.", status: "Ready" })];
  input.forEach((value, index) => {
    stack.push(value);
    steps.push(makeStep({ array: [...stack], line: 5, structure: "stack", pass: index + 1, index, swaps: stack.length, sorted: [stack.length - 1], explanation: `Push ${value} onto the top of the stack.`, status: "Push" }));
  });
  if (stack.length) {
    const removed = stack.pop();
    steps.push(makeStep({ array: [...stack], line: 10, structure: "stack", pass: input.length + 1, index: stack.length, swaps: stack.length, explanation: `Pop removes ${removed} from the top.`, status: "Pop" }));
  }
  return steps;
}

export function buildQueueSteps(input, circular = false) {
  const capacity = Math.max(6, input.length + 2);
  const queue = circular ? Array(capacity).fill(null) : [];
  const steps = [makeStep({ array: circular ? [...queue] : [], line: 1, structure: circular ? "circular-queue" : "queue", explanation: circular ? `Start with ${capacity} circular slots.` : "Start with an empty queue.", status: "Ready", markers: { front: -1, rear: -1 } })];
  let front = 0;
  let rear = -1;

  input.forEach((value, index) => {
    if (circular) {
      rear = (rear + 1) % capacity;
      queue[rear] = value;
      steps.push(makeStep({ array: [...queue], line: 7, structure: "circular-queue", pass: index + 1, index: rear, sorted: [rear], explanation: `Enqueue ${value} at circular slot ${rear}.`, status: "Enqueue", markers: { front, rear } }));
    } else {
      queue.push(value);
      rear += 1;
      steps.push(makeStep({ array: [...queue], line: 5, structure: "queue", pass: index + 1, index: rear, sorted: [rear], explanation: `Enqueue ${value} at the rear.`, status: "Enqueue", markers: { front, rear } }));
    }
  });

  if (input.length) {
    const removed = circular ? queue[front] : queue.shift();
    if (circular) queue[front] = null;
    front = circular ? (front + 1) % capacity : 0;
    steps.push(makeStep({ array: circular ? [...queue] : [...queue], line: 12, structure: circular ? "circular-queue" : "queue", pass: input.length + 1, index: front, explanation: `Dequeue removes ${removed} from the front.`, status: "Dequeue", markers: { front, rear } }));
  }
  return steps;
}

export function buildLinkedListSteps(input, circular = false, doubly = false) {
  const nodes = [];
  const structure = circular ? "circular-list" : "linked-list";
  const steps = [makeStep({ array: [], line: 1, structure, explanation: "Start with an empty linked list.", status: "Ready" })];
  input.forEach((value, index) => {
    nodes.push(value);
    steps.push(makeStep({ array: [...nodes], line: 6, structure, pass: index + 1, index, sorted: [index], explanation: `Insert node ${value}${doubly ? " with previous and next links" : ""}.`, status: "Insert" }));
  });
  nodes.forEach((value, index) => {
    steps.push(makeStep({ array: [...nodes], line: 10, structure, pass: input.length + index + 1, index, comparing: [index], explanation: `Traverse node ${value}.`, status: "Traverse" }));
  });
  return steps;
}

export function buildGenericSteps(input, algorithm) {
  const sorted = algorithm.type === "sorting" ? [...input].sort((a, b) => a - b) : [...input];
  return [
    makeStep({ array: [...input], line: 1, explanation: `Load the student input for ${algorithm.title}.`, status: "Ready" }),
    makeStep({ array: [...input], line: 3, comparing: input.length > 1 ? [0, 1] : [0], comparisons: Math.min(input.length, 1), explanation: "Process the active item and update the visualization state.", status: "Processing" }),
    makeStep({ array: sorted, line: 5, sorted: sortedIndexes(sorted.length), comparisons: input.length, swaps: algorithm.type === "sorting" ? Math.max(0, Math.floor(input.length / 2)) : 0, explanation: `${algorithm.title} simulation completed for the current input.`, status: "Completed" }),
  ];
}

export function buildSimulationSteps(input, algorithm, target) {
  if (algorithm.slug === "bubble-sort") return buildBubbleSortSteps(input);
  if (algorithm.slug === "selection-sort") return buildSelectionSortSteps(input);
  if (algorithm.slug === "insertion-sort") return buildInsertionSortSteps(input);
  if (algorithm.slug === "linear-search") return buildLinearSearchSteps(input, target);
  if (algorithm.slug === "binary-search") return buildBinarySearchSteps(input, target);
  if (algorithm.slug === "stack-array") return buildStackSteps(input);
  if (algorithm.slug === "linear-queue" || algorithm.slug === "priority-queue") return buildQueueSteps(input, false);
  if (algorithm.slug === "circular-queue") return buildQueueSteps(input, true);
  if (algorithm.slug === "singly-linked-list") return buildLinkedListSteps(input, false, false);
  if (algorithm.slug === "doubly-linked-list") return buildLinkedListSteps(input, false, true);
  if (algorithm.slug === "circular-linked-list") return buildLinkedListSteps(input, true, false);
  return buildGenericSteps(input, algorithm);
}
