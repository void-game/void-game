import SimplexNoise from 'simplex-noise';

const HEIGHT = 864;
const WIDTH = 1296;

const MULTIPLIER = 25;

const COLUMNS = 16 * MULTIPLIER;
const ROWS = 24 * MULTIPLIER;

//16x24 screens

// returns a color based on elevation and moisture
const getBiome = (elevation: number, moisture: number): string => {
	// OCEAN
	if (elevation < -0.5) return '#368fe2';

	// BEACH
	if (elevation < -0.4) return '#ece3b1';

	if (elevation > 0.4) {
		// SCORCHED
		if (moisture > 0.1) return '#ef7546';

		// BARE
		if (moisture > 0.2) return '#d0baab';

		// TUNDRA
		if (moisture > 0) return '#bbb1b2';

		// SNOW
		return '#ffffff';
	}

	if (elevation > 0.2) {
		// Temperate Desert
		if (moisture > 0.2) return '#a3654e';

		// Shrubland
		if (moisture > 0.66) return '#a6b391';

		// Taiga
		return '#4c6f46';
	}

	if (elevation > 0) {
		// Temperate Desert
		if (moisture > 0.4) return '#a3654e';

		// Grassland
		if (moisture > 0.2) return '#c7ad67';

		// Temperate Deciduous Forest
		if (moisture > 0) return '#b98727';

		// Temperate Rain Forest
		return '#7b873f';
	}

	// Subtropical Desert
	if (moisture < 0.16) return '#bd8d90';

	// Grassland
	if (moisture < 0.33) return '#c7ad67';

	// Tropical Seasonal Forest
	if (moisture < 0.66) return '#36492f';

	// Tropical Rain Forest
	return '#7b873f';
};

export const generatePerlinNoise = () => {
	const simplex = new SimplexNoise();
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const root = document.getElementById('svelte');

	const moistureSimplex = new SimplexNoise();

	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.style.backgroundColor = 'black';

	const grid = [];

	// create grid
	for (let y = 0; y < COLUMNS; y++) {
		const row = [];
		for (let x = 0; x < ROWS; x++) {
			const nx = x / 192 - 0.5;
			const ny = y / 128 - 0.5;

			const e =
				1 * simplex.noise2D(1 * nx, 1 * ny) +
				0.5 * simplex.noise2D(2 * nx, 2 * ny) +
				0.25 * simplex.noise2D(4 * nx, 4 * ny);

			const ee = e / (1 + 0.5 + 0.25);

			const m =
				1 * moistureSimplex.noise2D(1 * nx, 1 * ny) +
				0.5 * moistureSimplex.noise2D(2 * nx, 2 * ny) +
				0.25 * moistureSimplex.noise2D(4 * nx, 4 * ny);

			const mm = m / (1 + 0.5 + 0.25);

			// const value = simplex.noise2D(10 * nx, 10 * ny);
			// const value = Math.pow(e, 5);
			const value = Math.pow(ee, 1);
			row.push({ elevation: value, moisture: mm });
		}
		grid.push(row);
	}

	// render grid
	for (let y = 0; y < COLUMNS; y++) {
		const row = [];
		for (let x = 0; x < ROWS; x++) {
			const value = grid[y][x];
			let color = getBiome(value.elevation, value.moisture);

			// if (value < -1) {
			// 	color = 'blue';
			// } else if (value < -0.9) {
			// 	color = 'yellow';
			// } else if (value < 0) {
			// 	color = '#004d18';
			// } else if (value < 0.1) {
			// 	color = '#017325';
			// } else if (value < 0.15) {
			// 	color = '#00ba3b';
			// } else if (value <= 0.2) {
			// 	color = '#31d464';
			// } else if (value <= 0.3) {
			// 	color = '#74a963';
			// } else if (value <= 0.5) {
			// 	color = '#63db89';
			// } else if (value <= 0.7) {
			// 	color = '#a4bd7d';
			// } else if (value <= 0.9) {
			// 	color = '#bed2af';
			// } else {
			// 	color = 'white';
			// }

			context.fillStyle = color;
			context.fillRect(
				x * (WIDTH / ROWS),
				y * (HEIGHT / COLUMNS),
				54 / MULTIPLIER,
				54 / MULTIPLIER
			);
		}
	}

	root.append(canvas);
};
