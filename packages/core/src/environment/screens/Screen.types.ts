import { Tile } from "../tiles";

export interface CellState {
  tile: Tile;
  position: {
    x: number;
    y: number;
  };
}

export type ScreenState = {
  [key: string]: CellState;
};

export interface ScreenConfigs {
  tile?: Tile;
}
