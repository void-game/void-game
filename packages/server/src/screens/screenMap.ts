import {
  ScreenState,
  otherScreen,
  iraq,
  defaultScreen,
  ireland,
  afghanistan,
  mapMakerScreen,
  zelda,
  generateMap
} from '@core';

interface ScreenMap {
  [key: string]: ScreenState;
}

const mapGenConfigs = { screenMultiplier: 25, frequency: 10, redistribution: 1.9 };

const screenMap: ScreenMap = generateMap(mapGenConfigs);
  // '0,0,0': zelda,
  // '1,0,0': defaultScreen,
  // '-1,0,0': afghanistan,
  // '0,-1,0': iraq,
  // '0,1,0': otherScreen,


export { screenMap };
