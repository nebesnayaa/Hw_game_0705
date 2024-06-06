import { SquareValue } from '../types/winner-type';

export interface GameState {
  board: SquareValue[];
  xIsNext: boolean;
  winner: SquareValue;
}