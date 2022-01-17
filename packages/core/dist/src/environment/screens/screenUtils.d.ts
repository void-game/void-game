import { ScreenConfigs, ScreenState } from './Screen.types';
declare const letters: string[];
declare const createScreen: (configs?: ScreenConfigs) => ScreenState;
export { createScreen, letters };
