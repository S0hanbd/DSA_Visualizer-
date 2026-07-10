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
      success: opts.success ?? true,
      activeIdx: opts.activeIdx ?? -1
    }
  };
}

export function buildCQEnqueueSteps(queueState, value) {
  const steps = [];
  let state = {
      array: [...queueState.array],
      front: queueState.front,
      rear: queueState.rear
  };

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(state, expl, status, { ...opts, operation: "Enqueue" }));

  push(`Enqueue ${value} into circular queue. Checking for overflow.`, "Enqueue", { line: 22 });

  if ((state.front === 0 && state.rear === MAX - 1) || (state.front === state.rear + 1)) {
    push(`Queue Overflow: Circular queue is full. Cannot enqueue.`, "Error", { line: 23, success: false });
    return steps;
  }

  push(`Space available. Preparing to enqueue ${value}.`, "Processing", { line: 25 });
  
  if (state.front === -1) {
      state.front = 0;
      push(`Queue was empty. Set front = 0.`, "Processing", { line: 26 });
  }
  
  state.rear = (state.rear + 1) % MAX;
  push(`Calculated new rear: (rear + 1) % MAX = ${state.rear}.`, "Processing", { line: 29 });
  
  state.array[state.rear] = value;
  push(`Enqueued ${value} to rear position ${state.rear}.`, "Done", { line: 30, enqueuing: true, activeIdx: state.rear });

  return steps;
}

export function buildCQDequeueSteps(queueState) {
  const steps = [];
  let state = {
      array: [...queueState.array],
      front: queueState.front,
      rear: queueState.rear
  };

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(state, expl, status, { ...opts, operation: "Dequeue" }));

  push(`Dequeue value from circular queue. Checking for underflow.`, "Dequeue", { line: 33 });

  if (state.front === -1) {
    push(`Queue Underflow: front is -1 (Queue is empty). Cannot dequeue.`, "Error", { line: 34, success: false });
    return steps;
  }

  const dequeuedValue = state.array[state.front];
  push(`Queue not empty. Dequeuing front element (${dequeuedValue}) at index ${state.front}.`, "Processing", { line: 37, dequeuing: true, activeIdx: state.front });
  
  state.array[state.front] = null;
  
  if (state.front === state.rear) {
      state.front = -1;
      state.rear = -1;
      push(`Dequeued last element. Reset front and rear to -1.`, "Done", { line: 40 });
  } else {
      state.front = (state.front + 1) % MAX;
      push(`Calculated new front: (front + 1) % MAX = ${state.front}.`, "Done", { line: 43 });
  }

  return steps;
}

export function buildInitialCQStep() {
  const initialState = { array: Array(MAX).fill(null), front: -1, rear: -1 };
  return [makeStep(initialState, "Circular Queue initialized.", "Ready")];
}
