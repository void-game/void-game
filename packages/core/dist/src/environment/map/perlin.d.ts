export declare const enum MapType {
    GAME_MAP = 0,
    PERLIN_MAP = 1
}
export interface MapConfig {
    screenMultiplier: number;
    frequency: number;
    redistribution: number;
    mapType: MapType;
}
export declare const generateMap: (config: MapConfig) => any;
