"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherScreen = exports.defaultScreen = void 0;
const tiles_1 = require("../tiles");
const screenUtils_1 = require("./screenUtils");
const defaultScreen = (0, screenUtils_1.createScreen)({ tile: tiles_1.tileMap[tiles_1.TileName.DIRT] });
exports.defaultScreen = defaultScreen;
const otherScreen = (0, screenUtils_1.createScreen)({ tile: tiles_1.tileMap[tiles_1.TileName.GRASS] });
exports.otherScreen = otherScreen;
//# sourceMappingURL=defaultScreen.js.map