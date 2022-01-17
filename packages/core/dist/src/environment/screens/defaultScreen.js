"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afghanistan = exports.ireland = exports.iraq = exports.otherScreen = exports.defaultScreen = void 0;
const tiles_1 = require("../tiles");
const screenUtils_1 = require("./screenUtils");
const defaultScreen = (0, screenUtils_1.createScreen)({ tile: tiles_1.tileMap[tiles_1.TileName.DIRT] });
exports.defaultScreen = defaultScreen;
const otherScreen = (0, screenUtils_1.createScreen)({ tile: tiles_1.tileMap[tiles_1.TileName.GRASS] });
exports.otherScreen = otherScreen;
const iraq = (0, screenUtils_1.createScreen)({
    tile: tiles_1.tileMap[tiles_1.TileName.DIRT],
    tiles: {
        m10: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
    },
});
exports.iraq = iraq;
const ireland = (0, screenUtils_1.createScreen)({
    tile: tiles_1.tileMap[tiles_1.TileName.DIRT],
    tiles: {
        m5: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        m6: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        m7: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        m8: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        m9: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        m10: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        c5: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        c6: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        c7: tiles_1.tileMap[tiles_1.TileName.DIRT],
        c8: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        c9: tiles_1.tileMap[tiles_1.TileName.DIRT],
        c10: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
        b7: tiles_1.tileMap[tiles_1.TileName.DIRT],
    },
});
exports.ireland = ireland;
const afghanistan = (0, screenUtils_1.createScreen)({
    tile: tiles_1.tileMap[tiles_1.TileName.DIRT],
    tiles: {
        d19: tiles_1.tileMap[tiles_1.TileName.STONE_WALL],
    },
});
exports.afghanistan = afghanistan;
//# sourceMappingURL=defaultScreen.js.map