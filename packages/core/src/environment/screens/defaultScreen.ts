import { TileName, tileMap } from '../tiles';
import { createScreen } from './screenUtils';

const defaultScreen = createScreen({ tile: tileMap[TileName.DIRT] });
const otherScreen = createScreen({ tile: tileMap[TileName.GRASS] });
const iraq = createScreen({
  tile: tileMap[TileName.DIRT],
  tiles: {
    m10: tileMap[TileName.STONE_WALL],
  },
});
const ireland = createScreen({
  tile: tileMap[TileName.DIRT],
  tiles: {
    m5: tileMap[TileName.STONE_WALL],
    m6: tileMap[TileName.STONE_WALL],
    m7: tileMap[TileName.STONE_WALL],
    m8: tileMap[TileName.STONE_WALL],
    m9: tileMap[TileName.STONE_WALL],
    m10: tileMap[TileName.STONE_WALL],
    c5: tileMap[TileName.STONE_WALL],
    c6: tileMap[TileName.STONE_WALL],
    c7: tileMap[TileName.DIRT],
    c8: tileMap[TileName.STONE_WALL],
    c9: tileMap[TileName.DIRT],
    c10: tileMap[TileName.STONE_WALL],
    b7: tileMap[TileName.DIRT],
  },
});
const afghanistan = createScreen({
  tile: tileMap[TileName.DIRT],
  tiles: {
    d19: tileMap[TileName.STONE_WALL],
  },
});

export { defaultScreen, otherScreen, iraq, ireland, afghanistan };
