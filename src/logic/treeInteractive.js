import { LIMITS, validateNumbers } from "./validation.js";
const countNodes = (root) =>
  root ? 1 + countNodes(root.left) + countNodes(root.right) : 0;
const validateInsert = (root, values) =>
  validateNumbers(values, {
    maxCount: Math.max(0, LIMITS.tree - countNodes(root)),
  });
// Stable IDs belong to nodes, never to their current position.
const uuidv4 = () =>
  Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// ─── LAYOUT HELPER ───────────────────────────────────────────────────────────
// Calculates x,y coordinates for the tree nodes to render nicely.
export function calculateTreeLayout(root) {
  if (!root) return null;

  // Create a deep copy of the tree to avoid mutating past steps
  const cloneTree = (node) => {
    if (!node) return null;
    return {
      ...node,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
    };
  };

  const newRoot = cloneTree(root);

  // Inorder rank provides linear-width spacing even for a skewed tree.
  let rank = 0;
  const place = (node, depth) => {
    if (!node) return;
    place(node.left, depth + 1);
    node.x = rank++ * 64;
    node.y = depth * 70;
    place(node.right, depth + 1);
  };
  place(newRoot, 0);
  const center = newRoot.x;
  const centerNodes = (node) => {
    if (!node) return;
    node.x -= center;
    centerNodes(node.left);
    centerNodes(node.right);
  };
  centerNodes(newRoot);

  return newRoot;
}

function cloneNode(node) {
  if (!node) return null;
  return { ...node, left: cloneNode(node.left), right: cloneNode(node.right) };
}

// ─── BST INSERT ──────────────────────────────────────────────────────────────
export function buildBSTInsertSteps(root, values) {
  validateInsert(root, values);
  const steps = [];
  let currentRoot = cloneNode(root);

  const pushStep = (msg, comparing = [], inserted = null) => {
    steps.push({
      tree: calculateTreeLayout(currentRoot),
      explanation: msg,
      markers: { comparing, inserted },
    });
  };

  if (!currentRoot && values.length > 0) {
    pushStep("Initial empty tree.");
  }

  for (const val of values) {
    const newNode = { id: uuidv4(), val, left: null, right: null, height: 1 };

    if (!currentRoot) {
      currentRoot = newNode;
      pushStep(`Inserted ${val} as the root node.`, [], newNode.id);
      continue;
    }

    let curr = currentRoot;
    let parent = null;
    let isLeft = false;

    while (curr) {
      pushStep(`Comparing ${val} with ${curr.val}.`, [curr.id]);
      parent = curr;
      if (val < curr.val) {
        pushStep(`${val} is less than ${curr.val}. Moving left.`, [curr.id]);
        curr = curr.left;
        isLeft = true;
      } else {
        pushStep(
          `${val} is greater than or equal to ${curr.val}. Moving right.`,
          [curr.id],
        );
        curr = curr.right;
        isLeft = false;
      }
    }

    if (isLeft) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    pushStep(`Found empty spot. Inserted ${val}.`, [], newNode.id);
  }

  return steps;
}

// ─── AVL INSERT ──────────────────────────────────────────────────────────────
export function buildAVLInsertSteps(root, values) {
  validateInsert(root, values);
  const steps = [];
  let currentRoot = cloneNode(root);

  const pushStep = (msg, comparing = [], inserted = null) => {
    steps.push({
      tree: calculateTreeLayout(currentRoot),
      explanation: msg,
      markers: { comparing, inserted },
    });
  };

  const getHeight = (n) => (n ? n.height : 0);
  const updateHeight = (n) => {
    if (n) n.height = 1 + Math.max(getHeight(n.left), getHeight(n.right));
  };
  const getBalance = (n) => (n ? getHeight(n.left) - getHeight(n.right) : 0);

  const leftRotate = (x) => {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    updateHeight(x);
    updateHeight(y);
    return y;
  };

  const rightRotate = (y) => {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    updateHeight(y);
    updateHeight(x);
    return x;
  };

  if (!currentRoot && values.length > 0) {
    pushStep("Initial empty tree.");
  }

  for (const val of values) {
    const newNode = { id: uuidv4(), val, left: null, right: null, height: 1 };

    if (!currentRoot) {
      currentRoot = newNode;
      pushStep(`Inserted ${val} as the root node.`, [], newNode.id);
      continue;
    }

    let curr = currentRoot;
    const path = [];
    while (curr) {
      path.push(curr);
      pushStep(`Comparing ${val} with ${curr.val}.`, [curr.id]);
      if (val < curr.val) {
        pushStep(`${val} is less than ${curr.val}. Moving left.`, [curr.id]);
        if (!curr.left) {
          curr.left = newNode;
          break;
        }
        curr = curr.left;
      } else {
        pushStep(
          `${val} is greater than or equal to ${curr.val}. Moving right.`,
          [curr.id],
        );
        if (!curr.right) {
          curr.right = newNode;
          break;
        }
        curr = curr.right;
      }
    }

    pushStep(`Found empty spot. Inserted ${val}.`, [], newNode.id);

    for (let i = path.length - 1; i >= 0; i--) {
      const node = path[i];
      updateHeight(node);
      const balance = getBalance(node);

      if (balance > 1 || balance < -1) {
        const parent = i > 0 ? path[i - 1] : null;
        const isLeftChild = parent ? parent.left === node : false;

        if (balance > 1) {
          const leftChildBalance = getBalance(node.left);
          if (leftChildBalance >= 0) {
            pushStep(
              `Node ${node.val} is unbalanced (balance: ${balance}). Left child ${node.left.val} is left-heavy or balanced. Performing Right Rotation.`,
              [node.id, node.left.id],
            );
            const newSubtreeRoot = rightRotate(node);
            if (!parent) {
              currentRoot = newSubtreeRoot;
            } else if (isLeftChild) {
              parent.left = newSubtreeRoot;
            } else {
              parent.right = newSubtreeRoot;
            }
            pushStep(`Right rotated around ${node.val}.`, [newSubtreeRoot.id]);
          } else {
            pushStep(
              `Node ${node.val} is unbalanced (balance: ${balance}). Left child ${node.left.val} is right-heavy. Performing Left-Right Rotation.`,
              [node.id, node.left.id],
            );
            pushStep(`Step 1: Left rotating left child ${node.left.val}.`, [
              node.left.id,
              node.left.right.id,
            ]);
            node.left = leftRotate(node.left);
            pushStep(
              `Left rotated left child. Now preparing to right rotate ${node.val}.`,
              [node.id, node.left.id],
            );
            const newSubtreeRoot = rightRotate(node);
            if (!parent) {
              currentRoot = newSubtreeRoot;
            } else if (isLeftChild) {
              parent.left = newSubtreeRoot;
            } else {
              parent.right = newSubtreeRoot;
            }
            pushStep(
              `Right rotated parent ${node.val}. Double rotation complete.`,
              [newSubtreeRoot.id],
            );
          }
        } else if (balance < -1) {
          const rightChildBalance = getBalance(node.right);
          if (rightChildBalance <= 0) {
            pushStep(
              `Node ${node.val} is unbalanced (balance: ${balance}). Right child ${node.right.val} is right-heavy or balanced. Performing Left Rotation.`,
              [node.id, node.right.id],
            );
            const newSubtreeRoot = leftRotate(node);
            if (!parent) {
              currentRoot = newSubtreeRoot;
            } else if (isLeftChild) {
              parent.left = newSubtreeRoot;
            } else {
              parent.right = newSubtreeRoot;
            }
            pushStep(`Left rotated around ${node.val}.`, [newSubtreeRoot.id]);
          } else {
            pushStep(
              `Node ${node.val} is unbalanced (balance: ${balance}). Right child ${node.right.val} is left-heavy. Performing Right-Left Rotation.`,
              [node.id, node.right.id],
            );
            pushStep(`Step 1: Right rotating right child ${node.right.val}.`, [
              node.right.id,
              node.right.left.id,
            ]);
            node.right = rightRotate(node.right);
            pushStep(
              `Right rotated right child. Now preparing to left rotate ${node.val}.`,
              [node.id, node.right.id],
            );
            const newSubtreeRoot = leftRotate(node);
            if (!parent) {
              currentRoot = newSubtreeRoot;
            } else if (isLeftChild) {
              parent.left = newSubtreeRoot;
            } else {
              parent.right = newSubtreeRoot;
            }
            pushStep(
              `Left rotated parent ${node.val}. Double rotation complete.`,
              [newSubtreeRoot.id],
            );
          }
        }
      }
    }
    pushStep(
      `Insertion of ${val} complete. Heights updated and AVL balance restored.`,
      [],
      newNode.id,
    );
  }

  return steps;
}

export function buildAVLInsertResult(root, values) {
  const steps = buildAVLInsertSteps(root, values);
  return { steps, finalModel: cloneNode(steps.at(-1)?.tree ?? root) };
}

// ─── TRAVERSALS ──────────────────────────────────────────────────────────────
export function buildTraversalSteps(root, type) {
  const steps = [];
  const history = [];
  const layout = calculateTreeLayout(root);

  const pushStep = (msg, activeNodeId = null) => {
    steps.push({
      tree: layout, // traversal reuses the immutable layout
      explanation: msg,
      status: "Traversing",
      event: type === "level" ? "level" : "visit",
      markers: {
        active: activeNodeId,
        history: [...history],
      },
    });
  };

  if (!root) {
    pushStep("Tree is empty. Nothing to traverse.");
    return steps;
  }

  const traverse = (node) => {
    if (!node) return;

    pushStep(`Visiting node ${node.val}`, node.id);

    if (type === "pre") {
      history.push(node.val);
      pushStep(`Pre-Order: Processed ${node.val}`, node.id);
    }

    if (node.left) {
      pushStep(`Going left from ${node.val}`, node.left.id);
      traverse(node.left);
      pushStep(`Returned to ${node.val} from left child`, node.id);
    }

    if (type === "in") {
      history.push(node.val);
      pushStep(`In-Order: Processed ${node.val}`, node.id);
    }

    if (node.right) {
      pushStep(`Going right from ${node.val}`, node.right.id);
      traverse(node.right);
      pushStep(`Returned to ${node.val} from right child`, node.id);
    }

    if (type === "post") {
      history.push(node.val);
      pushStep(`Post-Order: Processed ${node.val}`, node.id);
    }
  };

  if (type === "level") {
    const queue = [root];
    for (let head = 0; head < queue.length; head++) {
      const node = queue[head];
      history.push(node.val);
      pushStep(`Level-Order: Processed ${node.val}`, node.id);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    pushStep("Level-order traversal complete.");
    return steps;
  }
  pushStep(`Starting ${type.toUpperCase()}-Order Traversal`);
  traverse(root);
  pushStep(`Traversal Complete!`, null);

  return steps;
}
