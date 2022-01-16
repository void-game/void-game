<script lang="ts">
	import HsvPicker from './components/ColorPicker.svelte';
	import Button from './components/Button.svelte';

	let debug = false;

	function debugFunc() {
			console.log('xx Color ', selectedColor); // eslint-disable-line
			console.log(`xx Index ${currentIndex.x}, ${currentIndex.y}`); // eslint-disable-line
			console.log('xx Grid ', colorGrid); // eslint-disable-line
	}

	interface Color {
		r: number,
		g: number, 
		b: number,
		a: number,
	}

	interface GridCell {
		color: Color,
		borderColor: Color,
	}
	
	interface ColorGrid {
		grid: GridCell[][],
		height: number,
		width: number,
	}

	let colorGrid: ColorGrid = {
		grid: Array.from({length: 22}, e => Array(32)),
		height: 10,
		width: 10,
	}

	interface GridIndex {
		x: number,
		y: number,
	}
	
	let currentIndex: GridIndex = {x: 0, y: 0};

	// Currently Selected Color
	let selectedColor: Color = {r: 255, g: 255, b: 255, a: 1};

	// Currently Saved Grid
	let currentSavedGrid = null;

	function initializeGrid() {
		for (let i = 0; i < colorGrid.height; i++) {
			for (let j = 0; j < colorGrid.width; j++) {
				colorGrid.grid[i][j] = {
					color: selectedColor,
					borderColor: {r: 0, g: 0, b: 0, a: 0},
				};
			}
		}
	}
	initializeGrid();
	
	function clearGrid() {
		for (let i = 0; i < colorGrid.height; i++) {
			for (let j = 0; j < colorGrid.width; j++) {
				colorGrid.grid[i][j] = {...colorGrid.grid[i][j], color: {r: 255, g: 255, b: 255, a: 1}};
			}
		}
	}
	
	function saveGrid() {
		const currGrid = JSON.stringify(colorGrid);
		currentSavedGrid = currGrid;
	}
	
	function loadGrid() {
		if (currentSavedGrid) {
			const savedGrid = JSON.parse(currentSavedGrid);
			colorGrid = savedGrid;
		}
	}

	function colorCallback(rgba: any) {
		selectedColor = rgba.detail;
	}
	
	function onCellSelected(x: number, y: number) {
		// DEBUG
		debug && debugFunc();

		currentIndex = {x,y};
		colorGrid.grid[x][y] = {
			...colorGrid.grid[x][y],
			color: selectedColor,
		}
	}

	interface HState {
		down: boolean,
		indOne: null | {x: number, y: number},
		indTwo: null | {x: number, y: number},
	}

	const highlightState = {
		down: false,
		indOne: null,
		indTwo: null,
	}

	function onMouseDown(x: number, y: number) {
		highlightState.indOne = {x, y};
		highlightState.down = true;
	}

	function onMouseUp(x: number, y: number) {
		if (highlightState.down) {
			highlightState.indTwo = {x, y};
			highlightSection(highlightState);
			highlightState.down = false;
		}
	}

	function onMouseEnter(x: number, y: number) {
		if (highlightState.down) {

		}
	}

	function highlightSection(hState: HState) {
		if (hState.indOne && hState.indTwo) {
			const {x: x1, y: y1} = hState.indOne;
			const {x: x2, y: y2} = hState.indTwo;
			const xMin = x1 < x2 ? x1 : x2;
			const xMax = x1 < x2 ? x2 : x1;
			const yMin = y1 < y2 ? y1 : y2;
			const yMax = y1 < y2 ? y2 : y1;

			for (let i = xMin; i <= xMax; i++) {
				for (let j = yMin; j <= yMax; j++) {
					colorGrid.grid[i][j] = {
						color: selectedColor,
						borderColor: {r: 0, g: 0, b: 0, a: 1},
					}
				}
			}
		}
	}


</script>
	
<style>
	:root {
		background-color: rgb(88, 88, 136);
	}

	.container {
		display: flex;
		height: 100vh;
		width: 100%;
		justify-content: center;
		position: relative;
		top: 10vh;
	}

	.row {
		display: flex;
	}
	
	.block {
		height: 20px;
		width: 20px;
		margin: 2px;
		border-radius: 5px;
		border: 2px solid black;
	}

	.block:hover {
		transform: scale(1.1);
		border-color: rgb(238, 101, 101);
		cursor: pointer;
	}

</style>

<div class="container">
	
	<div style="display: flex; flex-direction: column">
		<Button text="Clear" on:onSelected={clearGrid} />
		<Button text="Save" on:onSelected={saveGrid} />
		<Button text="Load" on:onSelected={loadGrid} />
	</div>

	<HsvPicker on:colorChange={colorCallback} startColor={"#FBFBFB"}/>

	<div style="margin: 0px 20px">
		{#each {length: colorGrid.height} as _, i}
			<div class="row">
				{#each {length: colorGrid.width} as _, j}
					<div 
						on:mousedown|preventDefault={() => onMouseDown(i,j)} 
						on:mouseup={() => onMouseUp(i,j)} 
						on:click|self={() => onCellSelected(i,j)}
						on:mouseenter={() => {}}
						class="block"
						style="background-color: rgba(
							{colorGrid.grid[i][j].color.r},
							{colorGrid.grid[i][j].color.g},
							{colorGrid.grid[i][j].color.b},
							{colorGrid.grid[i][j].color.a})"
							>
					</div>
				{/each}
			</div>
		{/each}
	</div>

</div>