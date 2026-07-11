export function buildGraphColoringSteps(nodes, edges, numColors) {
  const steps = [];
  const solutions = [];
  const V = nodes.length;
  const color = Array(V).fill(0);
  const adj = Array.from({ length: V }, () => []);

  // Map node id to index
  const nodeIds = nodes.map((n) => n.id);
  edges.forEach((e) => {
    const u = nodeIds.indexOf(e.source);
    const v = nodeIds.indexOf(e.target);
    if (u !== -1 && v !== -1) {
      adj[u].push(v);
      adj[v].push(u); // undirected
    }
  });

  const addStep = (status, explanation, line, markers) => {
    steps.push({
      color: [...color],
      solutions: [...solutions], // snapshots of valid colorings
      status,
      explanation,
      line,
      markers,
    });
  };

  const isSafe = (v, c) => {
    addStep("Checking", `Checking if Color ${c} is safe for node ${nodes[v].id}.`, 6, { checking: [v] });

    for (let i = 0; i < adj[v].length; i++) {
      const neighbor = adj[v][i];
      if (color[neighbor] === c) {
        addStep("Conflict", `Node ${nodes[v].id} is adjacent to ${nodes[neighbor].id} which already has Color ${c}.`, 8, { checking: [v], attacking: [neighbor] });
        return false;
      }
    }

    addStep("Safe", `Color ${c} is safe for node ${nodes[v].id}.`, 10, { checking: [v] });
    return true;
  };

  const solve = (v) => {
    if (v === V) {
      solutions.push([...color]);
      addStep("Solution", `Found a valid coloring! Recording solution #${solutions.length}.`, 14, {});
      return;
    }

    for (let c = 1; c <= numColors; c++) {
      if (isSafe(v, c)) {
        color[v] = c;
        addStep("Coloring", `Assigned Color ${c} to node ${nodes[v].id}. Moving to next node.`, 19, { colored: [v] });
        
        solve(v + 1);
        
        color[v] = 0; // backtrack
        addStep("Backtracking", `Backtracking: removing color from node ${nodes[v].id}.`, 21, { backtracking: [v] });
      }
    }

    if (v > 0) {
      addStep("Backtracking", `Explored all ${numColors} colors for node ${nodes[v].id}. Backtracking to previous node.`, 23, { backtracking: [v] });
    }
  };

  if (V === 0) {
    addStep("Done", "Graph is empty.", 0, {});
    return steps;
  }

  addStep("Start", `Initializing Graph Coloring solver for ${V} nodes with ${numColors} colors.`, 13, {});
  solve(0);
  
  addStep("Done", `Search complete. Found ${solutions.length} valid colorings.`, 24, {});

  return steps;
}
