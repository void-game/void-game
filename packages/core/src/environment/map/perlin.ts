import SimplexNoise from 'simplex-noise';
import { TileName, tileMap } from '../tiles';
import { letters } from '../screens';

export const enum MapType {
	GAME_MAP,
	PERLIN_MAP,
}

export interface MapConfig {
	screenMultiplier: number;
	frequency: number;
	redistribution: number;
	mapType: MapType;
}

const HEIGHT = 864;
const WIDTH = 1296;
const BLOCK_SIZE = 54;
const SCREEN_HEIGHT = 16;
const SCREEN_WIDTH = 24;

const getNoise = (nx: number, ny: number, simplex: SimplexNoise) => {
	// rescale from -1:+1 to 0:1
	return simplex.noise2D(nx, ny) / 2 + 0.5;
};


const getBiome = (e: number, m: number) => {
	// Water
	if (e < 0.06) return tileMap[TileName.WATER];

	// Beach
	if (e < 0.07) return tileMap[TileName.BEACH];

	// Grass
	if (e < 0.3) return tileMap[TileName.GRASS];

	// Forest
	if (e < 0.5) return tileMap[TileName.FOREST];

	// Dirt
	if (e < 0.6) return tileMap[TileName.DIRT];

	// Stone
	if (e < 0.7) return tileMap[TileName.STONE];

	// Peak
	if (e < 0.8) return tileMap[TileName.PEAK];

	// Snow
	return tileMap[TileName.SNOW];
};

const genSliceBoundaries = (multiplier, mapHeight, mapWidth) => {
	const screenSliceHeight = (mapHeight / multiplier);
	const screenSliceWidth = (mapWidth / multiplier);
	return {screenSliceHeight, screenSliceWidth};
}

// X, Y, Z
// 0,0,0, 0,1,0, 
// TODO fix desired height and width
const sliceMap = (map: any, sliceHeight: any, sliceWidth: any) => {
	const screenMap = {};
	const screenMapHeight = map.length / sliceHeight;
	const screenMapWidth = map[0].length / sliceWidth;

	for (let y = 0; y < map.length; y += sliceHeight) {
		for (let x = 0; x < map[0].length; x += sliceWidth) {
			
			const slicedChunk: any = Array.from({length: sliceHeight}, e => Array(sliceWidth));
			for (let sy = 0; sy < sliceHeight; sy++) {
				for (let sx = 0; sx < sliceWidth; sx++) {
					slicedChunk[sy][sx] = map[y + sy][x + sx];
				}
			}

			// getting actual map coordinates by chunk
			const mapY = y / sliceHeight;
			const mapX = x / sliceWidth;
			const expandedChunkScreen = expandSlicedChunk(slicedChunk, 16, 24);

			screenMap[`${mapX},${mapY},${0}`] = expandedChunkScreen;
		}
	}

	return { screenMap, screenMapHeight, screenMapWidth };
}


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

			// translate 0 - 3 into 0, 4 - 7 into 1, 8 - 11 into 2, ....
			const chunkY = Math.floor(y / heightMultiplier);
			const chunkX = Math.floor(x / widthMultiplier);

			expandedScreen[`${letters[y]}${x}`] = { tile: {...slicedChunk[chunkY][chunkX]}, position: {x, y}};

		}
	}
	
	return expandedScreen;
}

export const generateMap = (config: MapConfig): any => {
	const MAP_HEIGHT = SCREEN_HEIGHT * config.screenMultiplier;
	const MAP_WIDTH = SCREEN_WIDTH * config.screenMultiplier;
	const simplex = new SimplexNoise();
	const moistSimplex = new SimplexNoise();
	const map = Array.from({length: MAP_HEIGHT}, e => Array(MAP_WIDTH));

	for (let y = 0; y < MAP_HEIGHT; y++) {
		for (let x = 0; x < MAP_WIDTH; x++) {
			const nx = x / MAP_WIDTH - 0.5;
			const ny = y / MAP_HEIGHT - 0.5;

			// Perlin map mods
			const octave1 = getNoise(nx, ny, simplex);
			const octave2 = 0.5 * getNoise(2 * nx, 2 * ny, simplex);
			const octave3 = 0.25 * getNoise(4 * nx, 4 * ny, simplex);
			const moisture = getNoise(config.frequency * nx, config.frequency * ny, moistSimplex);
			const elevation = Math.pow((octave1 + octave2 + octave3) / 1.75, config.redistribution);

			const biomeTile = getBiome(elevation, moisture);
			map[y][x] = biomeTile; 

		}
	}

	// Simple perlin map
	if (config.mapType === MapType.PERLIN_MAP) {
		return { map };

	// Map & details for use in Void
	} else {
		const {screenSliceHeight, screenSliceWidth} = genSliceBoundaries(config.screenMultiplier, MAP_HEIGHT, MAP_WIDTH);
		const { screenMap, screenMapHeight, screenMapWidth } = sliceMap(map, screenSliceHeight, screenSliceWidth);
		return { screenMap, screenMapHeight, screenMapWidth };
	}

};
