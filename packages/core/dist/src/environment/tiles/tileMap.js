"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileMap = void 0;
const Tiles_types_1 = require("./Tiles.types");
exports.tileMap = {
    [Tiles_types_1.TileName.DIRT]: {
        color: '#A0522D',
        collide: false,
    },
    [Tiles_types_1.TileName.GRASS]: {
        color: '#006400',
        collide: false,
    },
    [Tiles_types_1.TileName.STONE_WALL]: {
        color: '#778899',
        collide: true,
    },
};
//# sourceMappingURL=tileMap.js.map