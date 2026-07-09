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

// ─────────────────────────────────────────────────────────────────────────────
// Singly Linked List – full operation simulation
// ─────────────────────────────────────────────────────────────────────────────
export function buildSinglyLinkedListSteps(input) {
  const steps = [];
  let list = [];
  let pass = 0;
  let comparisons = 0;
  let swaps = 0;

  // Extract up to 5 values from input, fall back to defaults
  const vals = [...(input.length >= 5 ? input.slice(0, 5) : [...input, 42, 18, 73, 29, 56].slice(0, 5))];
  const [v0, v1, v2, v3, v4] = vals;

  const push = (line, explanation, status, opts = {}) => {
    steps.push({
      array: [...list],
      line,
      pass,
      index: opts.comparing?.[0] ?? -1,
      comparisons,
      swaps,
      explanation,
      status,
      comparing:  opts.comparing  ?? [],
      swapping:   opts.swapping   ?? [],
      sorted:     opts.sorted     ?? [],
      structure: "linked-list",
      markers: {
        operation:          opts.operation          ?? status,
        newNode:            opts.newNode            ?? null,
        deleting:           opts.deleting           ?? null,
        highlightArrowFrom: opts.highlightArrowFrom ?? null,
      },
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  push(1, "Initialize empty singly linked list. HEAD → NULL.", "Ready");

  // ── Op 1: Insert at Head (v0) ─────────────────────────────────────────────
  pass = 1;
  push(11, `Operation 1 ▶ Insert ${v0} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(12, `new Node(${v0}) — allocate node, data=${v0}, next=null.`, "Creating Node", { operation: "Insert Head" });
  list = [v0];
  push(12, `Node ${v0} created. List was empty → node.next = null.`, "Node Created",  { operation: "Insert Head", newNode: 0 });
  push(13, `node.next = this.head (null). New node linked to nothing.`, "Link Next", { operation: "Insert Head", newNode: 0 });
  push(14, `this.head = node. HEAD → ${v0}. List: [${list.join(" → ")}]`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 2: Insert at Head (v1) ─────────────────────────────────────────────
  pass = 2;
  push(11, `Operation 2 ▶ Insert ${v1} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(12, `new Node(${v1}) — data=${v1}, next=null.`, "Creating Node", { operation: "Insert Head" });
  const prevHead2 = list[0];
  list = [v1, ...list];
  push(12, `Node ${v1} ready. Current head is ${prevHead2}.`, "Node Created", { operation: "Insert Head", newNode: 0 });
  push(13, `node.next = this.head (${prevHead2}). ${v1} → ${prevHead2}.`, "Link Next", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(14, `this.head = node. HEAD → ${v1}. List: [${list.join(" → ")}]`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 3: Insert at Tail (v2) ─────────────────────────────────────────────
  pass = 3;
  const prevTail3 = list[list.length - 1];
  list = [...list, v2];
  push(17, `Operation 3 ▶ Insert ${v2} at TAIL.`, "Insert Tail", { operation: "Insert Tail" });
  push(18, `this.head ≠ null. Traverse to find last node.`, "Check Head", { operation: "Insert Tail", newNode: list.length - 1 });
  push(19, `new Node(${v2}) created. Start traversal at head.`, "Creating Node", { operation: "Insert Tail", newNode: list.length - 1, comparing: [0] });
  for (let i = 0; i < list.length - 2; i++) {
    comparisons++;
    push(20, `curr.next ≠ null (${list[i + 1]}). Continue.`, "Traversing", { operation: "Insert Tail", newNode: list.length - 1, comparing: [i] });
    push(21, `curr = curr.next → move to node ${list[i + 1]}.`, "Move Forward", { operation: "Insert Tail", newNode: list.length - 1, comparing: [i + 1] });
  }
  push(23, `curr = ${prevTail3} (last). curr.next = new node ${v2}.`, "Link Tail", { operation: "Insert Tail", newNode: list.length - 1, comparing: [list.length - 2], highlightArrowFrom: list.length - 2 });
  swaps++;
  push(23, `Tail inserted! List: [${list.join(" → ")}]`, "Insert Tail Done", { operation: "Insert Tail" });

  // ── Op 4: Insert at Position 1 (v3) ───────────────────────────────────────
  pass = 4;
  const insertPos = 1;
  push(27, `Operation 4 ▶ Insert ${v3} at position ${insertPos}.`, "Insert At", { operation: "Insert At" });
  push(28, `pos=${insertPos} > 0. Proceed with mid-list insert.`, "Check Pos", { operation: "Insert At" });
  push(29, `new Node(${v3}). Traverse to node just before position ${insertPos}.`, "Creating Node", { operation: "Insert At" });
  for (let i = 0; i < insertPos; i++) {
    comparisons++;
    push(30, `Traverse: i=${i}, curr = ${list[i]}.`, "Traversing", { operation: "Insert At", comparing: [i] });
  }
  const afterInsert = [...list.slice(0, insertPos), v3, ...list.slice(insertPos)];
  list = afterInsert;
  push(31, `node.next = curr.next (${list[insertPos + 1]}). New node points forward.`, "Link Forward", { operation: "Insert At", newNode: insertPos, highlightArrowFrom: insertPos, comparing: [insertPos - 1] });
  push(32, `curr.next = node. ${list[insertPos - 1]} → ${v3}.`, "Link Back", { operation: "Insert At", newNode: insertPos, highlightArrowFrom: insertPos - 1 });
  swaps++;
  push(32, `Position insert done. List: [${list.join(" → ")}]`, "Insert At Done", { operation: "Insert At" });

  // ── Op 5: Traverse ────────────────────────────────────────────────────────
  pass = 5;
  push(37, `Operation 5 ▶ Traverse the full list (${list.length} nodes).`, "Traverse", { operation: "Traverse" });
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    push(38, `Visit node [${i}]: value = ${list[i]}${i === 0 ? " ← HEAD" : ""}.`, "Visiting", { operation: "Traverse", comparing: [i] });
    if (i < list.length - 1) {
      push(39, `curr = curr.next → next node is ${list[i + 1]}.`, "Move Forward", { operation: "Traverse", comparing: [i + 1] });
    }
  }
  push(40, `curr.next = null. Traversal complete. Visited ${list.length} nodes.`, "Traverse Done", { operation: "Traverse" });

  // ── Op 6: Search ──────────────────────────────────────────────────────────
  pass = 6;
  const searchVal = list[Math.floor(list.length / 2)];
  push(43, `Operation 6 ▶ Search for value ${searchVal}.`, "Search", { operation: "Search" });
  push(44, `curr = head (${list[0]}). idx = 0.`, "Start Search", { operation: "Search", comparing: [0] });
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    push(45, `curr.data = ${list[i]} vs target = ${searchVal}.`, "Comparing", { operation: "Search", comparing: [i] });
    if (list[i] === searchVal) {
      push(46, `Match! ${searchVal} found at index ${i}.`, "Found", { operation: "Search", sorted: [i] });
      break;
    }
    if (i < list.length - 1) push(48, `${list[i]} ≠ ${searchVal}. curr = curr.next (${list[i + 1]}).`, "Move Forward", { operation: "Search", comparing: [i + 1] });
    else push(49, `${list[i]} ≠ ${searchVal}. curr.next = null.`, "Not Found", { operation: "Search" });
  }

  // ── Op 7: Delete at Head ──────────────────────────────────────────────────
  pass = 7;
  push(52, `Operation 7 ▶ Delete HEAD node (value ${list[0]}).`, "Delete Head", { operation: "Delete Head" });
  push(53, `Store temp = head (${list[0]}).`, "Store Ref", { operation: "Delete Head", swapping: [0] });
  push(54, `this.head = head.next (${list[1] ?? "null"}). HEAD advances.`, "Update HEAD", { operation: "Delete Head", swapping: [0] });
  const removed7 = list[0];
  list = list.slice(1);
  swaps++;
  push(54, `Old head (${removed7}) freed. List: [${list.join(" → ")}]`, "Delete Head Done", { operation: "Delete Head" });

  // ── Op 8: Delete at Tail ──────────────────────────────────────────────────
  pass = 8;
  push(57, `Operation 8 ▶ Delete TAIL node (value ${list[list.length - 1]}).`, "Delete Tail", { operation: "Delete Tail" });
  push(60, `Traverse to second-to-last node.`, "Traversing", { operation: "Delete Tail" });
  for (let i = 0; i < list.length - 2; i++) {
    comparisons++;
    push(61, `curr = ${list[i]}, curr.next.next ≠ null → keep moving.`, "Move Forward", { operation: "Delete Tail", comparing: [i] });
  }
  push(61, `curr = ${list[list.length - 2]} (second-to-last). curr.next.next = null.`, "Found Pre-Tail", { operation: "Delete Tail", comparing: [list.length - 2], swapping: [list.length - 1] });
  push(63, `curr.next = null. Tail (${list[list.length - 1]}) detached.`, "Remove Tail", { operation: "Delete Tail", deleting: list.length - 1 });
  const removed8 = list[list.length - 1];
  list = list.slice(0, -1);
  swaps++;
  push(63, `Tail (${removed8}) removed. List: [${list.join(" → ")}]`, "Delete Tail Done", { operation: "Delete Tail" });

  // ── Op 9: Delete by Value ─────────────────────────────────────────────────
  pass = 9;
  const delVal = list.length > 1 ? list[1] : list[0];
  push(66, `Operation 9 ▶ Delete node with value ${delVal}.`, "Delete Value", { operation: "Delete Value" });
  push(67, `Start at head. Check if head.data = ${delVal}.`, "Check Head", { operation: "Delete Value", comparing: [0] });
  comparisons++;
  if (list[0] === delVal) {
    push(68, `Head matches! this.head = head.next.`, "Unlinking", { operation: "Delete Value", deleting: 0 });
    list = list.slice(1);
  } else {
    push(68, `head (${list[0]}) ≠ ${delVal}. Traverse.`, "Searching", { operation: "Delete Value", comparing: [0] });
    for (let i = 1; i < list.length; i++) {
      comparisons++;
      push(70, `curr.data = ${list[i]} vs ${delVal}.`, "Comparing", { operation: "Delete Value", comparing: [i] });
      if (list[i] === delVal) {
        push(71, `Found ${delVal} at [${i}]. prev.next = curr.next (${list[i + 1] ?? "null"}).`, "Unlinking", { operation: "Delete Value", comparing: [i - 1], deleting: i, highlightArrowFrom: i - 1 });
        list = [...list.slice(0, i), ...list.slice(i + 1)];
        break;
      }
    }
  }
  swaps++;
  push(71, `Node ${delVal} removed. Final list: [${list.join(" → ")}]`, "Delete Value Done", { operation: "Delete Value" });

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// Doubly Linked List – full operation simulation
// ─────────────────────────────────────────────────────────────────────────────
export function buildDoublyLinkedListSteps(input) {
  const steps = [];
  let list = [];
  let pass = 0;
  let comparisons = 0;
  let swaps = 0;

  const vals = [...(input.length >= 4 ? input.slice(0, 4) : [...input, 42, 18, 73, 29].slice(0, 4))];
  const [v0, v1, v2, v3] = vals;

  const push = (line, explanation, status, opts = {}) => {
    steps.push({
      array: [...list],
      line,
      pass,
      index: opts.comparing?.[0] ?? -1,
      comparisons,
      swaps,
      explanation,
      status,
      comparing:  opts.comparing  ?? [],
      swapping:   opts.swapping   ?? [],
      sorted:     opts.sorted     ?? [],
      structure: "doubly-list",
      markers: {
        operation:          opts.operation          ?? status,
        newNode:            opts.newNode            ?? null,
        deleting:           opts.deleting           ?? null,
        highlightArrowFrom: opts.highlightArrowFrom ?? null,
      },
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  push(1, "Initialize empty doubly linked list. HEAD = TAIL = null.", "Ready");

  // ── Op 1: Insert at Head (v0) ─────────────────────────────────────────────
  pass = 1;
  push(12, `Operation 1 ▶ Insert ${v0} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(13, `new Node(${v0}): prev=null, data=${v0}, next=null.`, "Creating Node", { operation: "Insert Head" });
  list = [v0];
  push(13, `First node in the list. HEAD = TAIL = node ${v0}.`, "Node Created", { operation: "Insert Head", newNode: 0 });
  push(14, `this.head = this.tail = node. List: [${list.join(" ↔ ")}]`, "HEAD TAIL Set", { operation: "Insert Head" });

  // ── Op 2: Insert at Head (v1) ─────────────────────────────────────────────
  pass = 2;
  push(12, `Operation 2 ▶ Insert ${v1} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(13, `new Node(${v1}).`, "Creating Node", { operation: "Insert Head" });
  list = [v1, ...list];
  push(17, `node.next = this.head (${list[1]}). New → Old head.`, "Link Next →", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(18, `this.head.prev = node. Old head ← New. Back-link set.`, "Link Prev ←", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(19, `this.head = node. HEAD → ${v1}. List: [${list.join(" ↔ ")}]`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 3: Insert at Head (v2) ─────────────────────────────────────────────
  pass = 3;
  push(12, `Operation 3 ▶ Insert ${v2} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  list = [v2, ...list];
  push(13, `new Node(${v2}).`, "Creating Node", { operation: "Insert Head", newNode: 0 });
  push(17, `node.next = ${list[1]}. Forward link created.`, "Link Next →", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(18, `${list[1]}.prev = node. Backward link created.`, "Link Prev ←", { operation: "Insert Head", newNode: 0 });
  push(19, `HEAD → ${v2}. List: [${list.join(" ↔ ")}]`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 4: Insert at Tail (v3) ─────────────────────────────────────────────
  pass = 4;
  list = [...list, v3];
  push(23, `Operation 4 ▶ Insert ${v3} at TAIL.`, "Insert Tail", { operation: "Insert Tail" });
  push(24, `new Node(${v3}).`, "Creating Node", { operation: "Insert Tail", newNode: list.length - 1 });
  push(25, `node.prev = this.tail (${list[list.length - 2]}). Backward link.`, "Link Prev ←", { operation: "Insert Tail", newNode: list.length - 1, comparing: [list.length - 2] });
  push(26, `this.tail.next = node. Old tail → new node.`, "Link Next →", { operation: "Insert Tail", newNode: list.length - 1, highlightArrowFrom: list.length - 2 });
  push(27, `this.tail = node. TAIL → ${v3}. List: [${list.join(" ↔ ")}]`, "TAIL Updated", { operation: "Insert Tail" });
  swaps++;

  // ── Op 5: Traverse Forward ────────────────────────────────────────────────
  pass = 5;
  push(33, `Operation 5 ▶ Traverse FORWARD (HEAD → TAIL).`, "Traverse", { operation: "Traverse" });
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    push(34, `Visit [${i}] = ${list[i]}${i === 0 ? " (HEAD)" : i === list.length - 1 ? " (TAIL)" : ""}.`, "Visiting", { operation: "Traverse", comparing: [i] });
    if (i < list.length - 1) push(35, `curr = curr.next → ${list[i + 1]}.`, "Move Forward", { operation: "Traverse", comparing: [i + 1] });
  }
  push(36, `Reached TAIL. Forward traversal complete.`, "Traverse Done", { operation: "Traverse" });

  // ── Op 6: Traverse Backward ───────────────────────────────────────────────
  pass = 6;
  push(39, `Operation 6 ▶ Traverse BACKWARD (TAIL → HEAD).`, "Traverse", { operation: "Traverse" });
  for (let i = list.length - 1; i >= 0; i--) {
    comparisons++;
    push(40, `Visit [${i}] = ${list[i]}${i === list.length - 1 ? " (TAIL)" : i === 0 ? " (HEAD)" : ""}.`, "Visiting", { operation: "Traverse", comparing: [i] });
    if (i > 0) push(41, `curr = curr.prev → ${list[i - 1]}.`, "Move Backward", { operation: "Traverse", comparing: [i - 1] });
  }
  push(42, `Reached HEAD. Backward traversal complete.`, "Traverse Done", { operation: "Traverse" });

  // ── Op 7: Delete at Head ──────────────────────────────────────────────────
  pass = 7;
  push(46, `Operation 7 ▶ Delete HEAD (${list[0]}).`, "Delete Head", { operation: "Delete Head" });
  push(47, `this.head = this.head.next (${list[1]}).`, "Update HEAD", { operation: "Delete Head", deleting: 0 });
  push(48, `new head.prev = null. Back-link to removed node cleared.`, "Clear Prev", { operation: "Delete Head", swapping: [0] });
  const rem7 = list[0];
  list = list.slice(1);
  swaps++;
  push(48, `Node ${rem7} removed. List: [${list.join(" ↔ ")}]`, "Delete Head Done", { operation: "Delete Head" });

  // ── Op 8: Delete at Tail ──────────────────────────────────────────────────
  pass = 8;
  push(52, `Operation 8 ▶ Delete TAIL (${list[list.length - 1]}).`, "Delete Tail", { operation: "Delete Tail" });
  push(53, `this.tail = this.tail.prev (${list[list.length - 2]}).`, "Update TAIL", { operation: "Delete Tail", deleting: list.length - 1 });
  push(54, `new tail.next = null. Forward link cleared.`, "Clear Next", { operation: "Delete Tail", swapping: [list.length - 1] });
  const rem8 = list[list.length - 1];
  list = list.slice(0, -1);
  swaps++;
  push(54, `Node ${rem8} removed. List: [${list.join(" ↔ ")}]`, "Delete Tail Done", { operation: "Delete Tail" });

  // ── Op 9: Delete by Value ─────────────────────────────────────────────────
  pass = 9;
  const dv = list.length > 1 ? list[1] : list[0];
  push(57, `Operation 9 ▶ Delete node with value ${dv}.`, "Delete Value", { operation: "Delete Value" });
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    push(58, `curr.data = ${list[i]} vs ${dv}.`, "Comparing", { operation: "Delete Value", comparing: [i] });
    if (list[i] === dv) {
      push(60, `Found ${dv} at [${i}]. Bypass: prev.next = curr.next.`, "Unlinking", { operation: "Delete Value", deleting: i, comparing: [i - 1 >= 0 ? i - 1 : 0] });
      if (i > 0) push(61, `curr.next.prev = curr.prev. Back-link also updated.`, "Back Link", { operation: "Delete Value", comparing: [i + 1 < list.length ? i + 1 : i] });
      list = [...list.slice(0, i), ...list.slice(i + 1)];
      break;
    }
  }
  swaps++;
  push(57, `Node ${dv} deleted. Final list: [${list.join(" ↔ ")}]`, "Delete Value Done", { operation: "Delete Value" });

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// Circular Linked List – full operation simulation
// ─────────────────────────────────────────────────────────────────────────────
export function buildCircularLinkedListSteps(input) {
  const steps = [];
  let list = [];
  let pass = 0;
  let comparisons = 0;
  let swaps = 0;

  const vals = [...(input.length >= 4 ? input.slice(0, 4) : [...input, 42, 18, 73, 29].slice(0, 4))];
  const [v0, v1, v2, v3] = vals;

  const push = (line, explanation, status, opts = {}) => {
    steps.push({
      array: [...list],
      line,
      pass,
      index: opts.comparing?.[0] ?? -1,
      comparisons,
      swaps,
      explanation,
      status,
      comparing:  opts.comparing  ?? [],
      swapping:   opts.swapping   ?? [],
      sorted:     opts.sorted     ?? [],
      structure: "circular-list",
      markers: {
        operation:          opts.operation          ?? status,
        newNode:            opts.newNode            ?? null,
        deleting:           opts.deleting           ?? null,
        highlightArrowFrom: opts.highlightArrowFrom ?? null,
      },
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  push(1, "Initialize empty circular linked list. HEAD = null.", "Ready");

  // ── Op 1: Insert at Head (v0) — empty list ────────────────────────────────
  pass = 1;
  push(10, `Operation 1 ▶ Insert ${v0} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(11, `new Node(${v0}). List is empty: node.next = node (self-loop).`, "Creating Node", { operation: "Insert Head" });
  list = [v0];
  push(11, `Self-loop: ${v0}.next → ${v0}. HEAD = node.`, "Self Loop", { operation: "Insert Head", newNode: 0 });
  push(12, `HEAD → ${v0}. Circular list of 1 node.`, "HEAD Set", { operation: "Insert Head" });

  // ── Op 2: Insert at Head (v1) ─────────────────────────────────────────────
  pass = 2;
  push(10, `Operation 2 ▶ Insert ${v1} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(15, `Traverse from head to find TAIL (curr.next ≠ head).`, "Find Tail", { operation: "Insert Head", comparing: [0] });
  comparisons++;
  push(15, `Tail found: node ${list[list.length - 1]} (next = head). Only 1 node.`, "Tail Found", { operation: "Insert Head", comparing: [list.length - 1] });
  list = [v1, ...list];
  push(16, `new Node(${v1}). node.next = HEAD (${list[1]}).`, "Link Next →", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(17, `tail.next = node ${v1}. Circular link maintained.`, "Circular Link", { operation: "Insert Head", newNode: 0 });
  push(18, `HEAD = node ${v1}. List (circular): [${list.join(" → ")}] → HEAD`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 3: Insert at Tail (v2) ─────────────────────────────────────────────
  pass = 3;
  list = [...list, v2];
  push(22, `Operation 3 ▶ Insert ${v2} at TAIL.`, "Insert Tail", { operation: "Insert Tail" });
  push(23, `Traverse to find current TAIL.`, "Find Tail", { operation: "Insert Tail", newNode: list.length - 1 });
  for (let i = 0; i < list.length - 2; i++) {
    comparisons++;
    push(24, `curr = ${list[i]}, curr.next ≠ HEAD. Continue.`, "Traversing", { operation: "Insert Tail", newNode: list.length - 1, comparing: [i] });
  }
  push(24, `Tail = ${list[list.length - 2]} (next = HEAD ${list[0]}).`, "Tail Found", { operation: "Insert Tail", newNode: list.length - 1, comparing: [list.length - 2] });
  push(25, `tail.next = new node ${v2}. Old tail → ${v2}.`, "Link Tail", { operation: "Insert Tail", newNode: list.length - 1, highlightArrowFrom: list.length - 2 });
  push(26, `new node.next = HEAD (${list[0]}). Circular link restored.`, "Restore Circular", { operation: "Insert Tail", newNode: list.length - 1 });
  swaps++;
  push(26, `Tail inserted! [${list.join(" → ")}] → HEAD`, "Insert Tail Done", { operation: "Insert Tail" });

  // ── Op 4: Insert at Head (v3) ─────────────────────────────────────────────
  pass = 4;
  list = [v3, ...list];
  push(10, `Operation 4 ▶ Insert ${v3} at HEAD.`, "Insert Head", { operation: "Insert Head" });
  push(15, `Find tail by traversing.`, "Find Tail", { operation: "Insert Head" });
  for (let i = 1; i < list.length - 1; i++) {
    comparisons++;
    push(15, `curr = ${list[i]}, next ≠ HEAD. Move.`, "Traversing", { operation: "Insert Head", comparing: [i] });
  }
  push(15, `Tail = ${list[list.length - 1]}.`, "Tail Found", { operation: "Insert Head", comparing: [list.length - 1] });
  push(16, `node.next = HEAD (${list[1]}). New node → old head.`, "Link Next →", { operation: "Insert Head", newNode: 0, highlightArrowFrom: 0 });
  push(17, `tail.next = new node ${v3}. Circular link re-established.`, "Circular Link", { operation: "Insert Head", newNode: 0 });
  push(18, `HEAD = ${v3}. List: [${list.join(" → ")}] → HEAD`, "HEAD Updated", { operation: "Insert Head" });

  // ── Op 5: Traverse ────────────────────────────────────────────────────────
  pass = 5;
  push(30, `Operation 5 ▶ Traverse circular list (stops when curr.next = HEAD).`, "Traverse", { operation: "Traverse" });
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    push(31, `Visit [${i}] = ${list[i]}${i === 0 ? " (HEAD)" : ""}.`, "Visiting", { operation: "Traverse", comparing: [i] });
    if (i < list.length - 1) push(32, `curr = curr.next → ${list[i + 1]}.`, "Move Forward", { operation: "Traverse", comparing: [i + 1] });
  }
  push(33, `curr.next = HEAD. Circular traversal complete (${list.length} nodes visited).`, "Traverse Done", { operation: "Traverse" });

  // ── Op 6: Delete at Head ──────────────────────────────────────────────────
  pass = 6;
  push(37, `Operation 6 ▶ Delete HEAD (${list[0]}).`, "Delete Head", { operation: "Delete Head" });
  push(38, `Find tail (to update tail.next after head changes).`, "Find Tail", { operation: "Delete Head" });
  for (let i = 0; i < list.length - 1; i++) {
    comparisons++;
    push(39, `curr = ${list[i]}. curr.next ≠ HEAD. Move.`, "Traversing", { operation: "Delete Head", comparing: [i] });
  }
  push(39, `Tail = ${list[list.length - 1]}.`, "Tail Found", { operation: "Delete Head", comparing: [list.length - 1], deleting: 0 });
  push(40, `HEAD = HEAD.next (${list[1]}). New head set.`, "Update HEAD", { operation: "Delete Head", deleting: 0 });
  push(41, `tail.next = new HEAD (${list[1]}). Circular link updated.`, "Circular Link", { operation: "Delete Head", deleting: 0 });
  const rem6 = list[0];
  list = list.slice(1);
  swaps++;
  push(41, `Node ${rem6} removed. List: [${list.join(" → ")}] → HEAD`, "Delete Head Done", { operation: "Delete Head" });

  // ── Op 7: Delete at Tail ──────────────────────────────────────────────────
  pass = 7;
  push(45, `Operation 7 ▶ Delete TAIL (${list[list.length - 1]}).`, "Delete Tail", { operation: "Delete Tail" });
  push(46, `Traverse to find second-to-last node.`, "Find Pre-Tail", { operation: "Delete Tail" });
  for (let i = 0; i < list.length - 2; i++) {
    comparisons++;
    push(47, `curr = ${list[i]}. Next.next ≠ HEAD. Move.`, "Traversing", { operation: "Delete Tail", comparing: [i] });
  }
  push(47, `Pre-tail = ${list[list.length - 2]}. Tail = ${list[list.length - 1]}.`, "Pre-Tail Found", { operation: "Delete Tail", comparing: [list.length - 2], deleting: list.length - 1 });
  push(48, `pre-tail.next = HEAD. Tail removed, circular link restored.`, "Restore Link", { operation: "Delete Tail", deleting: list.length - 1, highlightArrowFrom: list.length - 2 });
  const rem7c = list[list.length - 1];
  list = list.slice(0, -1);
  swaps++;
  push(48, `Node ${rem7c} removed. List: [${list.join(" → ")}] → HEAD`, "Delete Tail Done", { operation: "Delete Tail" });

  return steps;
}

export function buildLinkedListSteps(input, circular = false, doubly = false) {
  if (doubly)   return buildDoublyLinkedListSteps(input);
  if (circular) return buildCircularLinkedListSteps(input);
  return buildSinglyLinkedListSteps(input);
}

export function buildMergeSortSteps(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, array, comparing = [], swapping = [], sorted = [], markers = {} }) => {
    steps.push({ array: [...array], line, pass, index: comparing[0] ?? -1, comparisons, swaps, explanation, status, comparing, swapping, sorted, structure: "array", markers });
  };

  pushStep({ line: 1, explanation: "Starting Merge Sort. The array will be recursively split into halves, sorted, then merged.", status: "Ready", array: arr });

  // Iterative bottom-up merge sort for clean step generation
  const n = arr.length;
  for (let width = 1; width < n; width *= 2) {
    pass++;
    pushStep({ line: 2, explanation: `Pass ${pass}: merging subarrays of width ${width}.`, status: "New Pass", array: arr });

    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width - 1, n - 1);
      const hi = Math.min(lo + 2 * width - 1, n - 1);
      if (mid >= hi) continue;

      const leftZone = Array.from({ length: mid - lo + 1 }, (_, k) => lo + k);
      const rightZone = Array.from({ length: hi - mid }, (_, k) => mid + 1 + k);

      pushStep({ line: 8, explanation: `Merging left subarray [${lo}…${mid}] and right subarray [${mid + 1}…${hi}].`, status: "Merging", array: arr, comparing: leftZone, swapping: rightZone, markers: { left: lo, mid, right: hi } });

      const L = arr.slice(lo, mid + 1);
      const R = arr.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;

      while (i < L.length && j < R.length) {
        comparisons++;
        pushStep({ line: 13, explanation: `Compare L[${i}]=${L[i]} vs R[${j}]=${R[j]}.`, status: "Comparing", array: arr, comparing: [lo + i, mid + 1 + j], markers: { left: lo, mid, right: hi } });
        if (L[i] <= R[j]) {
          arr[k++] = L[i++];
        } else {
          arr[k++] = R[j++];
          swaps++;
        }
        pushStep({ line: 14, explanation: `Placed ${arr[k - 1]} at index ${k - 1}.`, status: "Placing", array: arr, swapping: [k - 1], markers: { left: lo, mid, right: hi } });
      }
      while (i < L.length) { arr[k++] = L[i++]; pushStep({ line: 16, explanation: `Copy remaining left element ${arr[k-1]} to index ${k-1}.`, status: "Copying", array: arr, swapping: [k - 1], markers: { left: lo, mid, right: hi } }); }
      while (j < R.length) { arr[k++] = R[j++]; pushStep({ line: 17, explanation: `Copy remaining right element ${arr[k-1]} to index ${k-1}.`, status: "Copying", array: arr, swapping: [k - 1], markers: { left: lo, mid, right: hi } }); }

      const merged = Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx);
      pushStep({ line: 17, explanation: `Subarray [${lo}…${hi}] merged successfully.`, status: "Merged", array: arr, sorted: merged });
    }
  }

  pushStep({ line: 1, explanation: "Merge Sort complete. Array is fully sorted.", status: "Completed", array: arr, sorted: Array.from({ length: n }, (_, k) => k) });
  return steps;
}

export function buildQuickSortSteps(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, comparing = [], swapping = [], sorted = [], markers = {} }) => {
    steps.push({ array: [...arr], line, pass, index: markers.pivot ?? -1, comparisons, swaps, explanation, status, comparing, swapping, sorted, structure: "array", markers });
  };

  const sortedSet = new Set();

  pushStep({ line: 1, explanation: "Starting Quick Sort. A pivot is chosen and the array is partitioned around it.", status: "Ready" });

  function partition(low, high) {
    const pivotVal = arr[high];
    let i = low - 1;
    pass++;
    pushStep({ line: 8, explanation: `Pivot = arr[${high}] = ${pivotVal}. Scanning from index ${low} to ${high - 1}.`, status: "Pivot Chosen", comparing: [high], markers: { pivot: high, i: low - 1, low, high } });

    for (let j = low; j < high; j++) {
      comparisons++;
      pushStep({ line: 10, explanation: `Compare arr[${j}]=${arr[j]} with pivot ${pivotVal}.`, status: "Comparing", comparing: [j, high], markers: { pivot: high, i, j, low, high } });
      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          pushStep({ line: 12, explanation: `arr[${j}]=${arr[j]} <= pivot. Swap arr[${i}] and arr[${j}].`, status: "Swapping", comparing: [high], swapping: [i, j], markers: { pivot: high, i, j, low, high } });
        } else {
          pushStep({ line: 11, explanation: `arr[${j}]=${arr[j]} <= pivot. i advances to ${i}.`, status: "Advancing", comparing: [j, high], markers: { pivot: high, i, j, low, high } });
        }
      }
    }
    const pivotFinal = i + 1;
    [arr[pivotFinal], arr[high]] = [arr[high], arr[pivotFinal]];
    swaps++;
    sortedSet.add(pivotFinal);
    pushStep({ line: 15, explanation: `Place pivot ${pivotVal} at its final position index ${pivotFinal}.`, status: "Pivot Placed", swapping: [pivotFinal, high], sorted: [...sortedSet], markers: { pivot: pivotFinal, low, high } });
    return pivotFinal;
  }

  const stack = [[0, arr.length - 1]];
  while (stack.length) {
    const [low, high] = stack.pop();
    if (low >= high) {
      if (low === high) sortedSet.add(low);
      continue;
    }
    const pi = partition(low, high);
    stack.push([low, pi - 1]);
    stack.push([pi + 1, high]);
  }

  pushStep({ line: 1, explanation: "Quick Sort complete. Array is fully sorted.", status: "Completed", sorted: Array.from({ length: arr.length }, (_, k) => k) });
  return steps;
}

export function buildHeapSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, comparing = [], swapping = [], sorted = [] }) => {
    steps.push({ array: [...arr], line, pass, index: comparing[0] ?? -1, comparisons, swaps, explanation, status, comparing, swapping, sorted, structure: "array", markers: {} });
  };

  pushStep({ line: 1, explanation: "Starting Heap Sort. Phase 1 builds a max-heap from the array.", status: "Ready" });

  function heapify(size, root) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    comparisons++;
    pushStep({ line: 13, explanation: `Heapify at root=${root}. Compare with children (l=${l}, r=${r}).`, status: "Heapifying", comparing: [root, ...(l < size ? [l] : []), ...(r < size ? [r] : [])], sorted: Array.from({ length: n - size }, (_, k) => size + k) });
    if (l < size && arr[l] > arr[largest]) largest = l;
    if (r < size && arr[r] > arr[largest]) largest = r;
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      swaps++;
      pushStep({ line: 17, explanation: `Swap arr[${root}]=${arr[largest]} with arr[${largest}]=${arr[root]} to restore heap property.`, status: "Swapping", swapping: [root, largest], sorted: Array.from({ length: n - size }, (_, k) => size + k) });
      heapify(size, largest);
    }
  }

  // Build max heap
  pushStep({ line: 2, explanation: "Building max-heap by heapifying from the last non-leaf down to root.", status: "Build Heap" });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    pass++;
    heapify(n, i);
  }

  pushStep({ line: 5, explanation: "Max-heap built! The largest element is now at the root (index 0).", status: "Heap Ready", comparing: [0] });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    pass++;
    pushStep({ line: 6, explanation: `Extract max: swap arr[0]=${arr[0]} with arr[${i}]=${arr[i]}. Place ${arr[0]} at its sorted position.`, status: "Extracting Max", swapping: [0, i], sorted: Array.from({ length: n - i }, (_, k) => i + k) });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    heapify(i, 0);
  }

  pushStep({ line: 1, explanation: "Heap Sort complete. Array is fully sorted.", status: "Completed", sorted: Array.from({ length: n }, (_, k) => k) });
  return steps;
}

export function buildShellSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let shifts = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, comparing = [], swapping = [], sorted = [], markers = {} }) => {
    steps.push({ array: [...arr], line, pass, index: comparing[0] ?? -1, comparisons, swaps: shifts, explanation, status, comparing, swapping, sorted, structure: "array", markers });
  };

  pushStep({ line: 1, explanation: "Starting Shell Sort. Elements are sorted with a decreasing gap until gap = 1 (insertion sort).", status: "Ready" });

  let gap = Math.floor(n / 2);
  while (gap > 0) {
    pass++;
    pushStep({ line: 2, explanation: `Gap = ${gap}. Comparing elements ${gap} positions apart.`, status: "New Gap", markers: { gap } });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      pushStep({ line: 4, explanation: `Pick arr[${i}] = ${temp} as the key to insert.`, status: "Pick Key", comparing: [i], markers: { gap } });
      let j = i;

      while (j >= gap && arr[j - gap] > temp) {
        comparisons++;
        pushStep({ line: 7, explanation: `arr[${j - gap}]=${arr[j - gap]} > key=${temp}. Shift arr[${j - gap}] to index ${j}.`, status: "Shifting", comparing: [j - gap], swapping: [j, j - gap], markers: { gap } });
        arr[j] = arr[j - gap];
        shifts++;
        j -= gap;
      }

      if (j >= gap) {
        comparisons++;
        pushStep({ line: 7, explanation: `arr[${j - gap}]=${arr[j - gap]} <= key=${temp}. Stop shifting.`, status: "Comparing", comparing: [j - gap, j], markers: { gap } });
      }

      arr[j] = temp;
      pushStep({ line: 9, explanation: `Place key=${temp} at index ${j}.`, status: "Placed", swapping: [j], markers: { gap } });
    }
    gap = Math.floor(gap / 2);
  }

  pushStep({ line: 1, explanation: "Shell Sort complete. Array is fully sorted.", status: "Completed", sorted: Array.from({ length: n }, (_, k) => k) });
  return steps;
}

export function buildCountingSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, comparing = [], swapping = [], sorted = [], markers = {} }) => {
    steps.push({ array: [...arr], line, pass, index: comparing[0] ?? -1, comparisons, swaps: 0, explanation, status, comparing, swapping, sorted, structure: "array", markers });
  };

  pushStep({ line: 1, explanation: "Starting Counting Sort. This is a non-comparison based sort that counts element frequencies.", status: "Ready" });

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  // Phase 1: Count
  pass = 1;
  pushStep({ line: 2, explanation: `Phase 1: Count frequencies. Max value = ${max}, count array size = ${max + 1}.`, status: "Counting" });
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    comparisons++;
    pushStep({ line: 3, explanation: `Count arr[${i}]=${arr[i]}. count[${arr[i]}] is now ${count[arr[i]]}.`, status: "Counting", comparing: [i], markers: { phase: 1 } });
  }

  // Phase 2: Prefix sum
  pass = 2;
  pushStep({ line: 5, explanation: "Phase 2: Build prefix sums so each count[i] stores the position of i in output.", status: "Prefix Sum" });
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    pushStep({ line: 6, explanation: `count[${i}] += count[${i - 1}] → count[${i}] = ${count[i]}. (Cumulative frequency up to ${i})`, status: "Prefix Sum", markers: { phase: 2 } });
  }

  // Phase 3: Reconstruct output
  pass = 3;
  const output = new Array(n);
  pushStep({ line: 8, explanation: "Phase 3: Build the sorted output array by placing each element at its counted position.", status: "Reconstruct" });
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val] - 1;
    output[pos] = val;
    count[val]--;
    pushStep({ line: 9, explanation: `Place arr[${i}]=${val} at output[${pos}]. count[${val}] decremented to ${count[val]}.`, status: "Placing", comparing: [i], swapping: [pos], markers: { phase: 3 } });
  }

  for (let i = 0; i < n; i++) arr[i] = output[i];
  pushStep({ line: 11, explanation: "Counting Sort complete. Output array copied back to input array.", status: "Completed", sorted: Array.from({ length: n }, (_, k) => k) });
  return steps;
}

export function buildRadixSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let pass = 0;

  const pushStep = ({ line, explanation, status, comparing = [], swapping = [], sorted = [], markers = {} }) => {
    steps.push({ array: [...arr], line, pass, index: comparing[0] ?? -1, comparisons, swaps: 0, explanation, status, comparing, swapping, sorted, structure: "array", markers });
  };

  pushStep({ line: 1, explanation: "Starting Radix Sort. The array is sorted digit by digit, from the least significant digit (LSD) to the most significant.", status: "Ready" });

  const max = Math.max(...arr);
  let exp = 1;
  let digitPass = 0;

  while (Math.floor(max / exp) > 0) {
    digitPass++;
    pass = digitPass;
    const digitName = exp === 1 ? "units" : exp === 10 ? "tens" : exp === 100 ? "hundreds" : `10^${Math.log10(exp)}`;
    pushStep({ line: 3, explanation: `Pass ${digitPass}: Sort by the ${digitName} digit (divisor = ${exp}).`, status: "New Digit Pass", markers: { exp, digitPass } });

    const output = new Array(n);
    const count = new Array(10).fill(0);

    // Count digit occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      comparisons++;
      pushStep({ line: 11, explanation: `arr[${i}]=${arr[i]} → ${digitName} digit = ${digit}. count[${digit}] = ${count[digit]}.`, status: "Counting", comparing: [i], markers: { exp, digitPass } });
    }

    // Prefix sum
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    pushStep({ line: 13, explanation: `Built prefix sums for digit ${digitName}. Positions are now determined.`, status: "Prefix Sum", markers: { exp, digitPass } });

    // Build output
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      count[digit]--;
      pushStep({ line: 15, explanation: `Place arr[${i}]=${arr[i]} (digit=${digit}) at output position ${pos}.`, status: "Placing", comparing: [i], swapping: [pos], markers: { exp, digitPass } });
    }

    for (let i = 0; i < n; i++) arr[i] = output[i];
    pushStep({ line: 17, explanation: `Pass ${digitPass} complete. Array sorted by ${digitName} digit.`, status: "Pass Done", sorted: [], markers: { exp, digitPass } });

    exp *= 10;
  }

  pushStep({ line: 1, explanation: "Radix Sort complete. Array is fully sorted.", status: "Completed", sorted: Array.from({ length: n }, (_, k) => k) });
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
  if (algorithm.slug === "merge-sort") return buildMergeSortSteps(input);
  if (algorithm.slug === "quick-sort") return buildQuickSortSteps(input);
  if (algorithm.slug === "heap-sort") return buildHeapSortSteps(input);
  if (algorithm.slug === "shell-sort") return buildShellSortSteps(input);
  if (algorithm.slug === "counting-sort") return buildCountingSortSteps(input);
  if (algorithm.slug === "radix-sort") return buildRadixSortSteps(input);
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
