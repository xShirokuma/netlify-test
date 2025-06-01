import { useRef, useEffect, useReducer } from 'react';
import { generateEmptyGrid, computeNextGrid, gridsAreEqual, generateRandomGrid } from './utils';
import { GRID_ROWS, GRID_COLS } from './config';
import './gameOfLife.css';

function GameOfLife() {
  const numRows = GRID_ROWS;
  const numCols = GRID_COLS;
  const isRunningRef = useRef(false);

  type State = {
    isRunning: boolean;
    grid: number[][];
    generation: number;
  };

  type Action =
    | { type: 'TOGGLE_RUNNING' }
    | { type: 'STEP'; numRows: number; numCols: number }
    | { type: 'CLEAR'; numRows: number; numCols: number }
    | { type: 'TOGGLE_CELL'; row: number; col: number }
    | { type: 'RANDOMIZE'; numRows: number; numCols: number };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'TOGGLE_RUNNING':
        return { ...state, isRunning: !state.isRunning };
      case 'STEP': {
        const nextGrid = computeNextGrid(state.grid, action.numRows, action.numCols);
        if (gridsAreEqual(state.grid, nextGrid)) {
          return { ...state, isRunning: false };
        }
        return {
          ...state,
          grid: nextGrid,
          generation: state.generation + 1,
        };
      }
      case 'CLEAR':
        return {
          ...state,
          isRunning: false,
          grid: generateEmptyGrid(action.numRows, action.numCols),
          generation: 0,
        };
      case 'TOGGLE_CELL': {
        const newGrid = state.grid.map((arr) => [...arr]);
        newGrid[action.row][action.col] = state.grid[action.row][action.col] ? 0 : 1;
        return { ...state, grid: newGrid };
      }
      case 'RANDOMIZE':
        return {
          ...state,
          isRunning: false,
          generation: 0,
          grid: generateRandomGrid(action.numRows, action.numCols),
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isRunning: false,
    grid: generateEmptyGrid(numRows, numCols),
    generation: 0,
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
  }, [state.isRunning, numRows, numCols, dispatch]);

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
      <div>
        <p>Generation: {state.generation}</p>
        <button onClick={() => dispatch({ type: 'RANDOMIZE', numRows, numCols })}>Randomize</button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_RUNNING' })}
          aria-label={state.isRunning ? 'Pause Simulation' : 'Start Simulation'}
        >
          {state.isRunning ? '⏸' : '▶️'}
        </button>
        <button
          onClick={() => {
            if (state.isRunning) {
              dispatch({ type: 'TOGGLE_RUNNING' }); // Pause the simulation
            }
            dispatch({ type: 'STEP', numRows, numCols }); // Advance one generation
          }}
        >
          Step
        </button>
        <button onClick={() => dispatch({ type: 'CLEAR', numRows, numCols })}>Clear</button>
      </div>
    </>
  );
}

export default GameOfLife;
