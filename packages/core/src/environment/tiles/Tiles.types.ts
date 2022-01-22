export enum TileName {
  DIRT,
  GRASS,
	STONE,
  STONE_WALL,
  WATER,
	BEACH,
	FOREST,
	PEAK,
	SNOW,
}

export interface Tile {
  color: string;
  collide: boolean;
}

export type TileMap = { [key: string]: Tile };
