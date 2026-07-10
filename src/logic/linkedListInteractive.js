// ─────────────────────────────────────────────────────────────────────────────
// Linked List Operation Simulation Builders
// Each builder takes the CURRENT list state and ONE operation value,
// and returns step-by-step animation steps for that single operation.
// ─────────────────────────────────────────────────────────────────────────────

function makeStep(list, explanation, status, structure, opts = {}) {
  return {
    array: [...list],
    line: opts.line ?? 1,
    pass: 0,
    index: opts.comparing?.[0] ?? -1,
    comparisons: 0,
    swaps: 0,
    explanation,
    status,
    comparing: opts.comparing ?? [],
    swapping: opts.swapping ?? [],
    sorted: opts.sorted ?? [],
    structure,
    markers: {
      operation: opts.operation ?? status,
      newNode: opts.newNode ?? null,
      deleting: opts.deleting ?? null,
      highlightArrowFrom: opts.highlightArrowFrom ?? null,
      result: opts.result ?? null,
      customEdges: opts.customEdges ?? [],
      hiddenEdges: opts.hiddenEdges ?? [],
      nodeLayouts: opts.nodeLayouts ?? {},
    },
  };
}

// ─── Insert at Head ──────────────────────────────────────────────────────────
export function buildInsertHeadSteps(list, value, structure = "linked-list") {
  const steps = [];
  let L = [...list];
  const isDoubly = structure === "doubly-list";
  const isCircular = structure === "circular-list";
  const sep = isDoubly ? " ↔ " : " → ";

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(L, expl, status, structure, { ...opts, operation: "Insert Head" }));

  push(`Insert ${value} at HEAD. Creating new node.`, "Insert Head");

  if (L.length === 0) {
    L = [value];
    if (isDoubly) {
      push(`List was empty. new Node(${value}): prev=null, next=null.`, "Creating Node", { newNode: 0, line: 13 });
      push(`HEAD = TAIL = node(${value}).  Done.`, "Done", { line: 14 });
    } else if (isCircular) {
      push(`List was empty. new Node(${value}): node.next = node (self-loop).`, "Creating Node", { newNode: 0, line: 11 });
      push(`HEAD = node(${value}). Circular list of 1 node.  Done.`, "Done", { line: 12 });
    } else {
      push(`List was empty. new Node(${value}).next = null.`, "Creating Node", { newNode: 0, line: 12 });
      push(`HEAD = node(${value}).  Done.`, "Done", { line: 14 });
    }
    return steps;
  }

  const oldHead = L[0];
  L = [value, ...L];

  if (isDoubly) {
    push(`new Node(${value}) created. node.next = HEAD(${oldHead}).`, "Link Next →", { newNode: 0, highlightArrowFrom: 0, line: 17 });
    push(`HEAD(${oldHead}).prev = node(${value}). Back-link set.`, "Link Prev ←", { newNode: 0, line: 18 });
    push(`HEAD = node(${value}). List: [${L.join(sep)}].  Done.`, "Done", { line: 19 });
  } else if (isCircular) {
    push(`Find TAIL to maintain circular link. Traversing...`, "Find Tail", { comparing: [L.length - 1], newNode: 0, line: 15 });
    push(`TAIL = ${L[L.length - 1]}. node.next = HEAD(${oldHead}).`, "Link Next →", { newNode: 0, highlightArrowFrom: 0, line: 16 });
    push(`TAIL.next = node(${value}). Circular link restored.`, "Circular Link", { newNode: 0, line: 17 });
    push(`HEAD = node(${value}). List: [${L.join(sep)}] → HEAD.  Done.`, "Done", { line: 18 });
  } else {
    push(`new Node(${value}). node.next = HEAD(${oldHead}).`, "Link Next →", { newNode: 0, highlightArrowFrom: 0, line: 13 });
    push(`HEAD = node(${value}). List: [${L.join(sep)}].  Done.`, "Done", { line: 14 });
  }

  return steps;
}

// ─── Insert at Tail ──────────────────────────────────────────────────────────
export function buildInsertTailSteps(list, value, structure = "linked-list") {
  const steps = [];
  let L = [...list];
  const isDoubly = structure === "doubly-list";
  const isCircular = structure === "circular-list";
  const sep = isDoubly ? " ↔ " : " → ";

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(L, expl, status, structure, { ...opts, operation: "Insert Tail" }));

  push(`Insert ${value} at TAIL. Creating new node.`, "Insert Tail");

  if (L.length === 0) {
    L = [value];
    push(`List was empty. HEAD = TAIL = node(${value}).  Done.`, "Done", { newNode: 0, line: isDoubly ? 24 : 23 });
    return steps;
  }

  const oldTail = L[L.length - 1];

  if (isDoubly) {
    push(`new Node(${value}) created. Tail currently = ${oldTail}.`, "Creating Node", { comparing: [L.length - 1], line: 24 });
    L = [...L, value];
    push(`node.prev = TAIL(${oldTail}). Backward link set.`, "Link Prev ←", { newNode: L.length - 1, comparing: [L.length - 2], line: 25 });
    push(`TAIL(${oldTail}).next = node(${value}).`, "Link Next →", { newNode: L.length - 1, highlightArrowFrom: L.length - 2, line: 26 });
    push(`TAIL = node(${value}). List: [${L.join(sep)}].  Done.`, "Done", { line: 27 });
  } else if (isCircular) {
    push(`Traverse to find TAIL (curr.next = HEAD).`, "Find Tail", { comparing: [0], line: 24 });
    for (let i = 0; i < L.length - 1; i++) {
      push(`curr = ${L[i]}. curr.next ≠ HEAD. Move forward.`, "Traversing", { comparing: [i], line: 25 });
    }
    push(`TAIL = ${oldTail} (next = HEAD). Reached end.`, "Tail Found", { comparing: [L.length - 1], line: 25 });
    L = [...L, value];
    push(`TAIL(${oldTail}).next = node(${value}).`, "Link Tail", { newNode: L.length - 1, highlightArrowFrom: L.length - 2, line: 26 });
    push(`node(${value}).next = HEAD(${L[0]}). Circular link.`, "Circular Link", { newNode: L.length - 1, line: 26 });
    push(`Inserted at tail. List: [${L.join(sep)}] → HEAD.  Done.`, "Done");
  } else {
    push(`Traverse from HEAD to find last node.`, "Traversing", { comparing: [0], line: 19 });
    for (let i = 0; i < L.length - 1; i++) {
      push(`curr = ${L[i]}. curr.next = ${L[i + 1]}. Move forward.`, "Traversing", { comparing: [i], line: 20 });
    }
    push(`curr = ${oldTail}. curr.next = null. Reached TAIL.`, "Tail Found", { comparing: [L.length - 1], line: 22 });
    L = [...L, value];
    push(`curr.next = node(${value}). ${oldTail} → ${value}.`, "Link Tail", { newNode: L.length - 1, highlightArrowFrom: L.length - 2, line: 23 });
    push(`Tail inserted. List: [${L.join(sep)}].  Done.`, "Done");
  }

  return steps;
}

// ─── Insert at Index ─────────────────────────────────────────────────────────
export function buildInsertAtSteps(list, value, index, structure = "linked-list") {
  const steps = [];
  let L = [...list];
  const isDoubly = structure === "doubly-list";
  const sep = isDoubly ? " ↔ " : " → ";

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(L, expl, status, structure, { ...opts, operation: "Insert At" }));

  push(`Insert ${value} at index ${index}.`, "Insert At");

  if (index === 0) {
      return buildInsertHeadSteps(list, value, structure);
  }
  if (index >= L.length) {
      return buildInsertTailSteps(list, value, structure);
  }

  // Create new node floating above
  L.splice(index, 0, value);
  const prevIdx = index - 1;
  const currIdx = index;
  const nextIdx = index + 1;

  // New node floats
  const floatNode = { [currIdx]: { yOffset: -80, isNew: true } };

  push(`Create new Node(${value})`, "Creating Node", {
      nodeLayouts: floatNode,
      hiddenEdges: [[prevIdx, currIdx], [currIdx, nextIdx]], // don't draw standard edges to it yet
      customEdges: [{ from: prevIdx, to: nextIdx, status: "standard" }] // keep old edge drawn
  });

  push(`Traverse to index ${index - 1}`, "Traversing", {
      comparing: [prevIdx],
      nodeLayouts: floatNode,
      hiddenEdges: [[prevIdx, currIdx], [currIdx, nextIdx]],
      customEdges: [{ from: prevIdx, to: nextIdx, status: "standard" }]
  });

  push(`node.next = prev.next (node ${value} → ${L[nextIdx]})`, "Link Next", {
      nodeLayouts: floatNode,
      hiddenEdges: [[prevIdx, currIdx], [currIdx, nextIdx]],
      customEdges: [
          { from: prevIdx, to: nextIdx, status: "standard" },
          { from: currIdx, to: nextIdx, status: "curved" }
      ]
  });

  push(`prev.next = node (node ${L[prevIdx]} → ${value})`, "Link Prev", {
      nodeLayouts: floatNode,
      hiddenEdges: [[prevIdx, currIdx], [currIdx, nextIdx]],
      customEdges: [
          { from: prevIdx, to: nextIdx, status: "broken" },
          { from: prevIdx, to: currIdx, status: "curved" },
          { from: currIdx, to: nextIdx, status: "curved" }
      ]
  });

  push(`Node snaps into position. List: [${L.join(sep)}].  Done.`, "Done", {
      newNode: currIdx
  });

  return steps;
}

// ─── Delete by Value ─────────────────────────────────────────────────────────
export function buildDeleteSteps(list, value, structure = "linked-list") {
  const steps = [];
  let L = [...list];
  const isDoubly = structure === "doubly-list";
  const sep = isDoubly ? " ↔ " : " → ";

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(L, expl, status, structure, { ...opts, operation: "Delete" }));

  push(`Delete node with value ${value}. Starting at HEAD.`, "Delete");

  if (L.length === 0) {
    push(`List is empty. Nothing to delete.`, "Not Found", { result: "not-found" });
    return steps;
  }

  const idx = L.indexOf(value);

  if (idx === -1) {
    // Not found — traverse showing comparisons
    for (let i = 0; i < L.length; i++) {
      push(`Compare ${L[i]} ≠ ${value}. Move forward.`, "Searching", { comparing: [i], line: isDoubly ? 58 : 67 });
    }
    push(`Reached NULL. Value ${value} not found in list. `, "Not Found", { result: "not-found" });
    return steps;
  }

  // Traverse to the node
  for (let i = 0; i <= idx; i++) {
    if (i < idx) {
      push(`Compare ${L[i]} ≠ ${value}. Move to next.`, "Searching", { comparing: [i], line: isDoubly ? 58 : 70 });
    } else {
      push(`Found target! ${L[i]} = ${value} at index [${i}].`, "Found Target", { comparing: [i], line: isDoubly ? 60 : 71 });
    }
  }

  // Show unlinking
  if (idx === 0) {
    push(`Target is HEAD. HEAD = HEAD.next (${L[1] ?? "null"}).`, "Delete Head", { swapping: [0], line: isDoubly ? 47 : 53 });
    if (isDoubly && L[1] !== undefined) push(`new HEAD.prev = null. Back-link cleared.`, "Clear Prev", { swapping: [0], line: 48 });
  } else if (idx === L.length - 1) {
    push(`Target is TAIL. Set prev(${L[idx - 1]}).next = null.`, "Delete Tail", { swapping: [idx], comparing: [idx - 1], line: isDoubly ? 53 : 63 });
    if (isDoubly) push(`TAIL = prev(${L[idx - 1]}). TAIL.next = null.`, "Update Tail", { swapping: [idx], line: 54 });
  } else {
    push(`Set ${L[idx - 1]}.next = ${L[idx + 1]}. Bypassing ${value}.`, "Unlinking", { swapping: [idx], comparing: [idx - 1], highlightArrowFrom: idx - 1, line: isDoubly ? 60 : 71 });
    if (isDoubly) push(`Set ${L[idx + 1]}.prev = ${L[idx - 1]}. Back-link updated.`, "Back Link", { swapping: [idx], comparing: [idx + 1], line: 61 });
  }

  const removed = L[idx];
  L = [...L.slice(0, idx), ...L.slice(idx + 1)];
  push(`Node ${removed} removed. List: [${L.length > 0 ? L.join(sep) : "EMPTY"}].  Done.`, "Done", { result: "deleted" });

  return steps;
}

// ─── Search ──────────────────────────────────────────────────────────────────
export function buildSearchSteps(list, value, structure = "linked-list") {
  const steps = [];
  let L = [...list];
  const isDoubly = structure === "doubly-list";

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(L, expl, status, structure, { ...opts, operation: "Search" }));

  push(`Search for value ${value}. Start at HEAD.`, "Search", { comparing: L.length > 0 ? [0] : [] });

  if (L.length === 0) {
    push(`List is empty. Value ${value} not found. `, "Not Found", { result: "not-found" });
    return steps;
  }

  for (let i = 0; i < L.length; i++) {
    push(`Index [${i}]: Compare ${L[i]} with ${value}.`, "Comparing", { comparing: [i], line: isDoubly ? 34 : 38 });
    if (L[i] === value) {
      push(` Found! ${value} is at index [${i}].`, "Found", { sorted: [i], result: "found", line: isDoubly ? 35 : 39 });
      return steps;
    }
    if (i < L.length - 1) {
      push(`${L[i]} ≠ ${value}. curr = curr.next → ${L[i + 1]}.`, "Move Forward", { comparing: [i + 1], line: isDoubly ? 36 : 40 });
    }
  }

  push(`Reached NULL. Value ${value} not found in list. `, "Not Found", { result: "not-found" });
  return steps;
}

// ─── Initial state (just show the list) ──────────────────────────────────────
export function buildInitialStep(list, structure = "linked-list") {
  const isDoubly = structure === "doubly-list";
  const isCircular = structure === "circular-list";
  const sep = isDoubly ? " ↔ " : " → ";
  const suffix = isCircular ? " → HEAD" : "";
  const desc = list.length === 0
    ? "Empty list. Use the controls below to add nodes."
    : `List: [${list.join(sep)}]${suffix}. Select an operation.`;
  return [makeStep(list, desc, "Ready", structure, { operation: "Ready" })];
}
