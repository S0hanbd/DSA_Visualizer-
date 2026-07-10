// ─────────────────────────────────────────────────────────────────────────────
// Stack Operation Simulation Builders
// Each builder takes the CURRENT stack state and returns step-by-step 
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
      topIndex: opts.topIndex ?? array.length - 1,
      popping: opts.popping ?? false,
      peeking: opts.peeking ?? false,
      success: opts.success ?? true
    }
  };
}

// ─── Push ────────────────────────────────────────────────────────────────────
export function buildPushSteps(stack, value) {
  const steps = [];
  let S = [...stack];
  const MAX = 10; // Let's pretend max is 10 for visualizer limits

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(S, expl, status, { ...opts, operation: "Push" }));

  push(`Push ${value} onto stack. Checking for overflow.`, "Push", { line: 13 });

  if (S.length >= MAX) {
    push(`Stack Overflow: Top >= MAX. Cannot push ${value}.`, "Error", { line: 15, success: false });
    return steps;
  }

  push(`Space available. Preparing to push ${value}.`, "Processing", { line: 18 });
  S.push(value);
  push(`a[++top] = ${value}. Pushed onto stack. `, "Done", { line: 18 });

  return steps;
}

// ─── Pop ─────────────────────────────────────────────────────────────────────
export function buildPopSteps(stack) {
  const steps = [];
  let S = [...stack];

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(S, expl, status, { ...opts, operation: "Pop" }));

  push(`Pop top value from stack. Checking for underflow.`, "Pop", { line: 23 });

  if (S.length === 0) {
    push(`Stack Underflow: Stack is empty (top < 0). Cannot pop.`, "Error", { line: 25, success: false });
    return steps;
  }

  const poppedValue = S[S.length - 1];
  push(`Stack not empty. Popping top element (${poppedValue}).`, "Processing", { line: 28, popping: true });
  
  S.pop();
  push(`Removed ${poppedValue} (top--). `, "Done", { line: 29 });

  return steps;
}

// ─── Peek ────────────────────────────────────────────────────────────────────
export function buildPeekSteps(stack) {
  const steps = [];
  let S = [...stack];

  const push = (expl, status, opts = {}) =>
    steps.push(makeStep(S, expl, status, { ...opts, operation: "Peek" }));

  push(`Peek top value of stack. Checking if empty.`, "Peek", { line: 33 });

  if (S.length === 0) {
    push(`Stack is Empty (top < 0). Cannot peek.`, "Error", { line: 35, success: false });
    return steps;
  }

  const topValue = S[S.length - 1];
  push(`Stack not empty. Retrieving a[top].`, "Processing", { line: 38, peeking: true });
  push(`Top element is ${topValue}. `, "Done", { line: 39, peeking: true });

  return steps;
}

// ─── Initial Step ────────────────────────────────────────────────────────────
export function buildInitialStep(stack = []) {
  return [makeStep(stack, "Stack initialized.", "Ready")];
}
