import { Tile, TileMap } from '../tiles';
export interface CellState {
    tile: Tile;
    position: {
        x: number;
        y: number;
    };
}
export declare type ScreenState = {
    [key: string]: CellState;
};
export interface ScreenConfigs {
    tile?: Tile;
    tiles?: TileMap;
}
