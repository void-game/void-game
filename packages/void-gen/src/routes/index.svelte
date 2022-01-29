<script lang="ts">
import { onMount } from 'svelte';

    import { generateMap, MapConfig, MapType } from '../../../core/index';

    let mapConfig: MapConfig = {
        screenMultiplier: 25, 
        frequency: 10,
        redistribution: 1.9,
        mapType: MapType.PERLIN_MAP,
    }
    
    const HEIGHT = 864;
    const WIDTH = 1296;
    const SCREEN_HEIGHT = 16;
    const SCREEN_WIDTH = 24;
    const MAP_HEIGHT = SCREEN_HEIGHT * mapConfig.screenMultiplier;
	const MAP_WIDTH = SCREEN_WIDTH * mapConfig.screenMultiplier;
    const BLOCK_SIZE = 54;

    let canvas: HTMLCanvasElement;
    let context;
    onMount(() => {
        context = canvas.getContext('2d');
        if(context) {
            context.scale(.5,.5);
        }
    })

    function createMap() {
        clearMap();
        const { map } = generateMap(mapConfig);
        if (context) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                for (let x = 0; x < MAP_WIDTH; x++) {
                    context.fillStyle = map[y][x].color;
			        context.fillRect(
				        x * (WIDTH / MAP_WIDTH),
				        y * (HEIGHT / MAP_HEIGHT),
				        BLOCK_SIZE / mapConfig.screenMultiplier,
				        BLOCK_SIZE / mapConfig.screenMultiplier
			        );    
                }
            }
		}
    }

    function clearMap() {
        context.clearRect(0, 0, WIDTH, HEIGHT);
    }


</script>

<div class="page">
    <div class="ui-container">
        <div class="control-container">
            <button on:click={createMap}>Generate Map</button>
            <button on:click={clearMap}>Clear Map</button>
        </div>
        <canvas bind:this={canvas} id="canvas" class="mapCanvas" width={WIDTH / 2} height={HEIGHT / 2}></canvas>
    </div>
</div>

<style>
    :root {
        background-color: #585888;
    }

    .page {
        width: 100%;
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mapCanvas {
        background-color: white;
        border: 2px solid #ACACDE;
    }

    .ui-container {
        display: flex;
        flex-direction: column;
    }

    .control-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 15px;
    }

    .control-container button {
        width: 200px;
        padding: 5px;
        cursor: pointer;
        font-family: arial;
        font-weight: bold;
        background-color: #4040be;
        color: white;
        border-radius: 5px;
        border: 2px solid  #4040be;
        box-sizing: border-box;
    }

    .control-container button:hover {
        background-color: rgba(96, 96, 201, 0.843);  
        border: 2px solid  rgba(96, 96, 201, 0.843);
    }

    .control-container button:active {
        background-color: rgba(96, 96, 201, 0.843);
        border-style: inset;
        border: 2px solid  #404068;
    }

</style>