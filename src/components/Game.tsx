import React, { useEffect, useReducer } from 'react';
import { SquareValue } from '../types/winner-type';
import { Action } from '../types/action-type';
import { GameState } from '../models/IGame';

const initialState: GameState = {
  board: Array(9).fill(null),
  xIsNext: true,
  winner: null,
};

function calculateWinner(board: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'makeMove': {
      if (state.winner || state.board[action.index]) {
        return state;
      }

      const newBoard = state.board.slice();
      newBoard[action.index] = state.xIsNext ? 'X' : 'O';
      const newWinner = calculateWinner(newBoard);

      return {
        ...state,
        board: newBoard,
        xIsNext: !state.xIsNext,
        winner: newWinner,
      };
    }
    case 'resetGame': {
      return initialState;
    }
    case 'computerMove': {
      if (state.winner) return state;
      
      const emptyIndices = state.board
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null) as number[];

      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newBoard = state.board.slice();
      newBoard[randomIndex] = 'O';
      const newWinner = calculateWinner(newBoard);

      return {
        ...state,
        board: newBoard,
        xIsNext: !state.xIsNext,
        winner: newWinner,
      };
    }
    default:
      return state;
  }
}

const Game: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.xIsNext && !state.winner) {
      const timer = setTimeout(() => {
        dispatch({ type: 'computerMove' });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state.xIsNext, state.winner]);

  const handleClick = (index: number) => {
    if (state.xIsNext) {
      dispatch({ type: 'makeMove', index });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'resetGame' });
  };

  const renderSquare = (index: number) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {state.board[index]}
      </button>
    );
  };

  const renderStatus = () => {
    if (state.winner) {
      if (state.winner === 'X') {
        return <div>Ти переміг!</div>;
      } else {
        return <div>Ти програв! Спробуй ще раз</div>;
      }
    } 
    else if (state.board.every((square) => square !== null)) {
      return <div>Нічия! Спробуй ще раз</div>;
    } 
    else {
      if (state.xIsNext)
      {
        return <div>Твій хід!</div>;
      }
      else
      {
        return <div>...</div>;
      }
    }
  };

  return (
    <div className="game">
      <div className="title">Хрестики-нолики</div>
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="game-info">
        {renderStatus()}
        <button onClick={handleReset} className='btn-restart'>
          <span className="material-symbols-outlined">
            restart_alt
          </span>
        </button>
      </div>
    </div>
  );
};

export default Game;