import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { algorithms } from "../src/data/algorithms.js";
import { educationalSource } from "../src/data/educationalCode.js";

const compiler = process.env.CXX ?? "g++";
if (spawnSync(compiler, ["--version"], { encoding: "utf8" }).error) {
  console.error(
    "C++ compilation unverified: g++ was not found. Install a compiler or set CXX.",
  );
  process.exit(1);
}
const directory = resolve(".cache/cpp");
mkdirSync(directory, { recursive: true });
const exercises = {
  "bubble-sort": "int a[]={3,1,2};bubbleSort(a,3);assert(is_sorted(a,a+3));",
  "selection-sort":
    "int a[]={3,1,2};selectionSort(a,3);assert(is_sorted(a,a+3));",
  "insertion-sort":
    "int a[]={3,1,2};insertionSort(a,3);assert(is_sorted(a,a+3));",
  "merge-sort":
    "vector<int>a={3,1,2};mergeSort(a);assert(is_sorted(a.begin(),a.end()));",
  "quick-sort": "int a[]={3,1,2};quickSort(a,0,2);assert(is_sorted(a,a+3));",
  "heap-sort": "int a[]={3,1,2};heapSort(a,3);assert(is_sorted(a,a+3));",
  "shell-sort": "int a[]={3,1,2};shellSort(a,3);assert(is_sorted(a,a+3));",
  "counting-sort":
    "int a[]={3,1,2};countingSort(a,3);assert(is_sorted(a,a+3));",
  "radix-sort": "int a[]={3,1,2};radixSort(a,3);assert(is_sorted(a,a+3));",
  "linear-search": "int a[]={3,1,2};assert(linearSearch(a,3,1)==1);",
  "binary-search": "int a[]={1,2,3};assert(binarySearch(a,3,2)==1);",
  avl: "Node*r=nullptr;for(int v:{21,10,7,31,12,70,58,37,26,93,33})r=insertAVL(r,v);function<int(Node*)>check=[&](Node*n){if(!n)return 0;int l=check(n->left),rr=check(n->right);assert(abs(l-rr)<=1);assert(n->height==1+max(l,rr));return n->height;};check(r);",
  "n-queens":
    "assert(solveQueens(4).size()==2);assert(solveQueens(5).size()==10);assert(solveQueens(6).size()==4);",
  "string-matching": 'assert((findMatches("AAAA","AA")==vector<int>{0,1,2}));',
  "rabin-karp": 'assert((rabinKarp("AAAA","AA")==vector<int>{0,1,2}));',
  "fractional-knapsack":
    'assert(abs(fractionalKnapsack({{"A",10,60,0},{"B",20,100,1},{"C",30,120,2}},50)-240)<1e-9);',
  "job-scheduling":
    'assert(scheduleJobs({{"A",2,100},{"B",1,19},{"C",2,27},{"D",1,25},{"E",3,15}}).second==142);',
  "bellman-ford": "auto d=bellmanFord(3,{{0,1,4},{1,2,-2}},0);assert(d[2]==2);",
  "floyd-warshall":
    "double inf=numeric_limits<double>::infinity();auto d=floydWarshall({{0,3,inf},{inf,0,-1},{inf,inf,0}});assert(d[0][2]==2);",
};
let verified = 0;
for (const algorithm of algorithms) {
  const source = educationalSource(algorithm).code;
  const file = resolve(directory, algorithm.slug + ".cpp"),
    binary = resolve(
      directory,
      algorithm.slug + (process.platform === "win32" ? ".exe" : ""),
    );
  writeFileSync(
    file,
    source +
      "\nint main(){" +
      (exercises[algorithm.slug] ?? "return 0;") +
      "}\n",
  );
  const compilation = spawnSync(compiler, ["-std=c++17", file, "-o", binary], {
    encoding: "utf8",
    timeout: 30000,
  });
  if (compilation.error || compilation.status !== 0) {
    console.error(algorithm.slug, compilation.stderr ?? compilation.error);
    process.exit(1);
  }
  const execution = spawnSync(binary, [], { encoding: "utf8", timeout: 5000 });
  if (execution.error || execution.status !== 0) {
    console.error(algorithm.slug, execution.stderr ?? execution.error);
    process.exit(1);
  }
  verified++;
}
console.log(
  `${verified} C++ sources compiled and executed; ${Object.keys(exercises).length} include result assertions.`,
);
