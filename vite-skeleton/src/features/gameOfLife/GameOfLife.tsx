import { useState, useRef, useCallback, useReducer } from 'react';
import { generateEmptyGrid, computeNextGrid } from './utils';
import './GameOfLife.css';

function GameOfLife() {
  const numRows = 64;
  const numCols = 64;
  const [grid, setGrid] = useState(generateEmptyGrid(numRows, numCols));
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  type State = {
    isRunning: boolean;
    grid: number[][];
  };

  type Action =
    | { type: 'TOGGLE_RUNNING' }
    | { type: 'STEP'; numRows: number; numCols: number }
    | { type: 'CLEAR'; numRows: number; numCols: number }
    | { type: 'TOGGLE_CELL'; row: number; col: number };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'TOGGLE_RUNNING':
        return { ...state, isRunning: !state.isRunning };
      case 'STEP':
        return {
          ...state,
          grid: computeNextGrid(state.grid, action.numRows, action.numCols),
        };
      case 'CLEAR':
        return {
          ...state,
          isRunning: false,
          grid: generateEmptyGrid(action.numRows, action.numCols),
        };
      case 'TOGGLE_CELL': {
        const newGrid = state.grid.map((arr) => [...arr]);
        newGrid[action.row][action.col] = state.grid[action.row][action.col] ? 0 : 1;
        return { ...state, grid: newGrid };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isRunning: false,
    grid: generateEmptyGrid(numRows, numCols),
  });

  const runSimulation = useCallback(() => {
    if (!isRunningRef.current) return;

    setGrid((prev) => computeNextGrid(prev, numRows, numCols));

    setTimeout(runSimulation, 100); // adjust speed here (ms)
  }, []);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => dispatch({ type: 'TOGGLE_CELL', row: rowIndex, col: colIndex })}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell ? 'black' : 'white',
                border: '1px solid #ccc',
              }}
            />
          ))
        )}
      </div>
      <button onClick={() => dispatch({ type: 'TOGGLE_RUNNING' })}>
        {state.isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => dispatch({ type: 'STEP', numRows, numCols })}>Step</button>
      <button onClick={() => dispatch({ type: 'CLEAR', numRows, numCols })}>Clear</button>
    </>
  );
}

export default GameOfLife;
