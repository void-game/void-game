export enum TileName {
  DIRT,
  GRASS,
  STONE_WALL,
}

export interface Tile {
  color: string;
  collide: boolean;
}

export type TileMap = { [key: string]: Tile };
