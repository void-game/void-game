import { ScreenConfigs, ScreenState } from './screen.types';
declare const letters: string[];
declare const createScreen: (configs?: ScreenConfigs) => ScreenState;
export { createScreen, letters };
