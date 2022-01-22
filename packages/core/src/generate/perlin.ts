import SimplexNoise from 'simplex-noise';
import { Tile, TileName, tileMap } from '../environment/tiles';
import { letters } from '../environment/screens';

// const MULTIPLIER = 25;

// const COLUMNS = 16 * MULTIPLIER;
// const ROWS = 24 * MULTIPLIER;

// const REDISTRIBUTION = 1;

// //16x24 screens

// const addTree = () => {};

// // returns a color based on elevation and moisture
// const getBiome = (elevation: number, moisture: number): string => {
// 	// OCEAN
// 	if (elevation < -0.8) return '#368fe2';

// 	// BEACH
// 	if (elevation < -0.7) return '#ece3b1';

// 	if (elevation > 0.4) {
// 		// SCORCHED
// 		if (moisture < -0.8) return '#ef7546';

// 		// BARE
// 		if (moisture < 0) return '#d0baab';

// 		// TUNDRA
// 		if (moisture < 0.2) return '#bbb1b2';

// 		// SNOW
// 		return '#ffffff';
// 	}

// 	if (elevation > 0.2) {
// 		// Temperate Desert
// 		if (moisture < -0.8) return '#a3654e';

// 		// Shrubland
// 		if (moisture < 0) return '#a6b391';

// 		// Taiga
// 		return '#4c6f46';
// 	}

// 	if (elevation > 0) {
// 		// Temperate Desert
// 		if (moisture < -0.8) return '#a3654e';

// 		// Grassland
// 		if (moisture < 0) return '#c7ad67';

// 		// Temperate Deciduous Forest
// 		if (moisture < 0.2) return '#b98727';

// 		// Temperate Rain Forest
// 		return '#7b873f';
// 	}

// 	// Subtropical Desert
// 	if (moisture < -0.8) return '#bd8d90';

// 	// Grassland
// 	if (moisture - 0) return '#c7ad67';

// 	// Tropical Seasonal Forest
// 	if (moisture < 0.2) return '#36492f';

// 	// Tropical Rain Forest
// 	return '#7b873f';
// };

// const ridgenoise = (nx: number, ny: number, s: SimplexNoise) => {
// 	return 2 * (0.5 - Math.abs(0.5 - s.noise2D(nx, ny)));
// };

// export const generatePerlinNoise = () => {
// 	const simplex = new SimplexNoise();
// 	const canvas = document.createElement('canvas');
// 	const context = canvas.getContext('2d');
// 	const root = document.getElementById('svelte');

// 	const moistureSimplex = new SimplexNoise();

// 	const treeSimplex = new SimplexNoise();

// 	canvas.height = HEIGHT;
// 	canvas.width = WIDTH;
// 	canvas.style.backgroundColor = 'black';

// 	const grid = [];

// 	// create grid
// 	for (let y = 0; y < COLUMNS; y++) {
// 		const row = [];
// 		for (let x = 0; x < ROWS; x++) {
// 			const nx = x / 192 - 0.5;
// 			const ny = y / 128 - 0.5;

// 			const e =
// 				1 * ridgenoise(1 * nx, 1 * ny, simplex) +
// 				0.5 * ridgenoise(2 * nx, 2 * ny, simplex) +
// 				0.25 * ridgenoise(4 * nx, 4 * ny, simplex);

// 			const ee = e / (1 + 0.5 + 0.25);

// 			const m =
// 				1 * moistureSimplex.noise2D(1 * nx, 1 * ny) +
// 				0.5 * moistureSimplex.noise2D(2 * nx, 2 * ny) +
// 				0.25 * moistureSimplex.noise2D(4 * nx, 4 * ny);

// 			const mm = m / (1 + 0.5 + 0.25);

// 			// const value = simplex.noise2D(10 * nx, 10 * ny);
// 			// const value = Math.pow(e, 5);
// 			const value = Math.round(ee * 32) / 32;
// 			const moist = Math.round(mm * 32) / 32;
// 			row.push({ elevation: value, moisture: moist });
// 		}
// 		grid.push(row);
// 	}

// 	// render grid
// 	for (let y = 0; y < COLUMNS; y++) {
// 		const row = [];
// 		for (let x = 0; x < ROWS; x++) {
// 			const value = grid[y][x];
// 			let color = getBiome(value.elevation, value.moisture);

// 			// if (value < -1) {
// 			// 	color = 'blue';
// 			// } else if (value < -0.9) {
// 			// 	color = 'yellow';
// 			// } else if (value < 0) {
// 			// 	color = '#004d18';
// 			// } else if (value < 0.1) {
// 			// 	color = '#017325';
// 			// } else if (value < 0.15) {
// 			// 	color = '#00ba3b';
// 			// } else if (value <= 0.2) {
// 			// 	color = '#31d464';
// 			// } else if (value <= 0.3) {
// 			// 	color = '#74a963';
// 			// } else if (value <= 0.5) {
// 			// 	color = '#63db89';
// 			// } else if (value <= 0.7) {
// 			// 	color = '#a4bd7d';
// 			// } else if (value <= 0.9) {
// 			// 	color = '#bed2af';
// 			// } else {
// 			// 	color = 'white';
// 			// }

// 			context.fillStyle = color;
// 			context.fillRect(
// 				x * (WIDTH / ROWS),
// 				y * (HEIGHT / COLUMNS),
// 				54 / MULTIPLIER,
// 				54 / MULTIPLIER
// 			);
// 		}
// 	}

// 	root.append(canvas);
// };

interface MapConfig {
	screenMultiplier: number;
	frequency: number;
	redistribution: number;
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

enum Biome {
	WATER,
	BEACH,
	GRASS,
	FOREST,
	DIRT,
	STONE,
	PEAK,
	SNOW,
}


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

	// WATER
	// if (e < 0.04) return '#4682B4';

	// // BEACH
	// if (e < 0.045) return '#FFDEAD';

	// // SNOW
	// if (e > 0.7) {
	// 	return '#FFFAFA';
	// }

	// // Mountain Land
	// if (e > 0.6) {
	// 	// SCORCHED
	// 	if (m < 0.1) return '#DEB887';

	// 	// BARE
	// 	if (m < 0.2) return '#DCDCDC';

	// 	// TUNDRA
	// 	if (m < 0.5) return '#F0FFFF';

	// 	// SNOW
	// 	return '#FFFAFA';
	// 	// return 'purple';
	// }

	// if (e > 0.55) {
	// 	// DESERT
	// 	// if (m < 0.33) return '#F5DEB3';

	// 	// SHRUBLAND
	// 	if (m < 0.66) return '#6B8E23';

	// 	// TAIGA
	// 	return '#3CB371';
	// 	// return 'green';
	// }

	// if (e > 0.4) {
	// 	// // DESERT
	// 	// if (m < 0.16) return '#F5DEB3';
	// 	// return 'blue';

	// 	// // GRASSLAND
	// 	if (m < 0.5) return '#88aa55';

	// 	// Temperate Decidious Forest
	// 	return '#7B68EE';
	// }

	// // // SUBTROPICAL DESERT
	// if (m < 0.01) return '#FFA07A';

	// // // DRY GRASSLAND
	// if (m < 0.1) return '#F0E68C';

	// // GRASSLAND
	// return '#88aa55';
	// return 'red';
};

const genSliceBoundaries = (multiplier, mapHeight, mapWidth) => {
	const screenSliceHeight = (mapHeight / multiplier) / 4;
	const screenSliceWidth = (mapWidth / multiplier) / 4;
	return {screenSliceHeight, screenSliceWidth};
}

// X, Y, Z
// 0,0,0, 0,1,0, 
// TODO fix desired height and width
const sliceMap = (map: any, sliceHeight: any, sliceWidth: any) => {
	const slicedChunks = {};

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


			slicedChunks[`${mapX},${mapY},${0}`] = expandedChunkScreen;

		}
	}

	return slicedChunks;
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

	// const canvas = document.createElement('canvas');
	// const context = canvas.getContext('2d');
	// const root = document.getElementById('svelte');

	const simplex = new SimplexNoise();
	const moistSimplex = new SimplexNoise();

	// canvas.height = HEIGHT;
	// canvas.width = WIDTH;
	// canvas.style.backgroundColor = 'white';

	const map = Array.from({length: MAP_HEIGHT}, e => Array(MAP_WIDTH));

	for (let y = 0; y < MAP_HEIGHT; y++) {
		for (let x = 0; x < MAP_WIDTH; x++) {
			const nx = x / MAP_WIDTH - 0.5;
			const ny = y / MAP_HEIGHT - 0.5;

			const octave1 = getNoise(nx, ny, simplex);
			// const noise = getNoise(nx * config.frequency, ny * config.frequency, simplex);
			// const octave1 = 1 * getNoise(config.frequency * nx, config.frequency * ny, simplex);
			const octave2 = 0.5 * getNoise(2 * nx, 2 * ny, simplex);
			const octave3 = 0.25 * getNoise(4 * nx, 4 * ny, simplex);

			const moisture = getNoise(config.frequency * nx, config.frequency * ny, moistSimplex);

			const elevation = Math.pow((octave1 + octave2 + octave3) / 1.75, config.redistribution);
			// const elevation = octave1;
			// const noise = Math.pow(octave1, config.redistribution);
			// console.log(noise);

			const biomeTile = getBiome(elevation, moisture);
			map[y][x] = biomeTile; 
			// 	if (context) {
			// 	context.fillStyle = biomeTile.color;
			// 	context.fillRect(
			// 		x * (WIDTH / MAP_WIDTH),
			// 		y * (HEIGHT / MAP_HEIGHT),
			// 		BLOCK_SIZE / config.screenMultiplier,
			// 		BLOCK_SIZE / config.screenMultiplier
			// 	);
			// }
		}
	}

	// if (root){
	// 	root.append(canvas);
	// }

	const {screenSliceHeight, screenSliceWidth} = genSliceBoundaries(config.screenMultiplier, MAP_HEIGHT, MAP_WIDTH);
	const screenMap = sliceMap(map, screenSliceHeight, screenSliceWidth);
	return screenMap;
};



// 6 x 4 

// gggggg
// gggsss
// ggssss
// gggsss


// scale up to 24 x 16
// gggg gggg gggg gggg gggg gggg
// gggg gggg gggg gggg gggg gggg
// gggg gggg gggg gggg gggg gggg
// gggg gggg gggg gggg gggg gggg

// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss

// gggg gggg ssss ssss ssss ssss
// gggg gggg ssss ssss ssss ssss
// gggg gggg ssss ssss ssss ssss
// gggg gggg ssss ssss ssss ssss

// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss
// gggg gggg gggg ssss ssss ssss