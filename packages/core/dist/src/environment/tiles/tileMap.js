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
    [Tiles_types_1.TileName.STONE]: {
        color: '#787876',
        collide: false,
    },
    [Tiles_types_1.TileName.STONE_WALL]: {
        color: '#778899',
        collide: true,
    },
    [Tiles_types_1.TileName.WATER]: {
        color: '#3333f5',
        collide: false
    },
    [Tiles_types_1.TileName.BEACH]: {
        color: '#ffffda',
        collide: false
    },
    [Tiles_types_1.TileName.FOREST]: {
        color: '#60a473',
        collide: false
    },
    [Tiles_types_1.TileName.PEAK]: {
        color: '#a6a6a6',
        collide: false
    },
    [Tiles_types_1.TileName.SNOW]: {
        color: 'white',
        collide: false
    },
};
//# sourceMappingURL=tileMap.js.map