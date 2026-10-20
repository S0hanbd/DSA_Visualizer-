import { validateGraph, errorSteps } from "./validation.js";
export const EXAMPLE_GRAPH = {
  nodes: [
    { id: "A", x: 200, y: 300 },
    { id: "B", x: 400, y: 200 },
    { id: "C", x: 400, y: 400 },
    { id: "D", x: 600, y: 200 },
    { id: "E", x: 600, y: 400 },
    { id: "F", x: 800, y: 300 },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 5 },
    { source: "B", target: "C", weight: 11 },
    { source: "B", target: "D", weight: 9 },
    { source: "C", target: "E", weight: 3 },
    { source: "D", target: "E", weight: 13 },
    { source: "D", target: "F", weight: 2 },
    { source: "E", target: "F", weight: 6 },
  ],
};

export const EXAMPLE_GRAPH_2 = {
  nodes: [
    { id: "A", x: 200, y: 300 },
    { id: "B", x: 400, y: 150 },
    { id: "C", x: 400, y: 450 },
    { id: "D", x: 600, y: 150 },
    { id: "E", x: 600, y: 450 },
  ],
  edges: [
    { source: "A", target: "B", weight: 10 },
    { source: "A", target: "C", weight: 3 },
    { source: "B", target: "C", weight: 1 },
    { source: "B", target: "D", weight: 2 },
    { source: "C", target: "D", weight: 8 },
    { source: "C", target: "E", weight: 2 },
    { source: "E", target: "D", weight: 7 },
  ],
};

export const EXAMPLE_GRAPH_3 = {
  nodes: [
    { id: "S", x: 150, y: 300 },
    { id: "A", x: 350, y: 200 },
    { id: "B", x: 350, y: 400 },
    { id: "C", x: 550, y: 100 },
    { id: "D", x: 550, y: 300 },
    { id: "E", x: 550, y: 500 },
    { id: "T", x: 750, y: 300 },
  ],
  edges: [
    { source: "S", target: "A", weight: 2 },
    { source: "S", target: "B", weight: 5 },
    { source: "A", target: "C", weight: 1 },
    { source: "A", target: "D", weight: 3 },
    { source: "B", target: "D", weight: 1 },
    { source: "B", target: "E", weight: 6 },
    { source: "C", target: "T", weight: 4 },
    { source: "D", target: "T", weight: 2 },
    { source: "E", target: "T", weight: 1 },
  ],
};

export const EXAMPLE_GRAPH_4 = {
  nodes: [
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 250, y: 100 },
    { id: "C", x: 200, y: 300 },
    { id: "D", x: 150, y: 450 },
    { id: "E", x: 400, y: 150 },
    { id: "F", x: 350, y: 350 },
    { id: "G", x: 300, y: 550 },
    { id: "H", x: 550, y: 100 },
    { id: "I", x: 500, y: 250 },
    { id: "J", x: 650, y: 350 },
    { id: "K", x: 450, y: 450 },
    { id: "L", x: 550, y: 600 },
    { id: "M", x: 700, y: 150 },
    { id: "N", x: 800, y: 300 },
    { id: "O", x: 750, y: 500 },
  ],
  edges: [
    { source: "A", target: "B", weight: 3 },
    { source: "A", target: "C", weight: 6 },
    { source: "B", target: "E", weight: 5 },
    { source: "C", target: "B", weight: 2 },
    { source: "C", target: "F", weight: 4 },
    { source: "C", target: "D", weight: 7 },
    { source: "D", target: "G", weight: 4 },
    { source: "E", target: "H", weight: 2 },
    { source: "E", target: "I", weight: 8 },
    { source: "F", target: "E", weight: 3 },
    { source: "F", target: "I", weight: 2 },
    { source: "F", target: "K", weight: 5 },
    { source: "G", target: "F", weight: 6 },
    { source: "G", target: "L", weight: 3 },
    { source: "H", target: "M", weight: 4 },
    { source: "I", target: "H", weight: 1 },
    { source: "I", target: "J", weight: 7 },
    { source: "K", target: "I", weight: 3 },
    { source: "K", target: "L", weight: 2 },
    { source: "K", target: "O", weight: 6 },
    { source: "J", target: "M", weight: 2 },
    { source: "J", target: "N", weight: 5 },
    { source: "J", target: "O", weight: 3 },
    { source: "M", target: "N", weight: 1 },
    { source: "L", target: "O", weight: 7 },
    { source: "N", target: "O", weight: 4 },
  ],
};

function generateDijkstraSteps(nodes, edges, startId, endId) {
  const steps = [];
  const push = (explanation, status, markers = {}) => {
    markers.distances = { ...distances };
    markers.parents = { ...previous };
    steps.push({
      explanation,
      status,
      markers: structuredClone(markers), // Deep copy
    });
  };

  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const graph = {};

  // Initialize data structures
  nodes.forEach((n) => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
    unvisited.add(n.id);
    graph[n.id] = [];
  });

  distances[startId] = 0;

  // Build adjacency list for undirected graph
  edges.forEach((e) => {
    graph[e.source].push({ target: e.target, weight: e.weight });
    graph[e.target].push({ target: e.source, weight: e.weight }); // Undirected
  });

  push(
    `Initialize Dijkstra's Algorithm from Start Node: ${startId}`,
    "Initialize",
    {
      activeNode: startId,
    },
  );

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId = null;
    let minDistance = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) {
      push(
        `All reachable nodes visited. Cannot reach End Node: ${endId}`,
        "Complete",
        {
          success: false,
          distances: { ...distances },
        },
      );
      break;
    }

    push(
      `Visiting node ${currentId} with current shortest distance: ${minDistance}`,
      "Visiting",
      {
        activeNode: currentId,
        visited: [...nodes.map((n) => n.id).filter((id) => !unvisited.has(id))],
      },
    );

    if (currentId === endId) {
      push(
        `Reached End Node: ${endId}! Constructing shortest path...`,
        "Path Found",
        {
          activeNode: currentId,
          visited: [
            ...nodes.map((n) => n.id).filter((id) => !unvisited.has(id)),
            currentId,
          ],
        },
      );
      break;
    }

    unvisited.delete(currentId);
    const neighbors = graph[currentId] || [];

    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.target)) continue;

      const alt = distances[currentId] + neighbor.weight;
      push(
        `Checking neighbor ${neighbor.target}. Distance = ${distances[currentId]} + ${neighbor.weight} = ${alt}`,
        "Checking Edge",
        {
          activeNode: currentId,
          activeEdge: { source: currentId, target: neighbor.target },
          checkingNode: neighbor.target,
          visited: [
            ...nodes.map((n) => n.id).filter((id) => !unvisited.has(id)),
          ],
        },
      );

      if (alt < distances[neighbor.target]) {
        distances[neighbor.target] = alt;
        previous[neighbor.target] = currentId;
        push(
          `New shortest path found for ${neighbor.target}! Updating distance to ${alt}.`,
          "Update Distance",
          {
            activeNode: currentId,
            updatedNode: neighbor.target,
            visited: [
              ...nodes.map((n) => n.id).filter((id) => !unvisited.has(id)),
            ],
          },
        );
      }
    }
  }

  // Construct Path
  const path = [];
  let curr = endId;
  let hasPath = false;
  if (Number.isFinite(distances[endId])) {
    hasPath = true;
    const seen = new Set();
    while (curr != null && !seen.has(curr)) {
      seen.add(curr);
      path.unshift(curr);
      curr = previous[curr];
    }
  }

  if (hasPath && path.includes(endId)) {
    push(
      `Shortest path is ${path.join(" → ")} with total distance ${distances[endId]}.`,
      "Done",
      {
        success: true,
        path: path,
        visited: nodes
          .map((n) => n.id)
          .filter((id) => !unvisited.has(id) || path.includes(id)),
      },
    );
  } else if (!hasPath) {
    push(`No path exists from ${startId} to ${endId}.`, "Failed", {
      success: false,
    });
  }

  return steps;
}

function generateBfsSteps(nodes, edges, startId, endId) {
  const steps = [];
  const push = (explanation, status, markers = {}) => {
    steps.push({ explanation, status, markers: structuredClone(markers) });
  };

  if (!nodes.find((n) => n.id === startId))
    return [
      { status: "Error", explanation: "Start node not found.", markers: {} },
    ];

  push(`Starting Breadth-First Search from Node ${startId}.`, "Init", {
    activeNode: startId,
  });

  const adjacency = Object.fromEntries(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adjacency[e.source].push({ id: e.target, weight: e.weight });
    adjacency[e.target].push({ id: e.source, weight: e.weight });
  }
  const visited = new Set();
  const queue = [startId];
  visited.add(startId);
  const path = [];
  const distances = { [startId]: 0 };
  const parent = {};

  while (queue.length > 0) {
    const current = queue.shift();
    push(`Dequeued Node ${current} from the queue.`, "Visiting", {
      activeNode: current,
      visited: Array.from(visited),
    });

    if (current === endId) {
      // Reconstruct path
      let curr = endId;
      while (curr !== undefined) {
        path.unshift(curr);
        curr = parent[curr];
      }
      push(`Found target Node ${endId}! Path: ${path.join(" -> ")}`, "Done", {
        activeNode: current,
        visited: Array.from(visited),
        path,
        distances,
      });
      return steps;
    }

    // Get neighbors
    const neighbors = [...adjacency[current]];

    for (const neighbor of neighbors) {
      push(
        `Checking neighbor Node ${neighbor.id} of Node ${current}.`,
        "Checking",
        {
          activeNode: current,
          checkingNode: neighbor.id,
          visited: Array.from(visited),
          activeEdge: { source: current, target: neighbor.id },
        },
      );

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor.id);
        distances[neighbor.id] = distances[current] + 1;
        parent[neighbor.id] = current;
        push(`Node ${neighbor.id} is unvisited. Enqueueing it.`, "Enqueue", {
          activeNode: current,
          updatedNode: neighbor.id,
          visited: Array.from(visited),
        });
      } else {
        push(`Node ${neighbor.id} is already visited. Skipping.`, "Skipping", {
          activeNode: current,
          checkingNode: neighbor.id,
          visited: Array.from(visited),
        });
      }
    }
  }

  push(`Queue is empty. Target Node ${endId} was not found.`, "Done", {
    visited: Array.from(visited),
  });
  return steps;
}

function generateDfsSteps(nodes, edges, startId, endId) {
  const steps = [];
  const push = (explanation, status, markers = {}) => {
    steps.push({ explanation, status, markers: structuredClone(markers) });
  };

  if (!nodes.find((n) => n.id === startId))
    return [
      { status: "Error", explanation: "Start node not found.", markers: {} },
    ];

  push(`Starting Depth-First Search from Node ${startId}.`, "Init", {
    activeNode: startId,
  });

  const adjacency = Object.fromEntries(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adjacency[e.source].push({ id: e.target, weight: e.weight });
    adjacency[e.target].push({ id: e.source, weight: e.weight });
  }
  const visited = new Set();
  const stack = [startId];
  const parent = {};
  const path = [];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!visited.has(current)) {
      visited.add(current);
      push(`Popped and visiting Node ${current} from the stack.`, "Visiting", {
        activeNode: current,
        visited: Array.from(visited),
      });

      if (current === endId) {
        let curr = endId;
        while (curr !== undefined) {
          path.unshift(curr);
          curr = parent[curr];
        }
        push(`Found target Node ${endId}! Path: ${path.join(" -> ")}`, "Done", {
          activeNode: current,
          visited: Array.from(visited),
          path,
        });
        return steps;
      }

      const neighbors = [...adjacency[current]];

      // Push neighbors in reverse so left-most is visited first usually
      neighbors.reverse();

      for (const neighbor of neighbors) {
        push(
          `Checking neighbor Node ${neighbor.id} of Node ${current}.`,
          "Checking",
          {
            activeNode: current,
            checkingNode: neighbor.id,
            visited: Array.from(visited),
            activeEdge: { source: current, target: neighbor.id },
          },
        );
        if (!visited.has(neighbor.id)) {
          stack.push(neighbor.id);
          parent[neighbor.id] = current;
          push(`Pushing unvisited Node ${neighbor.id} to stack.`, "Push", {
            activeNode: current,
            updatedNode: neighbor.id,
            visited: Array.from(visited),
          });
        } else {
          push(
            `Node ${neighbor.id} is already visited. Skipping.`,
            "Skipping",
            {
              activeNode: current,
              checkingNode: neighbor.id,
              visited: Array.from(visited),
            },
          );
        }
      }
    } else {
      push(`Popped Node ${current}, but it is already visited.`, "Skipping", {
        visited: Array.from(visited),
      });
    }
  }

  push(`Stack is empty. Target Node ${endId} was not found.`, "Done", {
    visited: Array.from(visited),
  });
  return steps;
}

function generatePrimSteps(nodes, edges, startId) {
  const steps = [],
    used = new Set(),
    mstEdges = [],
    key = Object.fromEntries(nodes.map((n) => [n.id, Infinity])),
    parent = {};
  key[startId] = 0;
  const adj = Object.fromEntries(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adj[e.source].push({ id: e.target, weight: e.weight });
    adj[e.target].push({ id: e.source, weight: e.weight });
  }
  const push = (status, explanation, markers = {}) =>
    steps.push({
      status,
      explanation,
      markers: structuredClone({ visited: [...used], mstEdges, ...markers }),
    });
  push("Init", `Start Prim from ${startId}.`);
  for (let pass = 0; pass < nodes.length; pass++) {
    let u = null;
    for (const node of nodes)
      if (!used.has(node.id) && (u === null || key[node.id] < key[u]))
        u = node.id;
    if (u === null || !Number.isFinite(key[u])) break;
    used.add(u);
    if (parent[u] !== undefined)
      mstEdges.push({ source: parent[u], target: u });
    push("Visiting", `Add ${u} to the start component's tree.`, {
      activeNode: u,
    });
    for (const neighbor of adj[u]) {
      push("Checking", `Check edge ${u}?${neighbor.id} (${neighbor.weight}).`, {
        activeNode: u,
        checkingNode: neighbor.id,
        activeEdge: { source: u, target: neighbor.id },
      });
      if (!used.has(neighbor.id) && neighbor.weight < key[neighbor.id]) {
        key[neighbor.id] = neighbor.weight;
        parent[neighbor.id] = u;
        push(
          "Update",
          `Improve key for ${neighbor.id} to ${neighbor.weight}.`,
          { updatedNode: neighbor.id },
        );
      }
    }
  }
  push(
    "Done",
    used.size === nodes.length
      ? "Minimum spanning tree complete."
      : "Graph disconnected; only the start component was spanned.",
    { connected: used.size === nodes.length },
  );
  return steps;
}

function generateKruskalSteps(nodes, edges) {
  const steps = [];
  const push = (explanation, status, markers = {}) => {
    markers.hideUnused = true;
    steps.push({ explanation, status, markers: structuredClone(markers) });
  };

  if (nodes.length === 0)
    return [{ status: "Error", explanation: "Graph is empty.", markers: {} }];

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const sortedEdgesStr = sortedEdges
    .map((e) => `${e.source}-${e.target} (${e.weight})`)
    .join(", ");

  push(
    `Starting Kruskal's MST Algorithm. Sorted edges by weight:\n${sortedEdgesStr}`,
    "Init",
    {},
  );

  const mstEdges = [];
  let totalCost = 0;

  // Disjoint Set Union (DSU) implementation
  const parent = {};
  const rank = {};
  nodes.forEach((n) => {
    parent[n.id] = n.id;
    rank[n.id] = 0;
  });

  const find = (i) => {
    if (parent[i] === i) return i;
    return (parent[i] = find(parent[i]));
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
      return true;
    }
    return false;
  };

  for (const edge of sortedEdges) {
    if (mstEdges.length === nodes.length - 1) break;

    push(
      `Checking edge ${edge.source}-${edge.target} (weight ${edge.weight}).`,
      "Checking",
      { activeEdge: { source: edge.source, target: edge.target }, mstEdges },
    );

    const root1 = find(edge.source);
    const root2 = find(edge.target);

    if (root1 !== root2) {
      union(root1, root2);
      mstEdges.push({ source: edge.source, target: edge.target });
      totalCost += edge.weight;
      push(
        `Edge ${edge.source}-${edge.target} does not form a cycle. Adding to MST.`,
        "Update",
        { activeEdge: { source: edge.source, target: edge.target }, mstEdges },
      );
    } else {
      push(
        `Edge ${edge.source}-${edge.target} forms a cycle! Skipping.`,
        "Skipping",
        { activeEdge: { source: edge.source, target: edge.target }, mstEdges },
      );
    }
  }

  const connected = mstEdges.length === nodes.length - 1;
  push(
    connected
      ? `Kruskal MST complete. Total cost: ${totalCost}.`
      : `Graph disconnected. Minimum spanning forest complete. Total cost: ${totalCost}.`,
    "Done",
    { mstEdges, connected, totalCost },
  );
  return steps;
}

export function buildDijkstraSteps(nodes, edges, startId, endId) {
  try {
    validateGraph(nodes, edges, { startId, endId, nonnegative: true });
    return generateDijkstraSteps(nodes, edges, startId, endId);
  } catch (error) {
    return errorSteps(error);
  }
}

export function buildBfsSteps(nodes, edges, startId, endId) {
  try {
    validateGraph(nodes, edges, { startId, endId });
    return generateBfsSteps(nodes, edges, startId, endId);
  } catch (error) {
    return errorSteps(error);
  }
}

export function buildDfsSteps(nodes, edges, startId, endId) {
  try {
    validateGraph(nodes, edges, { startId, endId });
    return generateDfsSteps(nodes, edges, startId, endId);
  } catch (error) {
    return errorSteps(error);
  }
}

export function buildPrimSteps(nodes, edges, startId) {
  try {
    validateGraph(nodes, edges, { startId });
    return generatePrimSteps(nodes, edges, startId);
  } catch (error) {
    return errorSteps(error);
  }
}

export function buildKruskalSteps(nodes, edges) {
  try {
    validateGraph(nodes, edges, {});
    return generateKruskalSteps(nodes, edges);
  } catch (error) {
    return errorSteps(error);
  }
}
