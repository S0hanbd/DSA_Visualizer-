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
  { name: "Trees", path: "/trees", algorithms: ["binary-tree", "bst", "avl", "tree-traversal", "max-heap"] },
  { name: "Graphs", path: "/graph", algorithms: ["bfs", "dfs", "dijkstra", "prim", "kruskal"] },
];

const stackCode = `#include <iostream>
using namespace std;

#define MAX 1000

class Stack {
    int top;
public:
    int a[MAX]; 

    Stack() { top = -1; }
    
    bool push(int x) {
        if (top >= (MAX - 1)) {
            cout << "Stack Overflow";
            return false;
        } else {
            a[++top] = x;
            return true;
        }
    }

    int pop() {
        if (top < 0) {
            cout << "Stack Underflow";
            return 0;
        } else {
            int x = a[top--];
            return x;
        }
    }
    
    int peek() {
        if (top < 0) {
            cout << "Stack is Empty";
            return 0;
        } else {
            int x = a[top];
            return x;
        }
    }

    bool isEmpty() {
        return (top < 0);
    }
};`;

const maxHeapCode = `class MaxHeap {
    int arr[100];
    int size;
public:
    MaxHeap() : size(0) {}

    void insert(int val) {
        arr[size] = val;
        int i = size;
        size++;
        
        while (i != 0 && arr[(i - 1) / 2] < arr[i]) {
            int temp = arr[i];
            arr[i] = arr[(i - 1) / 2];
            arr[(i - 1) / 2] = temp;
            i = (i - 1) / 2;
        }
    }
};`;

const bstCode = `struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
    Node* root;
    
    Node* insert(Node* node, int data) {
        if (!node) return new Node(data);
        if (data < node->data)
            node->left = insert(node->left, data);
        else if (data > node->data)
            node->right = insert(node->right, data);
        return node;
    }
public:
    BST() : root(nullptr) {}
    void insert(int data) { root = insert(root, data); }
};`;

const avlCode = `struct Node {
    int data, height;
    Node *left, *right;
    Node(int d) : data(d), height(1), left(nullptr), right(nullptr) {}
};

class AVL {
    int height(Node* n) { return n ? n->height : 0; }
    
    Node* rightRotate(Node* y) {
        Node* x = y->left;
        Node* T2 = x->right;
        x->right = y;
        y->left = T2;
        y->height = max(height(y->left), height(y->right)) + 1;
        x->height = max(height(x->left), height(x->right)) + 1;
        return x;
    }
    // Left rotate and insert similar...
};`;

const dijkstraCode = `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int, int> iPair;

class Graph {
    int V; // No. of vertices
    vector<pair<int, int>>* adj;

public:
    Graph(int V) {
        this->V = V;
        adj = new vector<pair<int, int>>[V];
    }

    void addEdge(int u, int v, int w) {
        adj[u].push_back(make_pair(v, w));
        adj[v].push_back(make_pair(u, w));
    }

    void shortestPath(int src) {
        priority_queue<iPair, vector<iPair>, greater<iPair>> pq;
        vector<int> dist(V, INT_MAX);

        pq.push(make_pair(0, src));
        dist[src] = 0;

        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();

            for (auto x : adj[u]) {
                int v = x.first;
                int weight = x.second;

                if (dist[v] > dist[u] + weight) {
                    dist[v] = dist[u] + weight;
                    pq.push(make_pair(dist[v], v));
                }
            }
        }
    }
};`;

const bfsCode = `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;
public:
    Graph(int V) {
        this->V = V;
        adj.resize(V);
    }
    void addEdge(int v, int w) {
        adj[v].push_back(w);
    }
    void BFS(int s) {
        vector<bool> visited(V, false);
        queue<int> queue;
        visited[s] = true;
        queue.push(s);
        while(!queue.empty()) {
            s = queue.front();
            cout << s << " ";
            queue.pop();
            for (auto i = adj[s].begin(); i != adj[s].end(); ++i) {
                if (!visited[*i]) {
                    visited[*i] = true;
                    queue.push(*i);
                }
            }
        }
    }
};`;

const dfsCode = `#include <iostream>
#include <vector>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;
    void DFSUtil(int v, vector<bool>& visited) {
        visited[v] = true;
        cout << v << " ";
        for (auto i = adj[v].begin(); i != adj[v].end(); ++i)
            if (!visited[*i])
                DFSUtil(*i, visited);
    }
public:
    Graph(int V) {
        this->V = V;
        adj.resize(V);
    }
    void addEdge(int v, int w) {
        adj[v].push_back(w);
    }
    void DFS(int v) {
        vector<bool> visited(V, false);
        DFSUtil(v, visited);
    }
};`;

const primCode = `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int, int> iPair;

class Graph {
    int V;
    vector<pair<int, int>>* adj;
public:
    Graph(int V) {
        this->V = V;
        adj = new vector<pair<int, int>>[V];
    }
    void addEdge(int u, int v, int w) {
        adj[u].push_back(make_pair(v, w));
        adj[v].push_back(make_pair(u, w));
    }
    void primMST() {
        priority_queue<iPair, vector<iPair>, greater<iPair>> pq;
        int src = 0;
        vector<int> key(V, INT_MAX);
        vector<int> parent(V, -1);
        vector<bool> inMST(V, false);
        pq.push(make_pair(0, src));
        key[src] = 0;
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            if(inMST[u]) continue;
            inMST[u] = true;
            for (auto x : adj[u]) {
                int v = x.first;
                int weight = x.second;
                if (!inMST[v] && key[v] > weight) {
                    key[v] = weight;
                    pq.push(make_pair(key[v], v));
                    parent[v] = u;
                }
            }
        }
    }
};`;

const kruskalCode = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class DSU {
    int* parent;
    int* rank;
public:
    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = -1;
            rank[i] = 1;
        }
    }
    int find(int i) {
        if (parent[i] == -1)
            return i;
        return parent[i] = find(parent[i]);
    }
    void unite(int i, int j) {
        int s1 = find(i);
        int s2 = find(j);
        if (s1 != s2) {
            if (rank[s1] < rank[s2]) {
                parent[s1] = s2;
            } else if (rank[s1] > rank[s2]) {
                parent[s2] = s1;
            } else {
                parent[s2] = s1;
                rank[s1] += 1;
            }
        }
    }
};

class Graph {
    vector<vector<int>> edgelist;
    int V;
public:
    Graph(int V) { this->V = V; }
    void addEdge(int x, int y, int w) {
        edgelist.push_back({w, x, y});
    }
    void kruskals_mst() {
        sort(edgelist.begin(), edgelist.end());
        DSU s(V);
        int ans = 0;
        for (auto edge : edgelist) {
            int w = edge[0];
            int x = edge[1];
            int y = edge[2];
            if (s.find(x) != s.find(y)) {
                s.unite(x, y);
                ans += w;
            }
        }
    }
};`;

const treeTraversalCode = `void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}

void preorder(Node* root) {
    if (!root) return;
    cout << root->data << " ";
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->data << " ";
}`;

const queueCode = `#include <iostream>
using namespace std;

#define MAX 1000

class Queue {
    int front, rear, size;
    int arr[MAX];

public:
    Queue() {
        front = 0;
        rear = -1;
        size = 0;
    }

    bool isFull() {
        return (size == MAX);
    }

    bool isEmpty() {
        return (size == 0);
    }

    void enqueue(int item) {
        if (isFull())
            return;
        rear = (rear + 1) % MAX;
        arr[rear] = item;
        size = size + 1;
    }

    int dequeue() {
        if (isEmpty())
            return -1;
        int item = arr[front];
        front = (front + 1) % MAX;
        size = size - 1;
        return item;
    }

    int getFront() {
        if (isEmpty())
            return -1;
        return arr[front];
    }
    
    int getRear() {
        if (isEmpty())
            return -1;
        return arr[rear];
    }
};`;

const priorityQueueCode = `#include <iostream>
#include <vector>
using namespace std;

class PriorityQueue {
private:
    vector<int> heap;

    int parent(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return (2 * i) + 1; }
    int rightChild(int i) { return (2 * i) + 2; }

    void heapifyUp(int i) {
        while (i > 0 && heap[parent(i)] < heap[i]) {
            swap(heap[parent(i)], heap[i]);
            i = parent(i);
        }
    }

    void heapifyDown(int i) {
        int maxIndex = i;
        int l = leftChild(i);
        if (l < heap.size() && heap[l] > heap[maxIndex])
            maxIndex = l;
        int r = rightChild(i);
        if (r < heap.size() && heap[r] > heap[maxIndex])
            maxIndex = r;
        if (i != maxIndex) {
            swap(heap[i], heap[maxIndex]);
            heapifyDown(maxIndex);
        }
    }

public:
    void enqueue(int p) {
        heap.push_back(p);
        heapifyUp(heap.size() - 1);
    }

    int extractMax() {
        if (heap.empty()) return -1;
        int result = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapifyDown(0);
        return result;
    }
};`;

const bubbleCode = `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
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

const mergeCode = `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int* L = new int[n1];
    int* R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
    delete[] L;
    delete[] R;
}

void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
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

const singlyCode = `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // Insert at head — O(1)
    void insertAtHead(int data) {
        Node* node = new Node(data);
        node->next = head;
        head = node;
    }

    // Insert at tail — O(n)
    void insertAtTail(int data) {
        Node* node = new Node(data);
        if (!head) { head = node; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }

    // Insert at position — O(n)
    void insertAt(int data, int pos) {
        if (pos == 0) { insertAtHead(data); return; }
        Node* node = new Node(data);
        Node* curr = head;
        for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
        if (!curr) return;
        node->next = curr->next;
        curr->next = node;
    }

    // Traverse — O(n)
    void traverse() {
        Node* curr = head;
        while (curr) curr = curr->next;
    }

    // Search — O(n)
    Node* search(int target) {
        Node* curr = head;
        while (curr) {
            if (curr->data == target) return curr;
            curr = curr->next;
        }
        return nullptr;
    }

    // Delete head — O(1)
    void deleteAtHead() {
        if (!head) return;
        Node* temp = head;
        head = head->next;
        delete temp;
    }

    // Delete tail — O(n)
    void deleteAtTail() {
        if (!head) return;
        if (!head->next) { delete head; head = nullptr; return; }
        Node* curr = head;
        while (curr->next->next) curr = curr->next;
        delete curr->next;
        curr->next = nullptr;
    }

    // Delete by value — O(n)
    void deleteByValue(int value) {
        if (!head) return;
        if (head->data == value) { 
            Node* temp = head; 
            head = head->next; 
            delete temp; 
            return; 
        }
        Node* prev = head;
        Node* curr = head->next;
        while (curr) {
            if (curr->data == value) {
                prev->next = curr->next;
                delete curr;
                return;
            }
            prev = curr;
            curr = curr->next;
        }
    }
};`;

const doublyCode = `struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
    Node* head;
    Node* tail;
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}

    // Insert at head — O(1)
    void insertAtHead(int data) {
        Node* node = new Node(data);
        if (!head) { head = tail = node; return; }
        node->next = head;
        head->prev = node;
        head = node;
    }

    // Insert at tail — O(1)
    void insertAtTail(int data) {
        Node* node = new Node(data);
        if (!tail) { head = tail = node; return; }
        node->prev = tail;
        tail->next = node;
        tail = node;
    }

    // Traverse forward — O(n)
    void traverseForward() {
        Node* curr = head;
        while (curr) curr = curr->next;
    }

    // Traverse backward — O(n)
    void traverseBackward() {
        Node* curr = tail;
        while (curr) curr = curr->prev;
    }

    // Delete at head — O(1)
    void deleteAtHead() {
        if (!head) return;
        Node* temp = head;
        head = head->next;
        if (head) head->prev = nullptr;
        else tail = nullptr;
        delete temp;
    }

    // Delete at tail — O(1)
    void deleteAtTail() {
        if (!tail) return;
        Node* temp = tail;
        tail = tail->prev;
        if (tail) tail->next = nullptr;
        else head = nullptr;
        delete temp;
    }

    // Delete by value — O(n)
    void deleteByValue(int value) {
        Node* curr = head;
        while (curr) {
            if (curr->data == value) {
                if (curr->prev) curr->prev->next = curr->next;
                if (curr->next) curr->next->prev = curr->prev;
                if (curr == head) head = curr->next;
                if (curr == tail) tail = curr->prev;
                delete curr;
                return;
            }
            curr = curr->next;
        }
    }
};`;

const circularCode = `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class CircularLinkedList {
    Node* head;
public:
    CircularLinkedList() : head(nullptr) {}

    // Insert at head — O(n)
    void insertAtHead(int data) {
        Node* node = new Node(data);
        if (!head) { node->next = node; head = node; return; }
        Node* tail = head;
        while (tail->next != head) tail = tail->next;
        node->next = head;
        tail->next = node;
        head = node;
    }

    // Insert at tail — O(n)
    void insertAtTail(int data) {
        Node* node = new Node(data);
        if (!head) { node->next = node; head = node; return; }
        Node* tail = head;
        while (tail->next != head) tail = tail->next;
        tail->next = node;
        node->next = head;
    }

    // Traverse — O(n)
    void traverse() {
        if (!head) return;
        Node* curr = head;
        do { curr = curr->next; } while (curr != head);
    }

    // Delete at head — O(n)
    void deleteAtHead() {
        if (!head) return;
        if (head->next == head) { delete head; head = nullptr; return; }
        Node* tail = head;
        while (tail->next != head) tail = tail->next;
        Node* temp = head;
        head = head->next;
        tail->next = head;
        delete temp;
    }

    // Delete at tail — O(n)
    void deleteAtTail() {
        if (!head) return;
        if (head->next == head) { delete head; head = nullptr; return; }
        Node* curr = head;
        while (curr->next->next != head) curr = curr->next;
        Node* temp = curr->next;
        curr->next = head;
        delete temp;
    }
};`;

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
    language: "cpp",
  }),
  makeAlgorithm({ slug: "selection-sort", title: "Selection Sort", category: "Sorting", description: "Selects the minimum value from the unsorted part and places it in order.", code: selectionCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "insertion-sort", title: "Insertion Sort", category: "Sorting", description: "Builds a sorted section by inserting each value into its correct position.", best: "O(n)", average: "O(n²)", worst: "O(n²)", code: insertionCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "merge-sort", title: "Merge Sort", category: "Sorting", description: "Divides the array into halves, sorts them, and merges the sorted halves.", best: "O(n log n)", worst: "O(n log n)", space: "O(n)", code: mergeCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "quick-sort", title: "Quick Sort", category: "Sorting", description: "Partitions around a pivot and recursively sorts the two partitions.", best: "O(n log n)", worst: "O(n²)", space: "O(log n)", code: quickCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "heap-sort", title: "Heap Sort", category: "Sorting", description: "Uses a binary heap to repeatedly extract the maximum value.", best: "O(n log n)", worst: "O(n log n)", code: heapCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "shell-sort", title: "Shell Sort", category: "Sorting", description: "Improves insertion sort by comparing elements across shrinking gaps.", average: "O(n^1.5)", code: shellCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "counting-sort", title: "Counting Sort", category: "Sorting", description: "Counts occurrences of each value and reconstructs the sorted array.", best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(k)", code: countingCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "radix-sort", title: "Radix Sort", category: "Sorting", description: "Sorts numbers digit by digit using stable counting passes.", best: "O(d(n + k))", average: "O(d(n + k))", worst: "O(d(n + k))", space: "O(n + k)", code: radixCode, type: "sorting", language: "cpp" }),
  makeAlgorithm({ slug: "linear-search", title: "Linear Search", category: "Searching", description: "Checks each array element until the target is found or the array ends.", best: "O(1)", average: "O(n)", worst: "O(n)", code: linearCode, type: "searching" }),
  makeAlgorithm({ slug: "binary-search", title: "Binary Search", category: "Searching", description: "Searches a sorted array by repeatedly halving the active range.", best: "O(1)", average: "O(log n)", worst: "O(log n)", code: binaryCode, type: "searching" }),
  makeAlgorithm({ slug: "singly-linked-list", title: "Singly Linked List", category: "Linked List", description: "A chain of nodes where each node stores data and a pointer to the next node. Supports insert, delete, search, and traverse.", worst: "O(n)", space: "O(n)", code: singlyCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "doubly-linked-list", title: "Doubly Linked List", category: "Linked List", description: "Nodes connect forward and backward for two-way traversal. HEAD and TAIL pointers enable O(1) head and tail operations.", worst: "O(n)", space: "O(n)", code: doublyCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "circular-linked-list", title: "Circular Linked List", category: "Linked List", description: "The final node's NEXT points back to HEAD, forming a ring. Enables seamless circular traversal without a null check.", worst: "O(n)", space: "O(n)", code: circularCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "stack-array", title: "Stack Array Implementation", category: "Stack", description: "Uses last-in, first-out operations with an array and a top pointer.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)", code: stackCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "linear-queue", title: "Linear Queue", category: "Queue", description: "Processes items in first-in, first-out order using front and rear pointers.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)", code: queueCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "circular-queue", title: "Circular Queue", category: "Queue", description: "Reuses array positions by wrapping front and rear around the array.", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" }),
  makeAlgorithm({ slug: "priority-queue", title: "Priority Queue", category: "Queue", description: "Removes elements based on priority rather than arrival order.", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(n)", code: priorityQueueCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "binary-tree", title: "Binary Tree", category: "Trees", description: "A hierarchical structure where each node has at most two children.", average: "O(n)", worst: "O(n)", space: "O(n)", code: bstCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "bst", title: "Binary Search Tree", category: "Trees", description: "A binary tree that keeps smaller values left and larger values right.", best: "O(log n)", average: "O(log n)", worst: "O(n)", space: "O(n)", code: bstCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "avl", title: "AVL Tree", category: "Trees", description: "A self-balancing BST that rotates nodes to maintain logarithmic height.", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)", code: avlCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "tree-traversal", title: "Tree Traversal", category: "Trees", description: "Visits tree nodes in preorder, inorder, postorder, or level order.", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", code: treeTraversalCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "max-heap", title: "Max Heap", category: "Trees", description: "A complete binary tree where each parent node is greater than its children.", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)", code: maxHeapCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "bfs", title: "Breadth First Search", category: "Graphs", description: "Explores graph nodes level by level using a queue.", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", code: bfsCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "dfs", title: "Depth First Search", category: "Graphs", description: "Explores as far as possible along each branch before backtracking.", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", code: dfsCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "dijkstra", title: "Dijkstra Algorithm", category: "Graphs", description: "Finds shortest paths from a source in a graph with non-negative weights.", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)", code: dijkstraCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "prim", title: "Prim Algorithm", category: "Graphs", description: "Builds a minimum spanning tree by growing from the cheapest connected edge.", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)", code: primCode, type: "concept", language: "cpp" }),
  makeAlgorithm({ slug: "kruskal", title: "Kruskal Algorithm", category: "Graphs", description: "Builds a minimum spanning tree by adding safe edges in sorted order.", best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V)", code: kruskalCode, type: "concept", language: "cpp" }),
];

export const algorithmMap = Object.fromEntries(algorithms.map((algorithm) => [algorithm.slug, algorithm]));

