export declare enum TileName {
    DIRT = 0,
    GRASS = 1,
    STONE = 2,
    STONE_WALL = 3,
    WATER = 4,
    BEACH = 5,
    FOREST = 6,
    PEAK = 7,
    SNOW = 8
}
export interface Tile {
    color: string;
    collide: boolean;
}
export declare type TileMap = {
    [key: string]: Tile;
};
