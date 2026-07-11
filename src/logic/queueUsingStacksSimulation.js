export function buildEnqueueSteps(s1, s2, val) {
  const steps = [];
  const stack1 = [...s1];
  const stack2 = [...s2];

  const addStep = (status, explanation, line, markers) => {
    steps.push({
      stack1: [...stack1],
      stack2: [...stack2],
      status,
      explanation,
      line,
      markers,
    });
  };

  addStep("Call", `Function enqueue(x) called with x = ${val}.`, 9, { enqueue: val });
  
  stack1.push(val);
  addStep("Push", `s1.push(x); Value ${val} is pushed onto s1 (Input Stack).`, 10, { pushS1: val, success: true });
  
  return steps;
}

export function buildDequeueSteps(s1, s2) {
  const steps = [];
  const stack1 = [...s1];
  const stack2 = [...s2];

  const addStep = (status, explanation, line, markers) => {
    steps.push({
      stack1: [...stack1],
      stack2: [...stack2],
      status,
      explanation,
      line,
      markers,
    });
  };

  addStep("Call", "Function dequeue() called.", 13, {});

  addStep("Condition", `Checking if both stacks are empty. s1.empty(): ${stack1.length === 0}, s2.empty(): ${stack2.length === 0}.`, 14, {});

  if (stack1.length === 0 && stack2.length === 0) {
    addStep("Error", "Both stacks are empty. Queue Underflow. Returning -1.", 16, { error: true });
    return steps;
  }

  addStep("Condition", `Checking if s2 (Output Stack) is empty. s2.empty(): ${stack2.length === 0}.`, 19, {});
  
  if (stack2.length === 0) {
    addStep("Branch", "s2 is empty. We must transfer all elements from s1 to s2 to reverse their LIFO order to FIFO.", 20, {});
    
    while (stack1.length > 0) {
      addStep("Loop Check", `while(!s1.empty()): Stack 1 has ${stack1.length} elements. Condition is true.`, 20, {});
      
      const top = stack1[stack1.length - 1];
      stack1.pop();
      stack2.push(top);
      addStep("Transfer", `s2.push(s1.top()); s1.pop(); Transferring ${top} from s1 to s2.`, 21, { pushS2: top, popS1: top });
    }
    
    addStep("Loop Check", "while(!s1.empty()): Stack 1 is now empty. Loop terminates.", 20, {});
  } else {
    addStep("Branch", "s2 is not empty. We already have elements in correct FIFO order. Skipping transfer loop.", 19, {});
  }

  const poppedVal = stack2[stack2.length - 1];
  addStep("Assign", `int x = s2.top(); Read the top element ${poppedVal} from s2.`, 26, { active: poppedVal });
  
  stack2.pop();
  addStep("Pop", `s2.pop(); Remove ${poppedVal} from s2.`, 27, { popS2: poppedVal });

  addStep("Return", `return x; Successfully returning dequeued value ${poppedVal}.`, 28, { success: true, dequeued: poppedVal });

  return steps;
}
