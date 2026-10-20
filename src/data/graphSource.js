const edge = `struct Edge {int from,to; double weight;};
vector<vector<pair<int,double>>> adjacency(int n,const vector<Edge>& edges) {
    vector<vector<pair<int,double>>> adj(n);
    for(auto e:edges) {adj[e.from].push_back({e.to,e.weight});adj[e.to].push_back({e.from,e.weight});}
    return adj;
}
// Vertices are indexed 0..n-1; the UI maps its unique IDs to these indices.
// Simple undirected graphs: reject self-loops, parallel edges and missing endpoints.
`;
const path = `vector<int> pathTo(int start,int target,const vector<int>& parent) {
    vector<int> path;vector<bool> seen(parent.size(),false);
    for(int v=target;v!=-1 && !seen[v];v=parent[v]) {seen[v]=true;path.push_back(v);}
    reverse(path.begin(),path.end());
    return !path.empty() && path.front()==start ? path : vector<int>{}; // @path
}
`;
export const graphSources = {
  dijkstra:
    edge +
    path +
    `pair<vector<double>,vector<int>> dijkstra(int n,const vector<Edge>& edges,int start,int target) {
    for(auto e:edges)if(e.weight<0)throw invalid_argument("Dijkstra needs nonnegative weights"); // @invalid
    auto adj=adjacency(n,edges); vector<double> d(n,numeric_limits<double>::infinity());
    vector<int> parent(n,-1);vector<bool> visited(n,false);d[start]=0; // @start
    for(int pass=0;pass<n;pass++) {
        int u=-1;
        for(int v=0;v<n;v++)if(!visited[v] && (u==-1 || d[v]<d[u]))u=v; // @select
        if(u==-1 || !isfinite(d[u]))break;
        if(u==target)break;
        visited[u]=true; // @visit
        for(auto [v,w]:adj[u]) { // @compare
            if(!visited[v] && d[u]+w<d[v]) {d[v]=d[u]+w;parent[v]=u;} // @relax
        }
    }
    return {d,isfinite(d[target])?pathTo(start,target,parent):vector<int>{}}; // @complete
}`,
  bfs:
    edge +
    path +
    `vector<int> bfs(int n,const vector<Edge>& edges,int start,int target) {
    auto adj=adjacency(n,edges);queue<int> pending;vector<int> parent(n,-1);vector<bool> seen(n,false);
    seen[start]=true;pending.push(start); // @start
    while(!pending.empty()) {
        int u=pending.front();pending.pop(); // @visit
        if(u==target)return pathTo(start,target,parent);
        for(auto [v,w]:adj[u]) { // @compare
            if(!seen[v]) {seen[v]=true;parent[v]=u;pending.push(v);} // @insert
        }
    }
    return {}; // @complete
} // BFS minimizes edge count, regardless of displayed edge weights.`,
  dfs:
    edge +
    path +
    `vector<int> dfs(int n,const vector<Edge>& edges,int start,int target) {
    auto adj=adjacency(n,edges);vector<int> pending{start},parent(n,-1);vector<bool> seen(n,false); // @start
    while(!pending.empty()) {
        int u=pending.back();pending.pop_back(); // @visit
        if(seen[u])continue;seen[u]=true;
        if(u==target)return pathTo(start,target,parent);
        for(auto it=adj[u].rbegin();it!=adj[u].rend();++it) { // @compare
            int v=it->first;
            if(!seen[v]) {pending.push_back(v);parent[v]=u;} // @insert
        }
    }
    return {}; // @complete
} // DFS finds a path; it does not promise a shortest path.`,
  prim:
    edge +
    `vector<Edge> prim(int n,const vector<Edge>& edges,int start) {
    auto adj=adjacency(n,edges);vector<Edge> forest;vector<bool> used(n,false);
    vector<double> key(n,numeric_limits<double>::infinity());vector<int> parent(n,-1);key[start]=0; // @start
    for(int pass=0;pass<n;pass++) {
        int u=-1;
        for(int v=0;v<n;v++)if(!used[v] && (u==-1 || key[v]<key[u]))u=v; // @select
        if(u==-1 || !isfinite(key[u]))break;
        used[u]=true;if(parent[u]!=-1)forest.push_back({parent[u],u,key[u]}); // @visit
        for(auto [v,w]:adj[u]) { // @compare
            if(!used[v] && w<key[v]) {key[v]=w;parent[v]=u;} // @relax
        }
    }
    return forest; // @complete
} // If fewer than n-1 edges are returned, only the start component was spanned.`,
  kruskal:
    edge +
    `struct DSU {
    vector<int> parent,rank;
    DSU(int n):parent(n),rank(n,0) {iota(parent.begin(),parent.end(),0);}
    int find(int v) {return parent[v]==v?v:parent[v]=find(parent[v]);}
    bool unite(int a,int b) {
        a=find(a);b=find(b);if(a==b)return false;
        if(rank[a]<rank[b])swap(a,b);parent[b]=a;if(rank[a]==rank[b])rank[a]++;return true;
    }
};
vector<Edge> kruskal(int n,vector<Edge> edges) {
    stable_sort(edges.begin(),edges.end(),[](Edge a,Edge b){return a.weight<b.weight;});DSU dsu(n); // @start
    vector<Edge> forest;
    for(auto e:edges) { // @compare
        if(forest.size()==(size_t)n-1)break;
        if(dsu.unite(e.from,e.to))forest.push_back(e); // @relax
    }
    return forest; // @complete
} // forest.size()==n-1 means connected; otherwise this is a minimum spanning forest.`,
};
