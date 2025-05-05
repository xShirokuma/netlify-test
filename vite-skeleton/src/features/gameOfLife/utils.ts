export const generateEmptyGrid = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

export const computeNextGrid = (
  currentGrid: number[][],
  numRows: number,
  numCols: number
): number[][] => {
  const newGrid = currentGrid.map((arr) => [...arr]);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let liveNeighbors = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const r = row + i;
          const c = col + j;

          if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
            liveNeighbors += currentGrid[r][c];
          }
        }
      }

      const cell = currentGrid[row][col];
      if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        newGrid[row][col] = 0;
      } else if (cell === 0 && liveNeighbors === 3) {
        newGrid[row][col] = 1;
      }
    }
  }

  return newGrid;
};
