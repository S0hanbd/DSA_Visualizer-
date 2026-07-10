// ─────────────────────────────────────────────────────────────────────────────
// Queue Operation Simulation Builders
// Each builder takes the CURRENT queue state and returns step-by-step 
// animation steps for that single operation.
// ─────────────────────────────────────────────────────────────────────────────

const MAX = 10;

function makeStep(state, explanation, status, opts = {}) {
  return {
    array: [...state.array],
    front: state.front,
    rear: state.rear,
    line: opts.line ?? 1,
    status,
    explanation,
    markers: {
      operation: opts.operation ?? status,
      enqueuing: opts.enqueuing ?? false,
      dequeuing: opts.dequeuing ?? false,
      success: opts.success ?? true
    }
  };
}

// ─── Enqueue ─────────────────────────────────────────────────────────────────
export function buildEnqueueSteps(queueState, value) {
  const steps = [];
  let state = {
      array: [...queueState.array],
      front: queueState.front,
      rear: queueState.rear
  };

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(state, expl, status, { ...opts, operation: "Enqueue" }));

  push(`Enqueue ${value} into queue. Checking for overflow.`, "Enqueue", { line: 26 });

  if (state.rear >= MAX - 1) {
    push(`Queue Overflow: rear pointer reached MAX capacity (${MAX}). Cannot enqueue.`, "Error", { line: 27, success: false });
    return steps;
  }

  push(`Space available. Preparing to enqueue ${value}.`, "Processing", { line: 29 });
  
  if (state.front === -1) {
      state.front = 0; // First element inserted
  }
  state.rear++;
  state.array[state.rear] = value;
  
  push(`arr[++rear] = ${value}. Enqueued to rear. `, "Done", { line: 30, enqueuing: true });

  return steps;
}

// ─── Dequeue ─────────────────────────────────────────────────────────────────
export function buildDequeueSteps(queueState) {
  const steps = [];
  let state = {
      array: [...queueState.array],
      front: queueState.front,
      rear: queueState.rear
  };

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(state, expl, status, { ...opts, operation: "Dequeue" }));

  push(`Dequeue value from queue. Checking for underflow.`, "Dequeue", { line: 34 });

  if (state.front === -1 || state.front > state.rear) {
    push(`Queue Underflow: front pointer passed rear (Queue is empty). Cannot dequeue.`, "Error", { line: 35, success: false });
    return steps;
  }

  const dequeuedValue = state.array[state.front];
  push(`Queue not empty. Dequeuing front element (${dequeuedValue}).`, "Processing", { line: 37, dequeuing: true });
  
  state.array[state.front] = null; // Clear the visually dequeued spot
  state.front++;
  
  push(`Removed ${dequeuedValue} from front (front++). `, "Done", { line: 38 });

  return steps;
}

// ─── Initial Step ────────────────────────────────────────────────────────────
export function buildInitialQueueStep() {
  const initialState = { array: Array(MAX).fill(null), front: -1, rear: -1 };
  return [makeStep(initialState, "Queue initialized.", "Ready")];
}
