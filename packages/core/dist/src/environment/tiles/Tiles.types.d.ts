export declare enum TileName {
    DIRT = 0,
    GRASS = 1,
    STONE_WALL = 2
}
export interface Tile {
    color: string;
    collide: boolean;
}
export declare type TileMap = {
    [key: string]: Tile;
};
