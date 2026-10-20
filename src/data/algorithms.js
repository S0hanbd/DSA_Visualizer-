import { capabilities } from "./capabilities.js";
import { sourceOverrides } from "./educationalCode.js";
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
  {
    name: "Searching",
    path: "/searching",
    algorithms: ["linear-search", "binary-search"],
  },
  {
    name: "Linked List",
    path: "/linked-list",
    algorithms: [
      "singly-linked-list",
      "doubly-linked-list",
      "circular-linked-list",
    ],
  },
  { name: "Stack", path: "/stack", algorithms: ["stack-array"] },
  {
    name: "Queue",
    path: "/queue",
    algorithms: [
      "linear-queue",
      "circular-queue",
      "priority-queue",
      "queue-using-stacks",
    ],
  },
  {
    name: "Trees",
    path: "/trees",
    algorithms: ["binary-tree", "bst", "avl", "tree-traversal", "max-heap"],
  },
  {
    name: "Graphs",
    path: "/graph",
    algorithms: ["bfs", "dfs", "dijkstra", "prim", "kruskal", "bellman-ford"],
  },
  {
    name: "Greedy",
    path: "/greedy",
    algorithms: ["fractional-knapsack", "job-scheduling"],
  },
  { name: "Dynamic Programming", path: "/dp", algorithms: ["floyd-warshall"] },
  {
    name: "Backtracking",
    path: "/backtracking",
    algorithms: ["n-queens", "graph-coloring"],
  },
  {
    name: "String Matching",
    path: "/string-matching",
    algorithms: ["string-matching", "rabin-karp"],
  },
];

const queueUsingStacksCode = `#include <iostream>
#include <stack>
using namespace std;

class Queue {
    stack<int> s1, s2;

public:
    void enqueue(int x) {
        if(s1.size()+s2.size()>=6) throw length_error("Queue full");
        s1.push(x);
    }

    int dequeue() {
        if (s1.empty() && s2.empty()) {
            cout << "Queue is empty\\n";
            return -1;
        }

        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }

        int x = s2.top();
        s2.pop();
        return x;
    }
};`;

const circularQueueCode = `#include <iostream>
#define MAX 10

class CircularQueue {
    int front, rear;
    int arr[MAX];

public:
    CircularQueue() {
        front = -1;
        rear = -1;
    }

    bool isFull() {
        return (front == 0 && rear == MAX - 1) || (front == rear + 1);
    }

    bool isEmpty() {
        return (front == -1);
    }

    void enqueue(int item) {
        if (isFull())
            return;
            
        if (front == -1) 
            front = 0;
            
        rear = (rear + 1) % MAX;
        arr[rear] = item;
    }

    int dequeue() {
        if (isEmpty())
            return -1;
            
        int item = arr[front];
        
        if (front == rear) {
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % MAX;
        }
        
        return item;
    }

    int getFront() {
        if (isEmpty()) return -1;
        return arr[front];
    }
    
    int getRear() {
        if (isEmpty()) return -1;
        return arr[rear];
    }
};`;

const bubbleCode = `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp; swapped = true;
            }
        }
        if (!swapped) break;
    }
}`;

const selectionCode = `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`;

const insertionCode = `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`;

const quickCode = `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`;

const heapCode = `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`;

const shellCode = `void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`;

const countingCode = `void countingSort(int arr[], int n) {
    if (n <= 1) return;
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    int* count = new int[max + 1]{0};
    for (int i = 0; i < n; i++) count[arr[i]]++;
    for (int i = 1; i <= max; i++) count[i] += count[i - 1];
    
    int* output = new int[n];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
    
    delete[] count;
    delete[] output;
}`;

const radixCode = `void countByDigit(int arr[], int n, int exp) {
    int* output = new int[n];
    int count[10] = {0};
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
    delete[] output;
}

void radixSort(int arr[], int n) {
    if (n <= 1) return;
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countByDigit(arr, n, exp);
    }
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

const baseInfo = {
  advantages: [
    "Easy to understand",
    "Excellent for classroom demonstrations",
    "Makes state changes visible",
  ],
  disadvantages: [
    "Not always optimal for large input",
    "Performance depends on data shape",
    "Requires careful implementation",
  ],
  applications: [
    "Interview preparation",
    "Compiler and system design foundations",
    "Problem solving",
    "Academic labs",
  ],
  flowchart: [
    "Start",
    "Read input",
    "Initialize pointers",
    "Compare or process values",
    "Update state",
    "Finish",
  ],
  pseudocode: [
    "Initialize required variables",
    "Repeat until the structure is processed",
    "Compare active values",
    "Move, swap, visit, or mark items",
    "Return the final result",
  ],
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
  comingSoon = false,
}) => ({
  slug,
  title,
  category,
  description,
  type,
  comingSoon: comingSoon || !capabilities[slug],
  complexities: { best, average, worst, space },
  code: sourceOverrides[slug] || code || "",
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
    description:
      "Repeatedly compares adjacent values and swaps them until the largest values settle at the end.",
    best: "Ω(n)",
    average: "Θ(n²)",
    worst: "O(n²)",
    space: "O(1)",
    code: bubbleCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "selection-sort",
    title: "Selection Sort",
    category: "Sorting",
    description:
      "Selects the minimum value from the unsorted part and places it in order.",
    best: "Ω(n²)",
    average: "Θ(n²)",
    worst: "O(n²)",
    space: "O(1)",
    code: selectionCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "insertion-sort",
    title: "Insertion Sort",
    category: "Sorting",
    description:
      "Builds a sorted section by inserting each value into its correct position.",
    best: "Ω(n)",
    average: "Θ(n²)",
    worst: "O(n²)",
    space: "O(1)",
    code: insertionCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "merge-sort",
    title: "Merge Sort",
    category: "Sorting",
    description:
      "Divides the array into halves, sorts them, and merges the sorted halves.",
    best: "Ω(n log n)",
    average: "Θ(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "quick-sort",
    title: "Quick Sort",
    category: "Sorting",
    description:
      "Partitions around a pivot and recursively sorts the two partitions.",
    best: "Ω(n log n)",
    average: "Θ(n log n)",
    worst: "O(n²)",
    space: "O(n) worst",
    code: quickCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "heap-sort",
    title: "Heap Sort",
    category: "Sorting",
    description: "Uses a binary heap to repeatedly extract the maximum value.",
    best: "Ω(n log n)",
    average: "Θ(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    code: heapCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "shell-sort",
    title: "Shell Sort",
    category: "Sorting",
    description:
      "Improves insertion sort by comparing elements across shrinking gaps.",
    best: "Ω(n log n)",
    average: "Θ(n^(7/6))",
    worst: "O(n²)",
    space: "O(1)",
    code: shellCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "counting-sort",
    title: "Counting Sort",
    category: "Sorting",
    description:
      "Counts occurrences of each value and reconstructs the sorted array.",
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    space: "O(n + k)",
    code: countingCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "radix-sort",
    title: "Radix Sort",
    category: "Sorting",
    description: "Sorts numbers digit by digit using stable counting passes.",
    best: "O(d(n + k))",
    average: "O(d(n + k))",
    worst: "O(d(n + k))",
    space: "O(n + k)",
    code: radixCode,
    type: "sorting",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "linear-search",
    title: "Linear Search",
    category: "Searching",
    description:
      "Checks each array element until the target is found or the array ends.",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    code: linearCode,
    type: "searching",
  }),
  makeAlgorithm({
    slug: "binary-search",
    title: "Binary Search",
    category: "Searching",
    description:
      "Searches a sorted array by repeatedly halving the active range.",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    code: binaryCode,
    type: "searching",
  }),
  makeAlgorithm({
    slug: "singly-linked-list",
    title: "Singly Linked List",
    category: "Linked List",
    description:
      "A chain of nodes where each node stores data and a pointer to the next node. Supports insert, delete, search, and traverse.",
    best: "O(1) (Insert)",
    average: "O(1) (Delete)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "doubly-linked-list",
    title: "Doubly Linked List",
    category: "Linked List",
    description:
      "Nodes connect forward and backward for two-way traversal. HEAD and TAIL pointers enable O(1) head and tail operations.",
    best: "O(1) (Insert)",
    average: "O(1) (Delete)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "circular-linked-list",
    title: "Circular Linked List",
    category: "Linked List",
    description:
      "The final node's NEXT points back to HEAD, forming a ring. Enables seamless circular traversal without a null check.",
    best: "O(1) (Known tail)",
    average: "O(n) (Search/Delete)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "stack-array",
    title: "Stack Array Implementation",
    category: "Stack",
    description:
      "Uses last-in, first-out operations with an array and a top pointer.",
    best: "O(1) (Push)",
    average: "O(1) (Pop)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "linear-queue",
    title: "Linear Queue",
    category: "Queue",
    description:
      "Processes items in first-in, first-out order using front and rear pointers.",
    best: "O(1) (Enqueue)",
    average: "O(1) (Dequeue)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "circular-queue",
    title: "Circular Queue",
    category: "Queue",
    description:
      "Reuses array positions by wrapping front and rear around the array.",
    best: "O(1) (Enqueue)",
    average: "O(1) (Dequeue)",
    worst: "O(n) (Search)",
    space: "O(n)",
    code: circularQueueCode,
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "priority-queue",
    title: "Priority Queue",
    category: "Queue",
    description:
      "Removes elements based on priority rather than arrival order.",
    best: "O(log n) (Enqueue)",
    average: "O(log n) (Dequeue)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "queue-using-stacks",
    title: "Queue using 2 Stacks",
    category: "Queue",
    description:
      "A queue can be implemented using two stacks. Stack 1 is used for enqueuing items, while Stack 2 is used for dequeuing.",
    best: "O(1) (Enqueue)",
    average: "O(1) (Amortized Dequeue)",
    worst: "O(n) (Search)",
    space: "O(n)",
    code: queueUsingStacksCode,
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "binary-tree",
    title: "Binary Tree (BST construction)",
    category: "Trees",
    description:
      "Construct a binary tree using the BST insertion rule: smaller values left, equal or larger values right.",
    best: "O(1) (Insert)",
    average: "O(log n) (Insert)",
    worst: "O(n) (Insert)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "bst",
    title: "Binary Search Tree",
    category: "Trees",
    description:
      "A binary tree that keeps smaller values left and larger values right.",
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "avl",
    title: "AVL Tree",
    category: "Trees",
    description:
      "A self-balancing BST that rotates nodes to maintain logarithmic height.",
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "tree-traversal",
    title: "Tree Traversal",
    category: "Trees",
    description:
      "Visits tree nodes in preorder, inorder, postorder, or level order.",
    best: "Θ(n)",
    average: "Θ(n)",
    worst: "Θ(n)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "max-heap",
    title: "Max Heap",
    category: "Trees",
    description:
      "A complete binary tree where each parent node is greater than its children.",
    best: "O(1) (Find Max)",
    average: "O(log n) (Insert/Delete)",
    worst: "O(n) (Search)",
    space: "O(n)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "bfs",
    title: "Breadth First Search",
    category: "Graphs",
    description: "Explores graph nodes level by level using a queue.",
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V + E)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "dfs",
    title: "Depth First Search",
    category: "Graphs",
    description:
      "Explores as far as possible along each branch before backtracking.",
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V + E)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "dijkstra",
    title: "Dijkstra Algorithm",
    category: "Graphs",
    description:
      "Finds shortest paths from a source in a graph with non-negative weights.",
    best: "O(V² + E)",
    average: "O(V² + E)",
    worst: "O(V² + E)",
    space: "O(V + E)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "prim",
    title: "Prim Algorithm",
    category: "Graphs",
    description:
      "Builds a minimum spanning tree by growing from the cheapest connected edge.",
    best: "O(V² + E)",
    average: "O(V² + E)",
    worst: "O(V² + E)",
    space: "O(V + E)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "kruskal",
    title: "Kruskal Algorithm",
    category: "Graphs",
    description:
      "Builds a minimum spanning tree by adding safe edges in sorted order.",
    best: "O(E log E)",
    average: "O(E log V)",
    worst: "O(E log E)",
    space: "O(V)",
    type: "concept",
    language: "cpp",
  }),

  // Dedicated simulations with verified builders and source anchors.
  makeAlgorithm({
    slug: "fractional-knapsack",
    title: "Fractional Knapsack Problem",
    category: "Greedy",
    description:
      "Fills a knapsack with fractional items to maximize total value.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    comingSoon: false,
  }),
  makeAlgorithm({
    slug: "job-scheduling",
    title: "Job Scheduling Problem",
    category: "Greedy",
    description: "Schedules jobs to maximize profit considering deadlines.",
    best: "O(n log n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(n)",
    comingSoon: false,
  }),
  makeAlgorithm({
    slug: "n-queens",
    title: "N-Queens Problem",
    category: "Backtracking",
    description:
      "Places N queens on an NxN chessboard so that no two attack each other.",
    best: "O(N!)",
    average: "O(N!)",
    worst: "O(N!)",
    space: "O(N)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "graph-coloring",
    title: "Graph Coloring Problem",
    category: "Backtracking",
    description:
      "Assigns colors to vertices of a graph so that no two adjacent vertices share the same color. It searches valid colorings with explicit solution, step and time budgets.",
    best: "O(m^V)",
    average: "O(m^V)",
    worst: "O(m^V)",
    space: "O(V)",
    type: "concept",
    language: "cpp",
  }),
  makeAlgorithm({
    slug: "bellman-ford",
    title: "Bellman-Ford Algorithm",
    category: "Graphs",
    description:
      "Computes shortest paths from a single source vertex to all other vertices.",
    best: "O(V + E)",
    average: "O(V · E)",
    worst: "O(V · E)",
    space: "O(V)",
    comingSoon: false,
  }),
  makeAlgorithm({
    slug: "floyd-warshall",
    title: "Floyd-Warshall Algorithm",
    category: "Dynamic Programming",
    description:
      "Finds shortest paths in a directed weighted graph with positive or negative edge weights.",
    best: "O(V³)",
    average: "O(V³)",
    worst: "O(V³)",
    space: "O(V²)",
    comingSoon: false,
  }),
  makeAlgorithm({
    slug: "string-matching",
    title: "String Matching Algorithms",
    category: "String Matching",
    description:
      "Naive ASCII matching checks every starting position, including overlapping matches and empty-pattern boundaries.",
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(nm + n + m)",
    space: "O(1)",
    comingSoon: false,
  }),
  makeAlgorithm({
    slug: "rabin-karp",
    title: "Rabin-Karp Algorithm",
    category: "String Matching",
    description:
      "Uses a rolling hash and character verification to find every occurrence of one ASCII pattern, including overlaps.",
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(nm + n + m)",
    space: "O(1)",
    comingSoon: false,
  }),
];

export const algorithmMap = Object.fromEntries(
  algorithms.map((algorithm) => [algorithm.slug, algorithm]),
);
