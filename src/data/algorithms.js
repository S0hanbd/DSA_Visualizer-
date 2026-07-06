export const categories = [
  {
    name: "Sorting",
    path: "/sorting",
    algorithms: [
      "bubble-sort",
      "selection-sort",
      "insertion-sort",
      "merge-sort",
      "quick-sort",
      "heap-sort",
      "shell-sort",
      "counting-sort",
      "radix-sort",
    ],
  },
  { name: "Searching", path: "/searching", algorithms: ["linear-search", "binary-search"] },
  { name: "Linked List", path: "/linked-list", algorithms: ["singly-linked-list", "doubly-linked-list", "circular-linked-list"] },
  { name: "Stack", path: "/stack", algorithms: ["stack-array"] },
  { name: "Queue", path: "/queue", algorithms: ["linear-queue", "circular-queue", "priority-queue"] },
  { name: "Trees", path: "/trees", algorithms: ["binary-tree", "bst", "avl", "tree-traversal"] },
  { name: "Graphs", path: "/graph", algorithms: ["bfs", "dfs", "dijkstra", "prim", "kruskal"] },
];

const bubbleCode = `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        // swap
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`;

const selectionCode = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`;

const insertionCode = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

const linearCode = `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`;

const binaryCode = `int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`;

const genericCode = (name) => `void ${name.replace(/[^a-zA-Z]/g, "")}(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        // Educational visualization step
        // Update pointers, compare values, or move nodes
    }
}`;

const baseInfo = {
  advantages: ["Easy to understand", "Excellent for classroom demonstrations", "Makes state changes visible"],
  disadvantages: ["Not always optimal for large input", "Performance depends on data shape", "Requires careful implementation"],
  applications: ["Interview preparation", "Compiler and system design foundations", "Problem solving", "Academic labs"],
  flowchart: ["Start", "Read input", "Initialize pointers", "Compare or process values", "Update state", "Finish"],
  pseudocode: ["Initialize required variables", "Repeat until the structure is processed", "Compare active values", "Move, swap, visit, or mark items", "Return the final result"],
};

const makeAlgorithm = ({
  slug,
  title,
  category,
  description,
  best = "O(n)",
  average = "O(n log n)",
  worst = "O(n²)",
  space = "O(1)",
  code,
  type = "concept",
  language,
}) => ({
  slug,
  title,
  category,
  description,
  type,
  complexities: { best, average, worst, space },
  code: code || genericCode(title),
  language: language || "cpp",
  introduction: `${title} is a core ${category.toLowerCase()} concept used to teach how data moves, gets compared, and reaches a final organized state.`,
  working: `The visualization tracks the active indices, completed region, and current explanation so each decision in ${title} can be followed step by step.`,
  ...baseInfo,
});

export const algorithms = [
  makeAlgorithm({
    slug: "bubble-sort",
    title: "Bubble Sort",
    category: "Sorting",
    description: "Repeatedly compares adjacent values and swaps them until the largest values settle at the end.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    code: bubbleCode,
    type: "sorting",
    language: "javascript",
  }),
  makeAlgorithm({ slug: "selection-sort", title: "Selection Sort", category: "Sorting", description: "Selects the minimum value from the unsorted part and places it in order.", code: selectionCode, type: "sorting", language: "javascript" }),
  makeAlgorithm({ slug: "insertion-sort", title: "Insertion Sort", category: "Sorting", description: "Builds a sorted section by inserting each value into its correct position.", best: "O(n)", average: "O(n²)", worst: "O(n²)", code: insertionCode, type: "sorting", language: "javascript" }),
  makeAlgorithm({ slug: "merge-sort", title: "Merge Sort", category: "Sorting", description: "Divides the array into halves, sorts them, and merges the sorted halves.", best: "O(n log n)", worst: "O(n log n)", space: "O(n)", type: "sorting" }),
  makeAlgorithm({ slug: "quick-sort", title: "Quick Sort", category: "Sorting", description: "Partitions around a pivot and recursively sorts the two partitions.", best: "O(n log n)", worst: "O(n²)", space: "O(log n)", type: "sorting" }),
  makeAlgorithm({ slug: "heap-sort", title: "Heap Sort", category: "Sorting", description: "Uses a binary heap to repeatedly extract the maximum value.", best: "O(n log n)", worst: "O(n log n)", type: "sorting" }),
  makeAlgorithm({ slug: "shell-sort", title: "Shell Sort", category: "Sorting", description: "Improves insertion sort by comparing elements across shrinking gaps.", average: "O(n^1.5)", type: "sorting" }),
  makeAlgorithm({ slug: "counting-sort", title: "Counting Sort", category: "Sorting", description: "Counts occurrences of each value and reconstructs the sorted array.", best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(k)", type: "sorting" }),
  makeAlgorithm({ slug: "radix-sort", title: "Radix Sort", category: "Sorting", description: "Sorts numbers digit by digit using stable counting passes.", best: "O(d(n + k))", average: "O(d(n + k))", worst: "O(d(n + k))", space: "O(n + k)", type: "sorting" }),
  makeAlgorithm({ slug: "linear-search", title: "Linear Search", category: "Searching", description: "Checks each array element until the target is found or the array ends.", best: "O(1)", average: "O(n)", worst: "O(n)", code: linearCode, type: "searching" }),
  makeAlgorithm({ slug: "binary-search", title: "Binary Search", category: "Searching", description: "Searches a sorted array by repeatedly halving the active range.", best: "O(1)", average: "O(log n)", worst: "O(log n)", code: binaryCode, type: "searching" }),
  makeAlgorithm({ slug: "singly-linked-list", title: "Singly Linked List", category: "Linked List", description: "A chain of nodes where each node points to the next node.", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "doubly-linked-list", title: "Doubly Linked List", category: "Linked List", description: "Nodes connect forward and backward for two-way traversal.", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "circular-linked-list", title: "Circular Linked List", category: "Linked List", description: "The final node points back to the first node to form a loop.", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "stack-array", title: "Stack Array Implementation", category: "Stack", description: "Uses last-in, first-out operations with an array and a top pointer.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" }),
  makeAlgorithm({ slug: "linear-queue", title: "Linear Queue", category: "Queue", description: "Processes items in first-in, first-out order using front and rear pointers.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" }),
  makeAlgorithm({ slug: "circular-queue", title: "Circular Queue", category: "Queue", description: "Reuses array positions by wrapping front and rear around the array.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" }),
  makeAlgorithm({ slug: "priority-queue", title: "Priority Queue", category: "Queue", description: "Removes elements based on priority rather than arrival order.", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(n)" }),
  makeAlgorithm({ slug: "binary-tree", title: "Binary Tree", category: "Trees", description: "A hierarchical structure where each node has at most two children.", average: "O(n)", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "bst", title: "Binary Search Tree", category: "Trees", description: "A binary tree that keeps smaller values left and larger values right.", best: "O(log n)", average: "O(log n)", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "avl", title: "AVL Tree", category: "Trees", description: "A self-balancing BST that rotates nodes to maintain logarithmic height.", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" }),
  makeAlgorithm({ slug: "tree-traversal", title: "Tree Traversal", category: "Trees", description: "Visits tree nodes in preorder, inorder, postorder, or level order.", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" }),
  makeAlgorithm({ slug: "bfs", title: "Breadth First Search", category: "Graphs", description: "Explores graph nodes level by level using a queue.", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)" }),
  makeAlgorithm({ slug: "dfs", title: "Depth First Search", category: "Graphs", description: "Explores as far as possible along each branch before backtracking.", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)" }),
  makeAlgorithm({ slug: "dijkstra", title: "Dijkstra Algorithm", category: "Graphs", description: "Finds shortest paths from a source in a graph with non-negative weights.", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)" }),
  makeAlgorithm({ slug: "prim", title: "Prim Algorithm", category: "Graphs", description: "Builds a minimum spanning tree by growing from the cheapest connected edge.", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)" }),
  makeAlgorithm({ slug: "kruskal", title: "Kruskal Algorithm", category: "Graphs", description: "Builds a minimum spanning tree by adding safe edges in sorted order.", best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V)" }),
];

export const algorithmMap = Object.fromEntries(algorithms.map((algorithm) => [algorithm.slug, algorithm]));

