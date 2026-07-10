import { calculateTreeLayout } from "./treeInteractive.js";

const uuidv4 = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export function calculatePQLayout(arr) {
  if (!arr || arr.length === 0) return null;
  
  // Clone to avoid mutating original objects
  const nodes = arr.map((item, i) => ({ ...item, index: i }));
  
  // Build tree structure
  for (let i = 0; i < nodes.length; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    if (leftIdx < nodes.length) nodes[i].left = nodes[leftIdx];
    if (rightIdx < nodes.length) nodes[i].right = nodes[rightIdx];
  }
  
  return calculateTreeLayout(nodes[0]);
}

export function buildPQInitialStep() {
    return [{
        tree: null,
        array: [],
        explanation: "Priority Queue Initialized.",
        markers: {}
    }];
}

export function buildPQInsertSteps(queueState, values, isMax = true) {
  const steps = [];
  const currentArr = [...queueState];
  
  const pushStep = (msg, comparing = [], swapping = []) => {
    steps.push({
      tree: calculatePQLayout(currentArr),
      array: [...currentArr],
      explanation: msg,
      markers: { comparing, swapping }
    });
  };
  
  if (currentArr.length === 0 && values.length > 0) {
      pushStep("Initial empty Priority Queue.");
  }
  
  for (const val of values) {
    const newNode = { id: uuidv4(), val };
    currentArr.push(newNode);
    let i = currentArr.length - 1;
    pushStep(`Enqueued ${val} at the end (index ${i}).`, [newNode.id]);
    
    while (i != 0) {
      let parent = Math.floor((i - 1) / 2);
      pushStep(`Comparing ${currentArr[i].val} with its parent ${currentArr[parent].val}.`, [currentArr[i].id, currentArr[parent].id]);
      
      const shouldSwap = isMax 
        ? currentArr[parent].val < currentArr[i].val 
        : currentArr[parent].val > currentArr[i].val;
        
      if (shouldSwap) {
        pushStep(`${currentArr[i].val} ${isMax ? '>' : '<'} ${currentArr[parent].val}. Swapping (Heapify Up)!`, [], [currentArr[i].id, currentArr[parent].id]);
        let temp = currentArr[i];
        currentArr[i] = currentArr[parent];
        currentArr[parent] = temp;
        
        pushStep(`Swapped ${currentArr[parent].val} and ${currentArr[i].val}.`, [currentArr[parent].id, currentArr[i].id]);
        i = parent;
      } else {
        pushStep(`${currentArr[i].val} ${isMax ? '<=' : '>='} ${currentArr[parent].val}. Heap property satisfied.`, [currentArr[i].id, currentArr[parent].id]);
        break;
      }
    }
  }
  
  return steps;
}

export function buildPQExtractSteps(queueState, isMax = true) {
  const steps = [];
  if (queueState.length === 0) return steps;
  
  const currentArr = [...queueState];
  
  const pushStep = (msg, comparing = [], swapping = []) => {
    steps.push({
      tree: calculatePQLayout(currentArr),
      array: [...currentArr],
      explanation: msg,
      markers: { comparing, swapping }
    });
  };
  
  const extracted = currentArr[0];
  pushStep(`Extracting root element: ${extracted.val}.`, [extracted.id]);
  
  if (currentArr.length === 1) {
      currentArr.pop();
      pushStep(`Priority Queue is now empty.`, []);
      return steps;
  }
  
  const lastElement = currentArr.pop();
  currentArr[0] = lastElement;
  pushStep(`Moved last element ${lastElement.val} to the root.`, [lastElement.id]);
  
  let i = 0;
  while (true) {
      let maxIndex = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      
      if (l < currentArr.length) {
          pushStep(`Checking left child ${currentArr[l].val}.`, [currentArr[i].id, currentArr[l].id]);
          const shouldUpdateL = isMax ? currentArr[l].val > currentArr[maxIndex].val : currentArr[l].val < currentArr[maxIndex].val;
          if (shouldUpdateL) maxIndex = l;
      }
      
      if (r < currentArr.length) {
          pushStep(`Checking right child ${currentArr[r].val}.`, [currentArr[i].id, currentArr[r].id]);
          const shouldUpdateR = isMax ? currentArr[r].val > currentArr[maxIndex].val : currentArr[r].val < currentArr[maxIndex].val;
          if (shouldUpdateR) maxIndex = r;
      }
      
      if (maxIndex != i) {
          pushStep(`${currentArr[maxIndex].val} is ${isMax ? 'greater' : 'smaller'} than ${currentArr[i].val}. Swapping (Heapify Down)!`, [], [currentArr[i].id, currentArr[maxIndex].id]);
          let temp = currentArr[i];
          currentArr[i] = currentArr[maxIndex];
          currentArr[maxIndex] = temp;
          
          pushStep(`Swapped ${currentArr[i].val} and ${currentArr[maxIndex].val}.`, [currentArr[i].id, currentArr[maxIndex].id]);
          i = maxIndex;
      } else {
          pushStep(`Heap property satisfied. Extraction complete.`, [currentArr[i].id]);
          break;
      }
  }
  
  return steps;
}
