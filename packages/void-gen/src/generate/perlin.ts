import SimplexNoise from 'simplex-noise';

const HEIGHT = 864;
const WIDTH = 1296;

//16x24 screens

export const generatePerlinNoise = () => {
	const simplex = new SimplexNoise();
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const root = document.getElementById('svelte');

	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.style.backgroundColor = 'black';

	const grid = [];

	// create grid
	for (let y = 0; y < 128; y++) {
		const row = [];
		for (let x = 0; x < 192; x++) {
			const nx = x / 192 - 0.5;
			const ny = y / 128 - 0.5;

			const e =
				1 * simplex.noise2D(1 * nx, 1 * ny) +
				0.5 * simplex.noise2D(2 * nx, 2 * ny) +
				0.25 * simplex.noise2D(4 * nx, 4 * ny);

			const ee = e / (1 + 0.5 + 0.25);

			// const value = simplex.noise2D(10 * nx, 10 * ny);
			// const value = Math.pow(e, 5);
			const value = e;
			row.push(value);
		}
		grid.push(row);
	}

	// render grid
	for (let y = 0; y < 128; y++) {
		const row = [];
		for (let x = 0; x < 192; x++) {
			const value = grid[y][x];
			let color = 'black';

			if (value < 0.1) {
				color = 'blue';
			} else if (value < 0.2) {
				color = 'yellow';
			} else if (value < 0.3) {
				color = '#74a963';
			} else if (value < 0.5) {
				color = '#417e62';
			} else if (value < 0.7) {
				color = '#a4bd7d';
			} else if (value < 0.9) {
				color = '#bed2af';
			} else {
				color = 'white';
			}

			context.fillStyle = color;
			context.fillRect(x * (WIDTH / 192), y * (HEIGHT / 128), 6.75, 6.75);
		}
	}

	root.append(canvas);

	console.log(grid);
};
