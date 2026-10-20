// Complete C++ functions/classes. Named @anchors are consumed by the viewer and tests.
import { graphSources } from "./graphSource.js";
const header = "#include <bits/stdc++.h>\nusing namespace std;\n\n";
const node =
  "struct Node { int value, height=1; Node *left=nullptr, *right=nullptr; Node(int v):value(v){} };\n";
const binaryInsert =
  node +
  `Node* insertBST(Node* root, int value) {
    Node** slot = &root; // @start
    while (*slot) { // @compare
        slot = value < (*slot)->value ? &(*slot)->left : &(*slot)->right; // @visit
    }
    *slot = new Node(value); // @insert
    return root; // @complete
}`;
const avl =
  node +
  `int height(Node* n) { return n ? n->height : 0; }
void updateHeight(Node* n) { n->height = 1 + max(height(n->left), height(n->right)); } // @height
Node* rotateLeft(Node* x) {
    Node* y=x->right; x->right=y->left; y->left=x; // @rotateLeft
    updateHeight(x); updateHeight(y); return y;
}
Node* rotateRight(Node* y) {
    Node* x=y->left; y->left=x->right; x->right=y; // @rotateRight
    updateHeight(y); updateHeight(x); return x;
}
Node* insertAVL(Node* root, int value) {
    vector<Node**> path; Node** slot=&root; // @start
    while (*slot) { // @compare
        path.push_back(slot);
        slot=value < (*slot)->value ? &(*slot)->left : &(*slot)->right; // @visit
    }
    *slot=new Node(value); // @insert
    for (auto it=path.rbegin(); it!=path.rend(); ++it) {
        Node* n=**it; updateHeight(n); // @balance
        int balance=height(n->left)-height(n->right);
        if (balance > 1) {
            if (height(n->left->left) < height(n->left->right)) n->left=rotateLeft(n->left);
            n=rotateRight(n);
        } else if (balance < -1) {
            if (height(n->right->right) < height(n->right->left)) n->right=rotateRight(n->right);
            n=rotateLeft(n);
        }
        **it=n;
    }
    return root; // @complete
}`;
const traversal =
  node +
  `void traverse(Node* node, string order, vector<int>& output) {
    if (!node) return; // @start
    if (order=="pre") output.push_back(node->value); // @visit
    traverse(node->left,order,output);
    if (order=="in") output.push_back(node->value);
    traverse(node->right,order,output);
    if (order=="post") output.push_back(node->value);
}
vector<int> levelOrder(Node* root) {
    vector<int> output; queue<Node*> pending;
    if(root) pending.push(root);
    while(!pending.empty()) {
        Node* n=pending.front(); pending.pop();
        output.push_back(n->value); // @level
        if(n->left) pending.push(n->left);
        if(n->right) pending.push(n->right);
    }
    return output; // @complete
}`;
const linked = (
  doubly,
  circular,
) => `struct Node { int value; Node *next=nullptr${doubly ? ", *prev=nullptr" : ""}; Node(int v):value(v){} };
class List {
    Node *head=nullptr, *tail=nullptr; int count=0;
public:
    void insert(int value,int index) {
        if(index<0 || index>count || count>=16) throw invalid_argument("Invalid index or full list"); // @start
        Node* n=new Node(value); // @create
        if(count==0) { head=tail=n; ${circular ? "n->next=n;" : ""} }
        else if(index==0) {
            n->next=head; ${doubly ? "head->prev=n;" : ""} // @linkNext
            head=n; ${circular ? "tail->next=head;" : ""} // @head
        } else {
            Node* previous=head;
            for(int i=1;i<index;i++) previous=previous->next; // @visit
            n->next=previous->next; // @linkForward
            previous->next=n; // @linkPrev
            ${doubly ? "n->prev=previous; if(n->next) n->next->prev=n; // @linkBack" : ""}
            if(index==count) tail=n;
        }
        count++; // @insert
    }
    int search(int value) {
        Node* current=head;
        for(int i=0;i<count;i++,current=current->next) { // @compare
            if(current->value==value) return i; // @found
        }
        return -1; // @notFound
    }
    bool erase(int value) {
        Node *previous=${circular ? "tail" : "nullptr"}, *current=head;
        for(int i=0;i<count;i++,previous=current,current=current->next) {
            if(current->value!=value) continue;
            if(count==1) head=tail=nullptr;
            else {
                if(current==head) head=current->next; else previous->next=current->next; // @delete
                if(current==tail) tail=previous;
                ${doubly ? "if(current->next) current->next->prev=current->prev; if(head) head->prev=nullptr;" : ""}
                ${circular ? "tail->next=head; // @circular" : ""}
            }
            delete current; count--; return true;
        }
        return false;
    }
    vector<int> traverse(bool backward=false) {
        vector<int> values; Node* current=${doubly ? "backward?tail:head" : "head"};
        for(int i=0;i<count;i++) { values.push_back(current->value); current=${doubly ? "backward?current->prev:current->next" : "current->next"}; } // @traverse
        return values; // @complete
    }
};`;
const stack = `class Stack {
    vector<int> values;
public:
    bool push(int value) {
        if(values.size()>=10) return false; // @start
        values.push_back(value); // @insert
        return true; // @complete
    }
    optional<int> pop() {
        if(values.empty()) return nullopt; // @invalid
        int value=values.back(); values.pop_back(); // @remove
        return value;
    }
    optional<int> peek() { if(values.empty()) return nullopt; return values.back(); } // @peek
};`;
const linearQueue = `class LinearQueue {
    int values[10], front=-1, rear=-1;
public:
    bool enqueue(int value) {
        if(rear==9) return false; // @invalid
        if(front==-1) front=0; // @start
        values[++rear]=value; // @insert
        return true; // @complete
    }
    optional<int> dequeue() {
        if(front==-1 || front>rear) return nullopt;
        return values[front++]; // @remove
    }
}; // Exhausted rear positions are not reused; Clear creates a new queue.`;
const priority = (mode) => `class PriorityQueue {
    vector<int> heap;
    bool higher(int a,int b) { return a ${mode === "min" ? "<" : ">"} b; } // @compare
    void swapAt(int a,int b) { swap(heap[a],heap[b]); } // @swap
public:
    void enqueue(int value) {
        if(heap.size()>=15) throw length_error("Heap full"); // @invalid
        heap.push_back(value); // @insert
        int i=heap.size()-1;
        while(i>0 && higher(heap[i],heap[(i-1)/2])) {swapAt(i,(i-1)/2); i=(i-1)/2;} // @heapifyUp
    }
    optional<int> extract() {
        if(heap.empty()) return nullopt;
        int value=heap[0]; heap[0]=heap.back(); heap.pop_back(); // @remove
        int i=0;
        while(i<(int)heap.size()) {
            int best=i,l=2*i+1,r=l+1;
            if(l<(int)heap.size() && higher(heap[l],heap[best])) best=l;
            if(r<(int)heap.size() && higher(heap[r],heap[best])) best=r;
            if(best==i) break; swapAt(i,best); i=best; // @heapifyDown
        }
        return value; // @complete
    }
    optional<int> peek() {if(heap.empty()) return nullopt;return heap[0];} // @peek
};`;

const merge = `void mergeSort(vector<int>& a) {
    int n=a.size(); // @start
    for(int width=1;width<n;width*=2) { // @pass
        for(int lo=0;lo<n;lo+=2*width) {
            int mid=min(lo+width,n),hi=min(lo+2*width,n);
            vector<int> left(a.begin()+lo,a.begin()+mid),right(a.begin()+mid,a.begin()+hi); // @merge
            int i=0,j=0,k=lo;
            while(i<(int)left.size() && j<(int)right.size()) { // @compare
                if(left[i]<=right[j]) a[k++]=left[i++]; else a[k++]=right[j++]; // @write
            }
            while(i<(int)left.size()) a[k++]=left[i++]; // @copyLeft
            while(j<(int)right.size()) a[k++]=right[j++]; // @copyRight
        }
    } // @complete
}`;
const queens = `bool safe(const vector<int>& board,int row,int col) {
    for(int r=0;r<row;r++) { // @compare
        if(board[r]==col || abs(board[r]-col)==row-r) return false; // @conflict
    }
    return true; // @safe
}
void enumerateQueens(vector<int>& board,int row,vector<vector<int>>& solutions) {
    int n=board.size(); // @start
    if(row==n) {solutions.push_back(board);return;} // @solution
    for(int col=0;col<n;col++) { // @row
        if(safe(board,row,col)) {
            board[row]=col; // @assign
            enumerateQueens(board,row+1,solutions);
            board[row]=-1; // @backtrack
        }
    }
} // @complete
vector<vector<int>> solveQueens(int n) {vector<int> board(n,-1);vector<vector<int>> solutions;enumerateQueens(board,0,solutions);return solutions;}`;
const coloring = `bool safeColor(int v,int c,const vector<vector<int>>& adj,const vector<int>& color) {
    for(int neighbor:adj[v]) { // @compare
        if(color[neighbor]==c) return false; // @conflict
    }
    return true;
}
void enumerateColors(int v,int m,const vector<vector<int>>& adj,vector<int>& color,vector<vector<int>>& solutions,int& steps) {
    if(++steps>=12000 || solutions.size()>=200) return; // @budget
    if(v==(int)color.size()) {solutions.push_back(color);return;} // @solution
    for(int c=1;c<=m;c++) {
        if(safeColor(v,c,adj,color)) {
            color[v]=c; // @assign
            enumerateColors(v+1,m,adj,color,solutions,steps);
            color[v]=0; // @backtrack
        }
        if(steps>=12000 || solutions.size()>=200) return;
    }
} // @complete
// Input: a simple undirected graph with <=10 vertices; reject self-loops before enumeration.
// Browser worker additionally enforces a 1500ms wall-time budget and supports cancellation.`;

const fractional = `struct Item {string id; double weight,value; int order;};
double fractionalKnapsack(vector<Item> items,double capacity) {
    stable_sort(items.begin(),items.end(),[](const Item& a,const Item& b){return a.value/a.weight>b.value/b.weight;}); // @sort
    double result=0;
    for(const auto& item:items) {
        if(capacity<=0) break;
        double fraction=min(1.0,capacity/item.weight); // @select
        result+=fraction*item.value; capacity-=fraction*item.weight;
    }
    return result; // @complete
} // Positive weights, nonnegative values/capacity; ties retain input order.`;
const jobs = `struct Job {string id; int deadline; double profit;};
pair<vector<string>,double> scheduleJobs(vector<Job> jobs) {
    stable_sort(jobs.begin(),jobs.end(),[](const Job& a,const Job& b){return a.profit>b.profit;}); // @sort
    int horizon=0;for(auto job:jobs)horizon=max(horizon,job.deadline);
    vector<string> slots(min((int)jobs.size(),horizon));double total=0;
    for(auto job:jobs) {
        int slot=min((int)slots.size(),job.deadline)-1;
        while(slot>=0 && !slots[slot].empty()) slot--; // @compare
        if(slot>=0) {slots[slot]=job.id;total+=job.profit;} // @assign
        // No available slot: skip this job. @skip
    }
    return {slots,total}; // @complete
}`;
const bellman = `struct Edge {int from,to;double weight;};
vector<double> bellmanFord(int n,const vector<Edge>& edges,int source) {
    double INF=numeric_limits<double>::infinity();vector<double> d(n,INF);d[source]=0; // @start
    for(int pass=1;pass<n;pass++) {
        bool changed=false;
        for(auto e:edges) { // @compare
            if(isfinite(d[e.from]) && d[e.from]+e.weight<d[e.to]) {d[e.to]=d[e.from]+e.weight;changed=true;} // @relax
        }
        if(!changed)break;
    }
    vector<bool> affected(n,false);
    for(auto e:edges)if(isfinite(d[e.from]) && d[e.from]+e.weight<d[e.to])affected[e.to]=true;
    for(int pass=0;pass<n;pass++)for(auto e:edges)if(affected[e.from])affected[e.to]=true;
    for(int v=0;v<n;v++)if(affected[v])d[v]=-INF; // @negativeCycle
    return d; // @complete
}`;
const floyd = `vector<vector<double>> floydWarshall(vector<vector<double>> d) {
    int n=d.size(); // @start
    for(int k=0;k<n;k++)for(int i=0;i<n;i++)for(int j=0;j<n;j++) {
        if(isfinite(d[i][k]) && isfinite(d[k][j]) && d[i][k]+d[k][j]<d[i][j]) d[i][j]=d[i][k]+d[k][j]; // @relax
    }
    auto reachable=d;
    for(int k=0;k<n;k++)if(reachable[k][k]<0)for(int i=0;i<n;i++)for(int j=0;j<n;j++) {
        if(isfinite(reachable[i][k]) && isfinite(reachable[k][j]))d[i][j]=-numeric_limits<double>::infinity(); // @negativeCycle
    }
    return d; // @complete
} // Initialize diagonal to zero, absent directed edges to +infinity.`;
const naive = `vector<int> findMatches(const string& text,const string& pattern) {
    vector<int> matches;int n=text.size(),m=pattern.size(); // @start
    if(m==0) {for(int i=0;i<=n;i++)matches.push_back(i);return matches;}
    for(int i=0;i+m<=n;i++) {
        int j=0;
        while(j<m && text[i+j]==pattern[j])j++; // @compare
        if(j==m) matches.push_back(i); // @match
    }
    return matches; // @complete
}`;
const rabin = `vector<int> rabinKarp(const string& text,const string& pattern) {
    const int base=256,mod=101;int n=text.size(),m=pattern.size();vector<int> matches; // @start
    if(m==0) {for(int i=0;i<=n;i++)matches.push_back(i);return matches;}
    if(m>n)return matches;
    int power=1,ph=0,wh=0;
    for(int j=0;j<m-1;j++)power=power*base%mod;
    for(int j=0;j<m;j++){ph=(ph*base+(unsigned char)pattern[j])%mod;wh=(wh*base+(unsigned char)text[j])%mod;}
    for(int i=0;i+m<=n;i++) {
        if(wh==ph) { // @hash
            int j=0;while(j<m && text[i+j]==pattern[j])j++; // @compare
            if(j==m)matches.push_back(i); // @match
            // Equal hashes with unequal characters are collisions; reject them. @collision
        }
        if(i+m<n)wh=((((wh-(unsigned char)text[i]*power)%mod+mod)*base)+(unsigned char)text[i+m])%mod;
    }
    return matches; // @complete
}`;

export const sourceOverrides = {
  ...graphSources,
  "bubble-sort": `void bubbleSort(int arr[],int n) {
    for(int i=0;i<n-1;i++) { // @pass
        bool swapped=false; // @start
        for(int j=0;j<n-i-1;j++) {
            if (arr[j] > arr[j+1]) { // @compare
                swap(arr[j],arr[j+1]); swapped=true; // @swap
            }
        }
        if(!swapped) break;
    } // @complete
}`,
  "merge-sort": merge,
  "n-queens": queens,
  "graph-coloring": coloring,
  avl: avl,
  bst: binaryInsert,
  "binary-tree": binaryInsert,
  "tree-traversal": traversal,
  "singly-linked-list": linked(false, false),
  "doubly-linked-list": linked(true, false),
  "circular-linked-list": linked(false, true),
  "stack-array": stack,
  "linear-queue": linearQueue,
  "priority-queue": priority("max"),
  "max-heap": priority("max"),
  "fractional-knapsack": fractional,
  "job-scheduling": jobs,
  "bellman-ford": bellman,
  "floyd-warshall": floyd,
  "string-matching": naive,
  "rabin-karp": rabin,
};

// Legacy source snippets are mapped centrally by statement, never by scattered line numbers.
const patterns = {
  "bubble-sort": {
    start: /void bubbleSort/,
    pass: /for \(int i/,
    compare: /if \(arr\[j\]/,
    swap: /arr\[j\] = arr\[j \+ 1\]/,
    complete: /^}$/,
  },
  "selection-sort": {
    start: /void selectionSort/,
    pass: /for \(int i/,
    minimum: /int minIdx/,
    compare: /if \(arr\[j\]/,
    newMinimum: /minIdx = j/,
    swap: /arr\[minIdx\] = temp/,
    complete: /^}$/,
  },
  "insertion-sort": {
    start: /void insertionSort/,
    pass: /for \(int i/,
    key: /int key/,
    compare: /while \(j >=/,
    shift: /arr\[j \+ 1\] = arr\[j\]/,
    pointer: /j = j - 1/,
    insert: /arr\[j \+ 1\] = key/,
    complete: /^}$/,
  },
  "quick-sort": {
    start: /void quickSort/,
    pivot: /int pivot =/,
    compare: /if \(arr\[j\]/,
    advance: /i\+\+/,
    swap: /arr\[j\] = temp/,
    placePivot: /arr\[high\] = temp/,
    complete: /^}$/,
  },
  "heap-sort": {
    start: /void heapSort/,
    build: /for \(int i = n \/ 2/,
    compare: /if \(l </,
    swap: /arr\[largest\] = temp/,
    extract: /arr\[i\] = temp/,
    complete: /^}$/,
  },
  "shell-sort": {
    start: /void shellSort/,
    gap: /for \(int gap/,
    key: /int temp/,
    compare: /while \(j >=/,
    shift: /arr\[j\] = arr\[j - gap\]/,
    insert: /arr\[j\] = temp/,
    complete: /^}$/,
  },
  "counting-sort": {
    start: /void countingSort/,
    count: /count\[arr\[i\]\]\+\+/,
    prefix: /count\[i\] \+=/,
    write: /output\[count\[arr\[i\]\] - 1\]/,
    complete: /for \(int i = 0; i < n; i\+\+\) arr\[i\] = output/,
  },
  "radix-sort": {
    start: /void radixSort/,
    digit: /countByDigit\(arr, n, exp\)/,
    count: /count\[\(arr\[i\]/,
    prefix: /count\[i\] \+=/,
    write: /output\[count\[digit\]/,
    complete: /for \(int i = 0; i < n; i\+\+\) arr\[i\] = output/,
  },
  "linear-search": {
    start: /int linearSearch/,
    pass: /for \(int i/,
    compare: /if \(arr\[i\]/,
    found: /return i/,
    notFound: /return -1/,
  },
  "binary-search": {
    start: /int binarySearch/,
    left: /int left/,
    right: /int right/,
    bounds: /while \(left <= right\)/,
    mid: /int mid/,
    compare: /if \(arr\[mid\]/,
    found: /return mid/,
    searchRight: /left = mid \+ 1/,
    searchLeft: /right = mid - 1/,
    notFound: /return -1/,
  },
  "circular-queue": {
    start: /void enqueue/,
    invalid: /if \(isFull\(\)\)/,
    insert: /arr\[rear\] = item/,
    remove: /front = \(front \+ 1\)/,
    complete: /return item/,
  },
  "queue-using-stacks": {
    start: /void enqueue/,
    insert: /s1.push/,
    remove: /s2.pop/,
    compare: /if \(s2.empty/,
    transfer: /s2.push/,
    complete: /return x/,
  },
};
const statusEvents = {
  Ready: "start",
  Initialize: "start",
  Init: "start",
  Start: "start",
  Completed: "complete",
  Done: "complete",
  Failed: "complete",
  Error: "invalid",
  "Start Pass": "pass",
  "New Pass": "pass",
  "Set Minimum": "minimum",
  "Min Found": "minimum",
  "New Minimum": "newMinimum",
  Comparing: "compare",
  Checking: "compare",
  "Checking Edge": "compare",
  Swapping: "swap",
  Swapped: "swap",
  "Set Key": "key",
  "Pick Key": "key",
  "Start Compare": "compare",
  Shifting: "shift",
  "Move Pointer": "pointer",
  Inserted: "insert",
  Merging: "merge",
  Merged: "complete",
  Placing: "write",
  Copying: "copyLeft",
  "Pivot Chosen": "pivot",
  Advancing: "advance",
  "Pivot Placed": "placePivot",
  Heapifying: "compare",
  "Build Heap": "build",
  "Heap Ready": "build",
  "Extracting Max": "extract",
  "New Gap": "gap",
  Placed: "insert",
  Counting: "count",
  "Prefix Sum": "prefix",
  Reconstruct: "write",
  "New Digit Pass": "digit",
  "Pass Done": "complete",
  "Init Left": "left",
  "Init Right": "right",
  "Checking Bounds": "bounds",
  "Checking Mid": "mid",
  Found: "found",
  "Not Found": "notFound",
  "Search Right": "searchRight",
  "Search Left": "searchLeft",
  "Row Check": "row",
  Conflict: "conflict",
  Safe: "safe",
  Solved: "solution",
  Backtracking: "backtrack",
  Coloring: "assign",
  Solution: "solution",
  Visiting: "visit",
  "Update Distance": "relax",
  Update: "relax",
  "Path Found": "path",
  Push: "insert",
  Enqueue: "insert",
  Pop: "remove",
  Dequeue: "remove",
  Peek: "peek",
};

export function sourceEvent(step, slug) {
  if (step.event) return step.event;
  if (slug === "stack-array") {
    if (step.status === "Push") return "start";
    if (step.markers?.operation === "Pop" && step.status === "Done")
      return "remove";
    if (step.markers?.operation === "Peek" && step.status !== "Error")
      return "peek";
  }
  if (slug === "merge-sort" && step.status === "Copying")
    return step.explanation.includes("right") ? "copyRight" : "copyLeft";
  if (slug === "n-queens" && step.status === "Placing") return "assign";
  if (slug === "avl") {
    if (/Left rotating|Left rotated|Left Rotation/.test(step.explanation))
      return "rotateLeft";
    if (/Right rotat|Right Rotation/.test(step.explanation))
      return "rotateRight";
    if (/Heights updated/.test(step.explanation)) return "complete";
  }
  if (/Inserted|Enqueued/.test(step.explanation)) return "insert";
  if (/Comparing|Compare|Checking/.test(step.explanation)) return "compare";
  if (/[Ss]wapp/.test(step.explanation)) return "swap";
  return statusEvents[step.status] ?? null;
}
export function educationalSource(algorithm, mode = "max") {
  let code =
    (algorithm.slug === "priority-queue"
      ? priority(mode)
      : sourceOverrides[algorithm.slug]) ?? algorithm.code;
  const matchers = patterns[algorithm.slug] ?? {};
  let lines = code.split("\n");
  for (const [event, pattern] of Object.entries(matchers)) {
    const index = lines.findIndex((line) => pattern.test(line));
    if (index >= 0) lines[index] += ` // @${event}`;
  }
  code = header + lines.join("\n");
  const anchors = {};
  code.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(/@(\w+)/g)) anchors[match[1]] = index + 1;
  });
  return { code, anchors };
}
export function highlightedLine(algorithm, step, mode) {
  const source = educationalSource(algorithm, mode),
    event = sourceEvent(step, algorithm.slug);
  const candidate = event ? source.anchors[event] : undefined;
  const statement = candidate ? source.code.split("\n")[candidate - 1] : "";
  const executable =
    statement && !/^\s*(?:[{};]+\s*(?:\/\/.*)?|\/\/.*)?$/.test(statement);
  return { ...source, event, line: executable ? candidate : undefined };
}
