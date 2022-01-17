import { ScreenState, otherScreen, iraq } from '@core';

interface ScreenMap {
  [key: string]: ScreenState;
}

const screenMap: ScreenMap = {
  '0,0,0': iraq,
};

export { screenMap };
