export function buildBubbleSortSteps(initialArray) {
  const arr = [...initialArray];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  // Step 0: init
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1, // function bubbleSort(arr) {
    pass: 0,
    index: -1,
    comparisons: 0,
    swaps: 0,
    explanation: "Press Next or Play to start",
    status: "Ready",
  });

  for (let i = 0; i < n - 1; i++) {
    const sorted = Array.from({ length: i }, (_, k) => n - 1 - k);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      line: 3, // for (let i = 0; i < n; i++) {
      pass: i + 1,
      index: i,
      comparisons,
      swaps,
      explanation: `Starting pass ${i + 1} of ${n - 1}`,
      status: "Start Pass",
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        line: 5, // if (arr[j] > arr[j+1]) {
        pass: i + 1,
        index: j,
        comparisons,
        swaps,
        explanation: `Pass ${i + 1} — comparing index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`,
        status: "Comparing",
      });

      if (arr[j] > arr[j + 1]) {
        const leftVal = arr[j];
        const rightVal = arr[j + 1];
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: [...sorted],
          line: 7, // [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
          pass: i + 1,
          index: j,
          comparisons,
          swaps,
          explanation: `Swapped! ${leftVal} and ${rightVal} exchanged`,
          status: "Swapping",
        });
      }
    }

    const passSorted = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...passSorted],
      line: 9, // inner loop close / advancement
      pass: i + 1,
      index: n - i - 2,
      comparisons,
      swaps,
      explanation: `Pass ${i + 1} complete — ${i + 1} element${i > 0 ? "s" : ""} sorted`,
      status: "Pass Complete",
    });
  }

  // Done step
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: arr.map((_, k) => k),
    line: 11, // return arr;
    pass: Math.max(1, n - 1),
    index: -1,
    comparisons,
    swaps,
    explanation: `Sorted! ${comparisons} comparisons, ${swaps} swaps`,
    status: "Completed",
  });

  return steps;
}

export function createRandomArray(size = 9) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 82) + 12);
}
