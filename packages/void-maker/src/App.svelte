<script>
	import HsvPicker from './Colors.svelte';
	let states = [
		{
			name: 'Color',
		},
		{
			name: 'Highlight',
			highlightIndex: {pointOne: {x: 0, y: 0}, pointTwo: {x: 0, y: 0}},
			selecting: "one",
		}
	];
	let currState = states[0];

	let selectedColor = {r: 0, g: 0, b: 0, a:0 };
	let index = {x: 0, y: 0};
	let mySavedGrid = null;

	let gridWidth = 10;
	let gridHeight = 10;
	
	let grid = Array.from({length: gridHeight}, e => Array(gridWidth));
	

	for (let i = 0; i < gridHeight; i++) {
		for (let j = 0; j < gridWidth; j++) {
			grid[i][j] = {
				color: {r: 0, g: 0, b: 0, a: 0},
				border: "2px solid black",
			};
		}
	}
	
	function colorCallback(rgba) {
		selectedColor = rgba.detail;
	}

	function updateHighlightState(index) {
		if (currState.selecting === "one") {
			grid[currState.highlightIndex.pointOne.x][currState.highlightIndex.pointOne.y].border = "2px solid black";
			currState.highlightIndex.pointOne = {x: index.x, y: index.y};
			currState.selecting = "two"
			grid[index.x][index.y].border = "2px solid red";
		} else {
			grid[currState.highlightIndex.pointTwo.x][currState.highlightIndex.pointTwo.y].border = "2px solid black";
			currState.highlightIndex.pointTwo = {x: index.x, y: index.y};
			currState.selecting = "one"
			grid[index.x][index.y].border = "2px solid red";
		}
	}
	
	function handleSelect(x,y) {
		index = {x,y};
		let s = selectedColor;
		
		if (currState === states[1]) {
			updateHighlightState(index);
		} else {
			grid[x][y] = {...grid[x][y], color: {r: s.r, g: s.g, b: s.b, a: s.a}};
		}
	}
	
	function clearGrid() {
		for (let i = 0; i < gridHeight; i++) {
			for (let j = 0; j < gridWidth; j++) {
				grid[i][j] = {
					color: {r: 0, g: 0, b: 0, a: 0},
					border: "2px solid black",
				}
			}
		}
	}
	
	function saveGrid() {
		const currGrid = JSON.stringify(grid);
		mySavedGrid = currGrid;
		clearGrid();
	}
	
	function loadGrid() {
		if (mySavedGrid) {
			const savedGrid = JSON.parse(mySavedGrid);
			grid = savedGrid;
		}
	}


	function switchState(state) {
		currState = state;
		clearGrid();
	}
	
</script>



<div>

	<div class="mode-select">
		<button on:click={() => switchState(states[0])} class="button {currState === states[0] ? 'button-highlight' : ''}">
			Color
		</button>
		<button on:click={() => switchState(states[1])} class="button {currState === states[1] ? 'button-highlight' : ''}">
			Highlight
		</button>
	</div>

	
		<div class="controls">
			{#if currState === states[0]}
				<button on:click={clearGrid} class="button">
					Clear
				</button>
				<button on:click={saveGrid} class="button">
					Save Layout
				</button>
				<button on:click={loadGrid} class="button">
					Load Layout
				</button>
			{:else if currState === states[1]}
				<p>point one => x: {currState.highlightIndex.pointOne.x}, y: {currState.highlightIndex.pointOne.y}</p>
				<p>point two => y: {currState.highlightIndex.pointTwo.x}, y: {currState.highlightIndex.pointTwo.y}</p>
				<p>Selecting <b>{currState.selecting}</b></p>
				<button>Select Section</button>
			{/if}
		</div>

	<div class="controls">
		
	</div>
	<div style="margin: 0px 20px">
		{#each {length: gridHeight} as _, i}
		<div class="row">
			{#each {length: gridWidth} as _, j}
			<div on:click|self={() => handleSelect(i,j)} 
				class="block"
				style="
				background-color: rgba({grid[i][j].color.r}, {grid[i][j].color.g}, {grid[i][j].color.b}, {grid[i][j].color.a}); 
				border: {grid[i][j].border}
				"
				>
			</div>
			{/each}
		</div>
		{/each}
	</div>
	
	<HsvPicker on:colorChange={colorCallback} startColor={"#FBFBFB"}/>

</div>
	
<style>
	
	.controls {
		display: flex;
		justify-content: space-around;
		width: 900px;
	}

	.button {
		background-color: aliceblue;
		color: black;
		border-radius: 10px;
		width: 200px;
		margin: 10px;
	}
	.button-highlight {
		background-color: tomato;
		color: white;
	}
	
	.row {
		display: flex;
	}
	
	.block {
		height: 20px;
		width: 20px;
		margin: 2px;
		border-radius: 5px;
	}





</style>