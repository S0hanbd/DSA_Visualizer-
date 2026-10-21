# Reading the complexity cards

Every catalog page shows only **Time Complexity** and **Space Complexity**. Time is a worst-case upper bound for the stated operation or algorithm variant. Both cards explain why the cost grows that way. Definitions beneath the cards identify variables such as n, V, E, C and S.

The single content source is `src/data/complexities.js`; the shared `ComplexitySummary` renders it for all 37 algorithms. Catalog badges and the design showcase use the same time/space convention. There are no separate best/average/worst cards.

## What is counted

- Time describes the core educational algorithm, rather than generating animation steps, cloning snapshots or rendering the interface. Graph bounds include building adjacency lists from the input edge list where the displayed implementation does so.
- Space includes auxiliary working memory and retained return values. For structure pages, it includes the stored structure, as the explanation states. Existing input arrays/graphs and playback histories are excluded. For example, a search can use constant working space while returning a list of r matches that needs O(r) storage.
- Structure time is **per operation**, not the total cost of constructing an entire structure or processing a batch. Array-backed stack/heap operations assume capacity has already been allocated. Their C++ constructors reserve the demo capacity; their space cards use C for those allocated slots.
- Interactive caps make examples manageable; the cards generalize input size instead of treating every bounded demo as constant time. Coloring's time bound describes a full search before the worker's time/step/solution limits stop it.
- Comparison-based stable sorting in the greedy and Kruskal implementations assumes its temporary buffer is available. Microsoft documents the buffered O(n log n) sorting bound and the alternative used without sufficient memory. [C++ standard-library algorithm reference](https://learn.microsoft.com/en-us/cpp/standard-library/algorithm-functions?view=msvc-170#stable_sort).

## Implementation-specific points

- **Heap sort:** recursive heapify adds O(log n) stack memory. The array itself is sorted in place, but that does not make this recursive implementation's auxiliary space O(1).
- **Quick sort:** a last-element pivot can repeatedly leave an n − 1 partition, producing quadratic time and linear recursion depth.
- **Binary search:** the O(log n) / O(1) cards describe iterative search on already-sorted input. Optional preparation through **Sort and apply** is explicitly requested and excluded from those search costs.
- **Queue using two stacks:** a single dequeue can transfer all n items. The card therefore shows O(n) time rather than substituting an amortized bound for the requested worst-case cost.
- **Dijkstra and Prim:** these implementations scan vertex keys rather than using a heap, so their time bound is O(V² + E).
- **Kruskal:** O(V + E log(E + 1)) includes disjoint-set initialization even if there are no edges. Space includes the sorted edge copy/buffer and the returned forest, rather than only the union-find arrays.
- **N-Queens:** the displayed row-scanning solver enumerates all solutions. At depth r there are at most N!/(N − r)! partial boards with distinct columns. Summing over depths gives O(N!) recursive states as a conservative bound. Each state tries N columns, each safety check scans at most N earlier rows, giving O(N² · N!) time. This is an upper bound derived from the repository implementation, not a claim of a tight bound. Board/call-stack memory is O(N), and retaining S solutions adds O(SN).
- **Graph coloring:** a conservative full-search upper bound is O(m^V · (V + E)), including conflict checks and copying completed assignments. Retaining S solutions adds O(SV) space to adjacency and recursion storage. The worker caps S at 200 and may report a truncated result.
- **Bellman-Ford:** the negative-cycle propagation phase can still scan E edges across V passes. O(VE + V) also includes vertex initialization when E is zero.
- **Naive matching and Rabin-Karp:** both return every occurrence. Repeated character checks, including verification after hash collisions, can require quadratic-in-pattern work across the text. The O(nm + n + m) bound also covers empty-pattern boundary output. Returned positions require O(r + 1) space, even though the scanners use constant working memory.

The comments above are derived from the displayed source and builders. Princeton's [algorithm tables](https://algs4.cs.princeton.edu/cheatsheet/) provide conventional comparisons; their bounds depend on the particular implementation. Emory's [N-Queens backtracking explanation](https://mathcenter.oxford.emory.edu/site/cs171/nQueensProblemAndBacktracking/) distinguishes enumerating all solutions from stopping at the first one. The cards reflect this project's chosen variants.
