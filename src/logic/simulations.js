import { buildBubbleSortSteps } from "./bubbleSortSimulation.js";
import { validateNumbers } from "./validation.js";

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
      comparing:
        extra?.compareIdx !== undefined && extra.compareIdx !== null
          ? [extra.compareIdx]
          : [],
      minIdx: extra?.minIdx ?? null,
      swapping: extra?.swapIdx ?? [],
      sorted: Array.from({ length: sortedUpTo }, (_, k) => k),
    });
  };

  pushStep(1, "Starting selection sort.", "Ready", 0, -1, { sortedUpTo: 0 });

  for (let i = 0; i < n - 1; i++) {
    pushStep(
      2,
      `Beginning pass ${i + 1}: find the minimum in the unsorted part of the array.`,
      "Start Pass",
      i + 1,
      i,
      { sortedUpTo: i, minIdx: i },
    );
    let minIdx = i;
    pushStep(
      3,
      `Assume the element at index ${i} is the minimum for now.`,
      "Set Minimum",
      i + 1,
      i,
      { sortedUpTo: i, minIdx: i },
    );

    for (let j = i + 1; j < n; j++) {
      cmp++;
      pushStep(
        5,
        `Compare arr[${j}] = ${arr[j]} with the current minimum arr[${minIdx}] = ${arr[minIdx]}.`,
        "Comparing",
        i + 1,
        j,
        { sortedUpTo: i, minIdx, compareIdx: j },
      );

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        pushStep(
          6,
          `${arr[j]} is smaller, so index ${j} becomes the new minimum.`,
          "New Minimum",
          i + 1,
          j,
          { sortedUpTo: i, minIdx, compareIdx: j },
        );
      }
    }

    const needSwap = minIdx !== i;
    pushStep(
      9,
      needSwap
        ? `Minimum found at index ${minIdx}. It needs to move to index ${i}.`
        : `The element at index ${i} is already the minimum. No swap needed.`,
      "Min Found",
      i + 1,
      i,
      { sortedUpTo: i, minIdx },
    );

    if (needSwap) {
      pushStep(10, `Swap arr[${i}] and arr[${minIdx}].`, "Swapping", i + 1, i, {
        sortedUpTo: i,
        minIdx,
        swapIdx: [i, minIdx],
      });
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      swaps++;
      pushStep(
        10,
        `Swapped. arr[${i}] is now ${arr[i]}.`,
        "Swapped",
        i + 1,
        i,
        { sortedUpTo: i + 1, minIdx: null, swapIdx: [i, minIdx] },
      );
    } else {
      // Just mark it sorted in the next step
      steps[steps.length - 1].sorted = Array.from(
        { length: i + 1 },
        (_, k) => k,
      );
    }
  }

  pushStep(
    13,
    "The array is fully sorted.",
    "Completed",
    Math.max(1, n - 1),
    n - 1,
    { sortedUpTo: n },
  );
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
      swaps: 0,
      shifts,
      comparing:
        extra?.compareIdx !== undefined && extra.compareIdx !== null
          ? [extra.compareIdx]
          : [],
      keyIdx: extra?.keyIdx ?? null,
      swapping: extra?.shiftIdx ?? [], // Map shiftIdx to swapping for highlighting in visualizer
      sorted: Array.from({ length: sortedUpTo }, (_, k) => k),
    });
  };

  pushStep(
    1,
    "Starting insertion sort. The first element counts as a sorted list of one.",
    "Ready",
    0,
    -1,
    { sortedUpTo: 1 },
  );

  for (let i = 1; i < n; i++) {
    pushStep(
      2,
      `Beginning pass ${i}: pick up arr[${i}] as the key to insert into the sorted part on its left.`,
      "Start Pass",
      i,
      i,
      { sortedUpTo: i, keyIdx: i },
    );
    const keyVal = arr[i];
    pushStep(3, `key = arr[${i}] = ${keyVal}.`, "Set Key", i, i, {
      sortedUpTo: i,
      keyIdx: i,
    });

    let j = i - 1;
    let holeIdx = i;
    pushStep(
      4,
      `Start comparing from the end of the sorted part, j = ${j}.`,
      "Start Compare",
      i,
      j,
      { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j >= 0 ? j : null },
    );

    while (j >= 0 && arr[j] > keyVal) {
      cmp++;
      pushStep(
        5,
        `Compare arr[${j}] = ${arr[j]} with key = ${keyVal}. Since it is greater, it must move right.`,
        "Comparing",
        i,
        j,
        { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j },
      );
      pushStep(
        6,
        `Shift arr[${j}] into the open slot at index ${holeIdx}.`,
        "Shifting",
        i,
        j,
        { sortedUpTo: i, keyIdx: holeIdx, shiftIdx: [j, holeIdx] },
      );

      arr[holeIdx] = arr[j];
      shifts++;
      holeIdx = j;
      j = j - 1;

      pushStep(
        7,
        `Move the pointer left. The open slot is now at index ${holeIdx}.`,
        "Move Pointer",
        i,
        j,
        { sortedUpTo: i, keyIdx: holeIdx },
      );
    }

    if (j >= 0) {
      cmp++;
      pushStep(
        5,
        `Compare arr[${j}] = ${arr[j]} with key = ${keyVal}. It is not greater, so the key has found its place.`,
        "Comparing",
        i,
        j,
        { sortedUpTo: i, keyIdx: holeIdx, compareIdx: j },
      );
    } else {
      pushStep(
        5,
        `Reached the start of the array. The key belongs at the front.`,
        "Comparing",
        i,
        0,
        { sortedUpTo: i, keyIdx: holeIdx },
      );
    }

    arr[holeIdx] = keyVal;
    pushStep(
      9,
      `Place key = ${keyVal} into the open slot at index ${holeIdx}.`,
      "Inserted",
      i,
      holeIdx,
      { sortedUpTo: i + 1, keyIdx: holeIdx },
    );
  }

  pushStep(
    11,
    "The array is fully sorted.",
    "Completed",
    Math.max(1, n - 1),
    n - 1,
    { sortedUpTo: n },
  );
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
    }),
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
      }),
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
      }),
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
        }),
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
      }),
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
    }),
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
    }),
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
    }),
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
      }),
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
      }),
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
      }),
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
        }),
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
      }),
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
        }),
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
        }),
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
      }),
    );
  }

  return steps;
}

export function buildMergeSortSteps(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let pass = 0;
  let leftBuffer = [],
    rightBuffer = [];
  let writes = 0;

  const pushStep = ({
    line,
    explanation,
    status,
    array,
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => {
    steps.push({
      array: [...array],
      line,
      pass,
      index: comparing[0] ?? -1,
      comparisons,
      swaps: 0,
      writes,
      leftBuffer: [...leftBuffer],
      rightBuffer: [...rightBuffer],
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers,
    });
  };

  pushStep({
    line: 1,
    explanation:
      "Starting Merge Sort. Merge adjacent sorted runs bottom-up, doubling the run width each pass.",
    status: "Ready",
    array: arr,
  });

  // Iterative bottom-up merge sort for clean step generation
  const n = arr.length;
  for (let width = 1; width < n; width *= 2) {
    pass++;
    pushStep({
      line: 2,
      explanation: `Pass ${pass}: merging subarrays of width ${width}.`,
      status: "New Pass",
      array: arr,
    });

    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width - 1, n - 1);
      const hi = Math.min(lo + 2 * width - 1, n - 1);
      if (mid >= hi) continue;

      const leftZone = Array.from({ length: mid - lo + 1 }, (_, k) => lo + k);
      const rightZone = Array.from({ length: hi - mid }, (_, k) => mid + 1 + k);

      leftBuffer = arr.slice(lo, mid + 1);
      rightBuffer = arr.slice(mid + 1, hi + 1);
      pushStep({
        line: 8,
        explanation: `Merging left subarray [${lo}…${mid}] and right subarray [${mid + 1}…${hi}].`,
        status: "Merging",
        array: arr,
        comparing: leftZone,
        swapping: rightZone,
        markers: { left: lo, mid, right: hi },
      });

      const L = arr.slice(lo, mid + 1);
      const R = arr.slice(mid + 1, hi + 1);
      let i = 0,
        j = 0,
        k = lo;

      while (i < L.length && j < R.length) {
        comparisons++;
        pushStep({
          line: 13,
          explanation: `Compare L[${i}]=${L[i]} vs R[${j}]=${R[j]}.`,
          status: "Comparing",
          array: arr,
          comparing: [lo + i, mid + 1 + j],
          markers: { left: lo, mid, right: hi },
        });
        if (L[i] <= R[j]) {
          arr[k++] = L[i++];
        } else {
          arr[k++] = R[j++];
        }
        writes++;
        pushStep({
          line: 14,
          explanation: `Placed ${arr[k - 1]} at index ${k - 1}.`,
          status: "Placing",
          array: arr,
          swapping: [k - 1],
          markers: { left: lo, mid, right: hi },
        });
      }
      while (i < L.length) {
        arr[k++] = L[i++];
        writes++;
        pushStep({
          line: 16,
          explanation: `Copy remaining left element ${arr[k - 1]} to index ${k - 1}.`,
          status: "Copying",
          array: arr,
          swapping: [k - 1],
          markers: { left: lo, mid, right: hi },
        });
      }
      while (j < R.length) {
        arr[k++] = R[j++];
        writes++;
        pushStep({
          line: 17,
          explanation: `Copy remaining right element ${arr[k - 1]} to index ${k - 1}.`,
          status: "Copying",
          array: arr,
          swapping: [k - 1],
          markers: { left: lo, mid, right: hi },
        });
      }

      const merged = Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx);
      pushStep({
        line: 17,
        explanation: `Subarray [${lo}…${hi}] merged successfully.`,
        status: "Merged",
        array: arr,
        sorted: merged,
      });
    }
  }

  pushStep({
    line: 1,
    explanation: "Merge Sort complete. Array is fully sorted.",
    status: "Completed",
    array: arr,
    sorted: Array.from({ length: n }, (_, k) => k),
  });
  return steps;
}

export function buildQuickSortSteps(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let pass = 0;
  const stack = [];
  const partitions = [];
  let activeRange = null;

  const pushStep = ({
    line,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [...sortedSet],
    markers = {},
  }) => {
    steps.push({
      array: [...arr],
      line,
      pass,
      index: markers.pivot ?? -1,
      comparisons,
      swaps,
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers,
      activeRange: activeRange ? [...activeRange] : null,
      pendingRanges: stack.map((range) => [...range]),
      partitions: partitions.map((range) => ({ ...range })),
    });
  };

  const sortedSet = new Set();

  pushStep({
    line: 1,
    explanation:
      "Starting Quick Sort. A pivot is chosen and the array is partitioned around it.",
    status: "Ready",
  });

  function partition(low, high) {
    const pivotVal = arr[high];
    let i = low - 1;
    pass++;
    pushStep({
      line: 8,
      explanation: `Pivot = arr[${high}] = ${pivotVal}. Scanning from index ${low} to ${high - 1}.`,
      status: "Pivot Chosen",
      comparing: [high],
      markers: { pivot: high, i: low - 1, low, high },
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      pushStep({
        line: 10,
        explanation: `Compare arr[${j}]=${arr[j]} with pivot ${pivotVal}.`,
        status: "Comparing",
        comparing: [j, high],
        markers: { pivot: high, i, j, low, high },
      });
      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          const movedValue = arr[j];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          pushStep({
            line: 12,
            explanation: `Value ${movedValue} <= pivot. Swap arr[${i}] and arr[${j}].`,
            status: "Swapping",
            comparing: [high],
            swapping: [i, j],
            markers: { pivot: high, i, j, low, high },
          });
        } else {
          pushStep({
            line: 11,
            explanation: `arr[${j}]=${arr[j]} <= pivot. i advances to ${i}.`,
            status: "Advancing",
            comparing: [j, high],
            markers: { pivot: high, i, j, low, high },
          });
        }
      }
    }
    const pivotFinal = i + 1;
    [arr[pivotFinal], arr[high]] = [arr[high], arr[pivotFinal]];
    swaps++;
    sortedSet.add(pivotFinal);
    pushStep({
      line: 15,
      explanation: `Place pivot ${pivotVal} at its final position index ${pivotFinal}.`,
      status: "Pivot Placed",
      swapping: [pivotFinal, high],
      sorted: [...sortedSet],
      markers: { pivot: pivotFinal, low, high },
    });
    return pivotFinal;
  }

  stack.push([0, arr.length - 1]);
  while (stack.length) {
    const [low, high] = stack.pop();
    activeRange = [low, high];
    if (low >= high) {
      if (low === high) sortedSet.add(low);
      pushStep({
        status: "Base Case",
        explanation:
          low === high
            ? `Range [${low}…${high}] has one value and needs no partition.`
            : "This subrange is empty; continue with the next pending range.",
      });
      continue;
    }
    const pi = partition(low, high);
    partitions.push({ low, high, pivot: pi });
    stack.push([low, pi - 1]);
    stack.push([pi + 1, high]);
    pushStep({
      status: "Partition Complete",
      explanation: `Pivot is settled at ${pi}. Continue with the right subrange, then the left.`,
      markers: { low, high, pivot: pi },
    });
  }

  pushStep({
    line: 1,
    explanation: "Quick Sort complete. Array is fully sorted.",
    status: "Completed",
    sorted: Array.from({ length: arr.length }, (_, k) => k),
  });
  return steps;
}

export function buildHeapSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let pass = 0;
  let heapSize = n;

  const pushStep = ({
    line,
    event,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [],
  }) => {
    steps.push({
      array: [...arr],
      line,
      event,
      pass,
      index: comparing[0] ?? -1,
      comparisons,
      swaps,
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers: { heapSize },
    });
  };

  pushStep({
    line: 1,
    explanation:
      "Starting Heap Sort. Phase 1 builds a max-heap from the array.",
    status: "Ready",
  });

  function heapify(size, root) {
    heapSize = size;
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    pushStep({
      line: 13,
      event: "sift",
      explanation: `Start sift-down at index ${root}. Check each child that belongs to the active heap.`,
      status: "Heapifying",
      comparing: [root, ...(l < size ? [l] : []), ...(r < size ? [r] : [])],
      sorted: Array.from({ length: n - size }, (_, k) => size + k),
    });
    if (l < size) {
      comparisons++;
      pushStep({
        line: 13,
        status: "Heapifying",
        explanation: `Compare child ${arr[l]} at index ${l} with candidate ${arr[largest]} at index ${largest}.`,
        comparing: [largest, l],
        sorted: Array.from({ length: n - size }, (_, k) => size + k),
      });
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < size) {
      comparisons++;
      pushStep({
        line: 13,
        event: "compareRight",
        status: "Heapifying",
        explanation: `Compare child ${arr[r]} at index ${r} with candidate ${arr[largest]} at index ${largest}.`,
        comparing: [largest, r],
        sorted: Array.from({ length: n - size }, (_, k) => size + k),
      });
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      swaps++;
      pushStep({
        line: 17,
        explanation: `Swap arr[${root}]=${arr[largest]} with arr[${largest}]=${arr[root]} to restore heap property.`,
        status: "Swapping",
        swapping: [root, largest],
        sorted: Array.from({ length: n - size }, (_, k) => size + k),
      });
      heapify(size, largest);
    }
  }

  // Build max heap
  pushStep({
    line: 2,
    explanation:
      "Building max-heap by heapifying from the last non-leaf down to root.",
    status: "Build Heap",
  });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    pass++;
    heapify(n, i);
  }

  pushStep({
    line: 5,
    explanation:
      "Max-heap built! The largest element is now at the root (index 0).",
    status: "Heap Ready",
    comparing: [0],
  });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    pass++;
    pushStep({
      line: 6,
      explanation: `Extract max: swap arr[0]=${arr[0]} with arr[${i}]=${arr[i]}. Place ${arr[0]} at its sorted position.`,
      status: "Extracting Max",
      event: "extract",
      swapping: [0, i],
      sorted: Array.from({ length: n - i - 1 }, (_, k) => i + 1 + k),
    });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    heapSize = i;
    pushStep({
      line: 6,
      status: "Extracted",
      event: "extract",
      explanation: `${arr[i]} is now at final index ${i}. Restore the remaining heap.`,
      swapping: [0, i],
      sorted: Array.from({ length: n - i }, (_, k) => i + k),
    });
    heapify(i, 0);
  }

  heapSize = 0;
  pushStep({
    line: 1,
    explanation: "Heap Sort complete. Array is fully sorted.",
    status: "Completed",
    sorted: Array.from({ length: n }, (_, k) => k),
  });
  return steps;
}

export function buildShellSortSteps(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let shifts = 0;
  let pass = 0;

  const pushStep = ({
    line,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => {
    steps.push({
      array: [...arr],
      line,
      pass,
      index: comparing[0] ?? -1,
      comparisons,
      swaps: 0,
      shifts,
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers,
    });
  };

  pushStep({
    line: 1,
    explanation:
      "Starting Shell Sort. Elements are sorted with a decreasing gap until gap = 1 (insertion sort).",
    status: "Ready",
  });

  let gap = Math.floor(n / 2);
  while (gap > 0) {
    pass++;
    pushStep({
      line: 2,
      explanation: `Gap = ${gap}. Comparing elements ${gap} positions apart.`,
      status: "New Gap",
      markers: { gap },
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      pushStep({
        line: 4,
        explanation: `Pick arr[${i}] = ${temp} as the key to insert.`,
        status: "Pick Key",
        comparing: [i],
        markers: { gap },
      });
      let j = i;

      while (j >= gap && arr[j - gap] > temp) {
        comparisons++;
        pushStep({
          line: 7,
          explanation: `arr[${j - gap}]=${arr[j - gap]} > key=${temp}. Shift arr[${j - gap}] to index ${j}.`,
          status: "Shifting",
          comparing: [j - gap],
          swapping: [j, j - gap],
          markers: { gap },
        });
        arr[j] = arr[j - gap];
        shifts++;
        j -= gap;
      }

      if (j >= gap) {
        comparisons++;
        pushStep({
          line: 7,
          explanation: `arr[${j - gap}]=${arr[j - gap]} <= key=${temp}. Stop shifting.`,
          status: "Comparing",
          comparing: [j - gap, j],
          markers: { gap },
        });
      }

      arr[j] = temp;
      pushStep({
        line: 9,
        explanation: `Place key=${temp} at index ${j}.`,
        status: "Placed",
        swapping: [j],
        markers: { gap },
      });
    }
    gap = Math.floor(gap / 2);
  }

  pushStep({
    line: 1,
    explanation: "Shell Sort complete. Array is fully sorted.",
    status: "Completed",
    sorted: Array.from({ length: n }, (_, k) => k),
  });
  return steps;
}

export function buildCountingSortSteps(input) {
  validateNumbers(input, { max: 999 });
  if (!input.length)
    return [
      makeStep({
        array: [],
        status: "Completed",
        explanation: "Empty input is already sorted.",
      }),
    ];
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0,
    reads = 0,
    writes = 0;
  let count = [],
    output = [];
  let pass = 0;

  const pushStep = ({
    line,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => {
    steps.push({
      array: [...arr],
      line,
      pass,
      index: comparing[0] ?? -1,
      comparisons,
      reads,
      writes,
      count: [...count],
      output: [...output],
      swaps: 0,
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers,
    });
  };

  pushStep({
    line: 1,
    explanation:
      "Starting Counting Sort. This is a non-comparison based sort that counts element frequencies.",
    status: "Ready",
  });

  const max = Math.max(...arr);
  count = new Array(max + 1).fill(0);

  // Phase 1: Count
  pass = 1;
  pushStep({
    line: 2,
    explanation: `Phase 1: Count frequencies. Max value = ${max}, count array size = ${max + 1}.`,
    status: "Counting",
  });
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    reads++;
    writes++;
    pushStep({
      line: 3,
      explanation: `Count arr[${i}]=${arr[i]}. count[${arr[i]}] is now ${count[arr[i]]}.`,
      status: "Counting",
      comparing: [i],
      markers: { phase: 1, countIndex: arr[i] },
    });
  }

  // Phase 2: Prefix sum
  pass = 2;
  pushStep({
    line: 5,
    explanation:
      "Phase 2: Build prefix sums so each count[i] stores the position of i in output.",
    status: "Prefix Sum",
  });
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    writes++;
    pushStep({
      line: 6,
      explanation: `count[${i}] += count[${i - 1}] → count[${i}] = ${count[i]}. (Cumulative frequency up to ${i})`,
      status: "Prefix Sum",
      markers: { phase: 2, countIndex: i },
    });
  }

  // Phase 3: Reconstruct output
  pass = 3;
  output = new Array(n).fill(null);
  pushStep({
    line: 8,
    explanation:
      "Phase 3: Build the sorted output array by placing each element at its counted position.",
    status: "Reconstruct",
  });
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val] - 1;
    output[pos] = val;
    writes++;
    count[val]--;
    writes++;
    reads++;
    pushStep({
      line: 9,
      explanation: `Place arr[${i}]=${val} at output[${pos}]. count[${val}] decremented to ${count[val]}.`,
      status: "Placing",
      comparing: [i],
      swapping: [pos],
      markers: { phase: 3, countIndex: val, outputIndex: pos },
    });
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    writes++;
  }
  pushStep({
    line: 11,
    explanation:
      "Counting Sort complete. Output array copied back to input array.",
    status: "Completed",
    sorted: Array.from({ length: n }, (_, k) => k),
  });
  return steps;
}

export function buildRadixSortSteps(input) {
  validateNumbers(input, { max: 999 });
  if (!input.length)
    return [
      makeStep({
        array: [],
        status: "Completed",
        explanation: "Empty input is already sorted.",
      }),
    ];
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  let comparisons = 0,
    reads = 0,
    writes = 0;
  let count = [],
    output = [];
  let pass = 0;

  const pushStep = ({
    line,
    explanation,
    status,
    comparing = [],
    swapping = [],
    sorted = [],
    markers = {},
  }) => {
    steps.push({
      array: [...arr],
      line,
      pass,
      index: comparing[0] ?? -1,
      comparisons,
      reads,
      writes,
      count: [...count],
      output: [...output],
      swaps: 0,
      explanation,
      status,
      comparing,
      swapping,
      sorted,
      structure: "array",
      markers,
    });
  };

  pushStep({
    line: 1,
    explanation:
      "Starting Radix Sort. The array is sorted digit by digit, from the least significant digit (LSD) to the most significant.",
    status: "Ready",
  });

  const max = Math.max(...arr);
  let exp = 1;
  let digitPass = 0;

  while (Math.floor(max / exp) > 0) {
    digitPass++;
    pass = digitPass;
    output = new Array(n).fill(null);
    count = new Array(10).fill(0);
    const digitName =
      exp === 1
        ? "units"
        : exp === 10
          ? "tens"
          : exp === 100
            ? "hundreds"
            : `10^${Math.log10(exp)}`;
    pushStep({
      line: 3,
      explanation: `Pass ${digitPass}: Sort by the ${digitName} digit (divisor = ${exp}).`,
      status: "New Digit Pass",
      markers: { exp, digitPass },
    });

    // Count digit occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      reads++;
      writes++;
      pushStep({
        line: 11,
        explanation: `arr[${i}]=${arr[i]} → ${digitName} digit = ${digit}. count[${digit}] = ${count[digit]}.`,
        status: "Counting",
        comparing: [i],
        markers: { exp, digitPass, countIndex: digit },
      });
    }

    // Prefix sum
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
      writes++;
    }
    pushStep({
      line: 13,
      explanation: `Built prefix sums for digit ${digitName}. Positions are now determined.`,
      status: "Prefix Sum",
      markers: { exp, digitPass },
    });

    // Build output
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      writes++;
      count[digit]--;
      writes++;
      reads++;
      pushStep({
        line: 15,
        explanation: `Place arr[${i}]=${arr[i]} (digit=${digit}) at output position ${pos}.`,
        status: "Placing",
        comparing: [i],
        swapping: [pos],
        markers: { exp, digitPass, countIndex: digit, outputIndex: pos },
      });
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      writes++;
    }
    pushStep({
      line: 17,
      explanation: `Pass ${digitPass} complete. Array sorted by ${digitName} digit.`,
      status: "Pass Done",
      sorted: [],
      markers: { exp, digitPass },
    });

    exp *= 10;
  }

  pushStep({
    line: 1,
    explanation: "Radix Sort complete. Array is fully sorted.",
    status: "Completed",
    sorted: Array.from({ length: n }, (_, k) => k),
  });
  return steps;
}

export function buildSimulationSteps(input, algorithm, target) {
  const builders = {
    "bubble-sort": buildBubbleSortSteps,
    "selection-sort": buildSelectionSortSteps,
    "insertion-sort": buildInsertionSortSteps,
    "merge-sort": buildMergeSortSteps,
    "quick-sort": buildQuickSortSteps,
    "heap-sort": buildHeapSortSteps,
    "shell-sort": buildShellSortSteps,
    "counting-sort": buildCountingSortSteps,
    "radix-sort": buildRadixSortSteps,
    "linear-search": buildLinearSearchSteps,
    "binary-search": buildBinarySearchSteps,
  };
  const builder = builders[algorithm?.slug];
  if (!builder)
    return [
      {
        array: [...input],
        status: "Unsupported",
        event: "invalid",
        markers: {},
        explanation:
          "This algorithm requires its dedicated input and visualization page.",
      },
    ];
  validateNumbers(input, { min: 1, max: 999 });
  if (
    algorithm.type === "searching" &&
    (!Number.isSafeInteger(target) || target < 1 || target > 999)
  )
    return [
      makeStep({
        array: [...input],
        status: "Error",
        explanation: "Search target must be an integer from 1 to 999.",
      }),
    ];
  return builder(input, target);
}
