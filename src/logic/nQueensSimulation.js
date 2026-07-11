export function buildNQueensSteps(N) {
  const steps = [];
  // board[row] = col means there is a queen at (row, col)
  const board = Array(N).fill(-1);
  const solutions = [];

  const addStep = (status, explanation, line, markers) => {
    steps.push({
      board: [...board],
      solutions: [...solutions], // snapshot of all found solutions so far
      status,
      explanation,
      line,
      markers,
    });
  };

  const isSafe = (row, col) => {
    addStep("Checking", `Checking if row ${row}, column ${col} is safe.`, 2, { checking: [row, col] });
    
    // Check previous rows
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col) {
        addStep("Conflict", `Queen at row ${r}, column ${c} attacks the same column.`, 3, { checking: [row, col], attacking: [r, c, row, col] });
        return false;
      }
      if (c === col - (row - r)) {
        addStep("Conflict", `Queen at row ${r}, column ${c} attacks the left diagonal.`, 5, { checking: [row, col], attacking: [r, c, row, col] });
        return false;
      }
      if (c === col + (row - r)) {
        addStep("Conflict", `Queen at row ${r}, column ${c} attacks the right diagonal.`, 7, { checking: [row, col], attacking: [r, c, row, col] });
        return false;
      }
    }
    
    addStep("Safe", `Row ${row}, column ${col} is safe from attack.`, 9, { checking: [row, col] });
    return true;
  };

  const solveNQueensUtil = (row) => {
    if (row >= N) {
      solutions.push([...board]);
      addStep("Solved", `Solution found! Total solutions so far: ${solutions.length}`, 12, {});
      return;
    }

    addStep("Row Check", `Trying to place a queen in row ${row}.`, 16, {});

    for (let col = 0; col < N; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        addStep("Placing", `Placing queen at row ${row}, column ${col}.`, 18, { placed: [row, col] });

        solveNQueensUtil(row + 1);

        board[row] = -1;
        addStep("Backtracking", `Backtracking: removing queen at row ${row}, column ${col} to find other solutions.`, 20, { backtracking: [row, col] });
      }
    }
    
    if (row > 0) {
        addStep("Backtracking", `Explored all columns in row ${row}. Backtracking to previous row.`, 22, {});
    }
  };

  addStep("Start", `Initializing N-Queens solver for ${N}x${N} board.`, 11, {});
  solveNQueensUtil(0);
  
  addStep("Done", `Search complete. Found ${solutions.length} solutions for ${N}x${N} board.`, 24, {});
  
  return steps;
}
