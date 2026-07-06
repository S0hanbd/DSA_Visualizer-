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

export function buildLinearSearchSteps(input, target) {
  const steps = [makeStep({ array: [...input], line: 1, explanation: `Search for ${target} from left to right.`, status: "Ready" })];
  let comparisons = 0;

  for (let i = 0; i < input.length; i++) {
    comparisons += 1;
    const found = input[i] === target;
    steps.push(makeStep({ array: [...input], line: 3, pass: 1, index: i, comparisons, comparing: [i], sorted: found ? [i] : [], explanation: found ? `${target} found at index ${i}.` : `${input[i]} is not ${target}. Continue searching.`, status: found ? "Found" : "Checking" }));
    if (found) break;
  }

  if (!steps.some((step) => step.status === "Found")) {
    steps.push(makeStep({ array: [...input], line: 7, pass: 1, index: input.length - 1, comparisons, explanation: `${target} is not in the input array.`, status: "Not Found" }));
  }
  return steps;
}

export function buildBinarySearchSteps(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  const steps = [makeStep({ array: [...arr], line: 1, explanation: `Binary Search uses the sorted input and searches for ${target}.`, status: "Ready" })];
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons += 1;
    steps.push(makeStep({ array: [...arr], line: 5, pass: comparisons, index: mid, comparisons, comparing: [left, mid, right], explanation: `Check middle index ${mid}, value ${arr[mid]}.`, status: "Checking Middle", markers: { left, mid, right } }));
    if (arr[mid] === target) {
      steps.push(makeStep({ array: [...arr], line: 7, pass: comparisons, index: mid, comparisons, sorted: [mid], explanation: `${target} found at index ${mid} in the sorted array.`, status: "Found", markers: { left, mid, right } }));
      return steps;
    }
    if (arr[mid] < target) {
      left = mid + 1;
      steps.push(makeStep({ array: [...arr], line: 10, pass: comparisons, index: left, comparisons, explanation: `${arr[mid]} is smaller than ${target}, so search the right half.`, status: "Move Right", markers: { left, right } }));
    } else {
      right = mid - 1;
      steps.push(makeStep({ array: [...arr], line: 12, pass: comparisons, index: right, comparisons, explanation: `${arr[mid]} is larger than ${target}, so search the left half.`, status: "Move Left", markers: { left, right } }));
    }
  }

  steps.push(makeStep({ array: [...arr], line: 15, pass: comparisons, index: 0, comparisons, explanation: `${target} is not in the input array.`, status: "Not Found" }));
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
