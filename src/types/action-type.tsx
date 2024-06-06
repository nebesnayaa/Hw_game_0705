export type Action =
  | { type: 'makeMove'; index: number }
  | { type: 'resetGame' }
  | { type: 'computerMove' };