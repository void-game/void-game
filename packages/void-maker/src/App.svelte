<script lang="ts">
	import Button from './components/Button.svelte';
	import Dropdown from './components/Dropdown.svelte';
	import Clipboard from 'svelte-clipboard';

	// default tile == dirt
	let defaultTile = {
		name: "Dirt",
		tile: {
			color: '#A0522D',
      collide: false,
		}
  }

	let currentTile = defaultTile;

	const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	interface Tile {
		color: string,
		collide: boolean,
	}

	interface TileGrid {
		grid: Tile[][],
		height: number,
		width: number,
	}

	let tileGrid: TileGrid = {
		grid: Array.from({length: 16}, e => Array(24)),
		height: 16,
		width: 24,
	}

	interface GridIndex {
		x: number,
		y: number,
	}
	
	let currentIndex: GridIndex = {x: 0, y: 0};

	// Currently Saved Grid
	let currentSavedGrid = null;

	function initializeGrid() {
		for (let i = 0; i < tileGrid.height; i++) {
			for (let j = 0; j < tileGrid.width; j++) {
				tileGrid.grid[i][j] = defaultTile.tile;
			}
		}
	}
	initializeGrid();
	
	function clearGrid() {
		for (let i = 0; i < tileGrid.height; i++) {
			for (let j = 0; j < tileGrid.width; j++) {
				tileGrid.grid[i][j] = defaultTile.tile;
			}
		}
	}
	
	function saveGrid() {
		const currGrid = JSON.stringify(tileGrid.grid);
		currentSavedGrid = currGrid;
	}
	
	function loadGrid() {
		if (currentSavedGrid) {
			const savedGrid = JSON.parse(currentSavedGrid);
			tileGrid.grid = savedGrid;
		}
	}

	
	function onCellSelected(x: number, y: number) {
		currentIndex = {x,y};
		tileGrid.grid[x][y] = currentTile.tile;
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
					tileGrid.grid[i][j] = currentTile.tile;
				}
			}
		}
	}

	function onTileChange(newTile){
		currentTile = newTile.detail;
	}

	let generatedMap = '';

	function generateTileMap() {
		const finalMap = {};
		for (let i = 0; i < tileGrid.height; i++) {
			for (let j = 0; j < tileGrid.width; j++) {
				finalMap[`${letters[i]}${j}`] = {tile: tileGrid.grid[i][j], position: { x: j, y: i } };
			}
		}
  	generatedMap = JSON.stringify(finalMap);
	}

</script>
	
<style>
	:root {
		background-color: #585888;
	}

	main {
		display: flex;
		justify-content: center;
	}

	.container {
		width: 100%;
		display: flex;
		justify-content: space-around;
		position: relative;
		padding: 5em 10em;
		top: 10vh;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ACACDE;
		padding: 2em;
		border-radius: 10px;
		box-shadow: 0px 0px 10px 1px black;
		width: 20%;
	}

	.grid-container {
		display: grid;
		grid-template-areas:
      ". numberrow"
      "lettercol grid";
    gap: 10px;
		margin: 10px;
	}

	.grid {
		grid-area: grid;
	}

	.letter-col {
		display: flex;
		flex-direction: column;
		grid-area: lettercol;
	}

	.letter-col-letter {	
		color: white;
		font-weight: bold;	
		font-family: monospace;
		font-size: 18px;
		height: 30px;
		width: 30px;
		margin: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.number-row {
		display: flex;
		grid-area: numberrow;
	}

	.number-row-number {
		color: white;
		font-weight: bold;	
		font-family: monospace;
		font-size: 18px;
		height: 30px;
		width: 30px;
		margin: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.row {
		display: flex;
	}
	
	.block {
		height: 30px;
		width: 30px;
		margin: 2px;
		border-radius: 5px;
		border: 2px solid black;
		box-sizing: border-box;
	}

	.block:hover {
		transform: scale(1.1);
		border-color: rgb(238, 101, 101);
		cursor: pointer;
	}

	.file-buttons {
		display: flex;
		width: 100%;
		margin: 1em 0 2em 0;
	}

</style>
<main>
	<div class="container">
		
		<div class="controls">
			<Dropdown on:tileChanged={onTileChange}/>
			<Button style="width: 100%; margin: 2em 0 0 0;" text="Clear" on:onSelected={clearGrid} />
			<div class="file-buttons">
				<Button style="width: 100%; margin: 0 5px 0 0" text="Generate Map" on:onSelected={generateTileMap} />
				<Button style="width: 100%; margin: 0 0px 0 5px" text="Load Map" on:onSelected={loadGrid} />	
			</div>
			<textarea style="justify-self: end; border-radius: 10px; resize: none" name="" id="" cols="32" rows="14">{generatedMap}</textarea>
			<Clipboard
				text={generatedMap}
				let:copy
				on:copy={() => {
					console.log('Has Copied');
				}}>
				<Button style="width: 100%; margin: 2em 0 0 0;" text="Copy to Clipboard" on:onSelected={copy} />
			</Clipboard>
		</div>

		<!-- <HsvPicker on:colorChange={colorCallback} startColor={"#FBFBFB"}/> -->

		<div class="grid-container">
			<div class="number-row"> 
				{#each {length: tileGrid.width} as _, i}
					<div class="number-row-number">{i}</div>
				{/each}
			</div>
			<div class="letter-col"> 
				{#each {length: tileGrid.height} as _, i}
					<div class="letter-col-letter">{letters[i]}</div>
				{/each}
			</div>
			<div class="grid">
				{#each {length: tileGrid.height} as _, i}
					<div class="row">
						{#each {length: tileGrid.width} as _, j}
							<div 
								on:mousedown|preventDefault={() => onMouseDown(i,j)} 
								on:mouseup={() => onMouseUp(i,j)} 
								on:click|self={() => onCellSelected(i,j)}
								on:mouseenter={() => {}}
								class="block"
								style="background-color: {tileGrid.grid[i][j].color}">
							</div>
						{/each}
					</div>
				{/each}
			</div>

		</div>
	</div>
</main>


