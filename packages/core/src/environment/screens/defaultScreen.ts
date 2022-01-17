import { TileName, tileMap } from '../tiles';
import { createScreen } from './screenUtils';


const defaultScreen = createScreen({tile: tileMap[TileName.DIRT]});
const otherScreen = createScreen({tile: tileMap[TileName.GRASS]});

export { defaultScreen, otherScreen };
