"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMap = void 0;
const simplex_noise_1 = __importDefault(require("simplex-noise"));
const tiles_1 = require("../tiles");
const screens_1 = require("../screens");
const HEIGHT = 864;
const WIDTH = 1296;
const BLOCK_SIZE = 54;
const SCREEN_HEIGHT = 16;
const SCREEN_WIDTH = 24;
const getNoise = (nx, ny, simplex) => {
    return simplex.noise2D(nx, ny) / 2 + 0.5;
};
const getBiome = (e, m) => {
    if (e < 0.06)
        return tiles_1.tileMap[tiles_1.TileName.WATER];
    if (e < 0.07)
        return tiles_1.tileMap[tiles_1.TileName.BEACH];
    if (e < 0.3)
        return tiles_1.tileMap[tiles_1.TileName.GRASS];
    if (e < 0.5)
        return tiles_1.tileMap[tiles_1.TileName.FOREST];
    if (e < 0.6)
        return tiles_1.tileMap[tiles_1.TileName.DIRT];
    if (e < 0.7)
        return tiles_1.tileMap[tiles_1.TileName.STONE];
    if (e < 0.8)
        return tiles_1.tileMap[tiles_1.TileName.PEAK];
    return tiles_1.tileMap[tiles_1.TileName.SNOW];
};
const genSliceBoundaries = (multiplier, mapHeight, mapWidth) => {
    const screenSliceHeight = (mapHeight / multiplier);
    const screenSliceWidth = (mapWidth / multiplier);
    return { screenSliceHeight, screenSliceWidth };
};
const sliceMap = (map, sliceHeight, sliceWidth) => {
    const screenMap = {};
    const screenMapHeight = map.length / sliceHeight;
    const screenMapWidth = map[0].length / sliceWidth;
    for (let y = 0; y < map.length; y += sliceHeight) {
        for (let x = 0; x < map[0].length; x += sliceWidth) {
            const slicedChunk = Array.from({ length: sliceHeight }, e => Array(sliceWidth));
            for (let sy = 0; sy < sliceHeight; sy++) {
                for (let sx = 0; sx < sliceWidth; sx++) {
                    slicedChunk[sy][sx] = map[y + sy][x + sx];
                }
            }
            const mapY = y / sliceHeight;
            const mapX = x / sliceWidth;
            const expandedChunkScreen = expandSlicedChunk(slicedChunk, 16, 24);
            screenMap[`${mapX},${mapY},${0}`] = expandedChunkScreen;
        }
    }
    return { screenMap, screenMapHeight, screenMapWidth };
};
const expandSlicedChunk = (slicedChunk, desiredHeight, desiredWidth) => {
    const expandedScreen = {};
    const heightMultiplier = (1 / slicedChunk.length) * desiredHeight;
    const widthMultiplier = (1 / slicedChunk[0].length) * desiredWidth;
    const sliceHeight = slicedChunk.length;
    const sliceWidth = slicedChunk[0].length;
    const screenHeight = sliceHeight * heightMultiplier;
    const screenWidth = sliceWidth * widthMultiplier;
    for (let y = 0; y < screenHeight; y++) {
        for (let x = 0; x < screenWidth; x++) {
            const chunkY = Math.floor(y / heightMultiplier);
            const chunkX = Math.floor(x / widthMultiplier);
            expandedScreen[`${screens_1.letters[y]}${x}`] = { tile: Object.assign({}, slicedChunk[chunkY][chunkX]), position: { x, y } };
        }
    }
    return expandedScreen;
};
const generateMap = (config) => {
    const MAP_HEIGHT = SCREEN_HEIGHT * config.screenMultiplier;
    const MAP_WIDTH = SCREEN_WIDTH * config.screenMultiplier;
    const simplex = new simplex_noise_1.default();
    const moistSimplex = new simplex_noise_1.default();
    const map = Array.from({ length: MAP_HEIGHT }, e => Array(MAP_WIDTH));
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const nx = x / MAP_WIDTH - 0.5;
            const ny = y / MAP_HEIGHT - 0.5;
            const octave1 = getNoise(nx, ny, simplex);
            const octave2 = 0.5 * getNoise(2 * nx, 2 * ny, simplex);
            const octave3 = 0.25 * getNoise(4 * nx, 4 * ny, simplex);
            const moisture = getNoise(config.frequency * nx, config.frequency * ny, moistSimplex);
            const elevation = Math.pow((octave1 + octave2 + octave3) / 1.75, config.redistribution);
            const biomeTile = getBiome(elevation, moisture);
            map[y][x] = biomeTile;
        }
    }
    if (config.mapType === 1) {
        return { map };
    }
    else {
        const { screenSliceHeight, screenSliceWidth } = genSliceBoundaries(config.screenMultiplier, MAP_HEIGHT, MAP_WIDTH);
        const { screenMap, screenMapHeight, screenMapWidth } = sliceMap(map, screenSliceHeight, screenSliceWidth);
        return { screenMap, screenMapHeight, screenMapWidth };
    }
};
exports.generateMap = generateMap;
//# sourceMappingURL=perlin.js.map