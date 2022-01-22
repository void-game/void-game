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
  [TileName.STONE]: {
    color: '#787876',
    collide: false,
  },
  [TileName.STONE_WALL]: {
    color: '#778899',
    collide: true,
  },
  [TileName.WATER]: {
    color: '#3333f5',
    collide: false 
  },  
  [TileName.BEACH]: {
    color: '#ffffda',
    collide: false 
  },
  [TileName.FOREST]: {
    color: '#60a473',
    collide: false 
  },
  [TileName.PEAK]: {
    color: '#a6a6a6',
    collide: false 
  },
  [TileName.SNOW]: {
    color: 'white',
    collide: false 
  },
};
