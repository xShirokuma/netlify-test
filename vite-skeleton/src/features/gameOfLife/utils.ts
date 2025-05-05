/**
 * Generate a 2D grid of zeros
 * @param rows - number of rows
 * @param cols - number of columns
 * @returns a 2D array representing the initial empty grid
 */
export function generateEmptyGrid(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

/**
 * Compute the next grid state according to Conway's Game of Life rules
 * @param currentGrid - the current 2D grid
 * @param numRows - total number of rows
 * @param numCols - total number of columns
 * @returns a new grid representing the next generation
 */
export function computeNextGrid(
  currentGrid: number[][],
  numRows: number,
  numCols: number
): number[][] {
  const newGrid = currentGrid.map((row) => [...row]);

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
}

/**
 * Compare two 2D grids for equality
 * @param a - first grid
 * @param b - second grid
 * @returns true if all cells are equal, false otherwise
 */
export function gridsAreEqual(a: number[][], b: number[][]): boolean {
  return a.every((row, i) => row.every((cell, j) => cell === b[i][j]));
}
