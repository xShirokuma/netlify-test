import { useRef, useEffect, useReducer } from 'react';
import { generateEmptyGrid, computeNextGrid, gridsAreEqual } from './utils';
import './GameOfLife.css';

function GameOfLife() {
  const numRows = 64;
  const numCols = 64;
  const isRunningRef = useRef(false);

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
      case 'STEP': {
        const nextGrid = computeNextGrid(state.grid, action.numRows, action.numCols);

        // Auto-pause if no change
        if (gridsAreEqual(state.grid, nextGrid)) {
          return {
            ...state,
            isRunning: false,
          };
        }

        return {
          ...state,
          grid: nextGrid,
        };
      }

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

  useEffect(() => {
    isRunningRef.current = state.isRunning;
  }, [state.isRunning]);

  useEffect(() => {
    if (state.isRunning) {
      const loop = () => {
        if (!isRunningRef.current) return;
        dispatch({ type: 'STEP', numRows, numCols });
        setTimeout(loop, 100);
      };
      loop();
    }
  }, [state.isRunning, dispatch]);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        {state.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => {
                if (isRunningRef.current) {
                  dispatch({ type: 'TOGGLE_RUNNING' }); // Pause
                }
                dispatch({ type: 'TOGGLE_CELL', row: rowIndex, col: colIndex });
              }}
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
