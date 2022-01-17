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

export { defaultScreen, otherScreen, iraq };
