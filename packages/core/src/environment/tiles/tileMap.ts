import { TileName, TileMap } from './Tiles.types';

export const tileMap: TileMap = {
  [TileName.DIRT]: {
    color: '#A0522D',
    collide: false,
  },
  [TileName.GRASS]: {
    color: '#006400',
    collide: false,
  },
  [TileName.STONE_WALL]: {
    color: '#778899',
    collide: true,
  },
};
