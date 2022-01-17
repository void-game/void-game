"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.letters = exports.createScreen = void 0;
const tiles_1 = require("../tiles");
const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];
exports.letters = letters;
const defaultConfigs = {
    tile: tiles_1.tileMap[tiles_1.TileName.DIRT],
};
const createScreen = (configs = defaultConfigs) => {
    const { tile = defaultConfigs.tile } = configs;
    const screen = {};
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 24; j++) {
            if (configs.tiles && configs.tiles[`${letters[i]}${j}`]) {
                const configTile = configs.tiles[`${letters[i]}${j}`];
                screen[`${letters[i]}${j}`] = { tile: configTile, position: { x: j, y: i } };
            }
            else {
                screen[`${letters[i]}${j}`] = { tile, position: { x: j, y: i } };
            }
        }
    }
    return screen;
};
exports.createScreen = createScreen;
//# sourceMappingURL=screenUtils.js.map