import { ScreenState, otherScreen } from '@core';

interface ScreenMap {
  [key: string]: ScreenState;
}

const screenMap: ScreenMap = {
  '0,0,0': otherScreen,
}


export { screenMap }