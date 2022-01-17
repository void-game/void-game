import {
  ScreenState,
  otherScreen,
  iraq,
  defaultScreen,
  ireland,
  afghanistan,
  mapMakerScreen,
  zelda,
} from '@core';

interface ScreenMap {
  [key: string]: ScreenState;
}

const screenMap: ScreenMap = {
  '0,0,0': zelda,
  '1,0,0': defaultScreen,
  '-1,0,0': afghanistan,
  '0,-1,0': iraq,
  '0,1,0': otherScreen,
};

export { screenMap };
