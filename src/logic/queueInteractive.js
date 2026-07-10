// ─────────────────────────────────────────────────────────────────────────────
// Queue Operation Simulation Builders
// Each builder takes the CURRENT queue state and returns step-by-step 
// animation steps for that single operation.
// ─────────────────────────────────────────────────────────────────────────────

function makeStep(array, explanation, status, opts = {}) {
  return {
    array: [...array],
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
export function buildEnqueueSteps(queue, value) {
  const steps = [];
  let Q = [...queue];
  const MAX = 10; // Let's pretend max is 10 for visualizer limits

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(Q, expl, status, { ...opts, operation: "Enqueue" }));

  push(`Enqueue ${value} into queue. Checking for overflow.`, "Enqueue", { line: 26 });

  if (Q.length >= MAX) {
    push(`Queue Overflow: Max capacity reached. Cannot enqueue ${value}.`, "Error", { line: 27, success: false });
    return steps;
  }

  push(`Space available. Preparing to enqueue ${value}.`, "Processing", { line: 29 });
  Q.push(value);
  push(`arr[++rear] = ${value}. Enqueued to rear. `, "Done", { line: 30, enqueuing: true });

  return steps;
}

// ─── Dequeue ─────────────────────────────────────────────────────────────────
export function buildDequeueSteps(queue) {
  const steps = [];
  let Q = [...queue];

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(Q, expl, status, { ...opts, operation: "Dequeue" }));

  push(`Dequeue value from queue. Checking for underflow.`, "Dequeue", { line: 34 });

  if (Q.length === 0) {
    push(`Queue Underflow: Queue is empty. Cannot dequeue.`, "Error", { line: 35, success: false });
    return steps;
  }

  const dequeuedValue = Q[0];
  push(`Queue not empty. Dequeuing front element (${dequeuedValue}).`, "Processing", { line: 37, dequeuing: true });
  
  Q.shift();
  push(`Removed ${dequeuedValue} from front (front++). `, "Done", { line: 38 });

  return steps;
}

// ─── Initial Step ────────────────────────────────────────────────────────────
export function buildInitialQueueStep(queue = []) {
  return [makeStep(queue, "Queue initialized.", "Ready")];
}
