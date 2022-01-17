import { ScreenState, otherScreen, iraq, defaultScreen, ireland, afghanistan } from '@core';

interface ScreenMap {
  [key: string]: ScreenState;
}

const screenMap: ScreenMap = {
  '0,0,0': iraq,
  '1,0,0': otherScreen,
  '-1,0,0': defaultScreen,
  '0,-1,0': ireland,
  '0,1,0': afghanistan,
};

export { screenMap };
