

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let dropdown = false;

  type TileMap = { [key: string]: Tile };

  enum TileName {
    DIRT = "Dirt",
    GRASS = "Grass",
    STONE_WALL = "Stone Wall",
  }
  
  interface Tile {
    color: string;
    collide: boolean;
  }

  const tileMap: TileMap = {
    [TileName.DIRT]: {
      color: '#A0522D',
      collide: false,
    },
    [TileName.GRASS]: {
      color: '#006400',
      collide: false,
    },
    [TileName.STONE_WALL]: {
      color: '#778899',
      collide: true,
    },
  };

  let currentSelectedTile: TileName = TileName.DIRT;
  const tileNames = [
    TileName.DIRT,
    TileName.GRASS,
    TileName.STONE_WALL,
  ];

  function toggleDropdown() {
    dropdown = !dropdown;
  }

  function changeSelected(tileName: TileName) {
    currentSelectedTile = tileName;
    dispatch("tileChanged", {
     name: tileName,
     tile: tileMap[tileName]
    });
    toggleDropdown();
  }

</script>


<div class="dropdown-container" style={dropdown ? 'border-radius: 10px 10px 0 0' : ''}>
  <div class="dropdown-selector">
    <div class="dropdown-color" style={`background-color: ${tileMap[currentSelectedTile].color}`}></div>
    <div style="text-align:start; width: 45%"><b>{currentSelectedTile}</b></div>
    <button class="dropdown-button" on:click={toggleDropdown}>Select</button>
  </div>
  {#if dropdown}
    <div class="dropdown">
      {#each tileNames as tileName}
        <div class="dropdown-option" on:click={() => changeSelected(tileName)}>{tileName}</div>
      {/each}
    </div>
  {/if}
</div>




<style>
  .dropdown-container {
    width: 100%;
    height: 50px;
    background-color: whitesmoke;
    border-radius: 10px;
    display: flex;
    position: relative;
    justify-content: center;
  }

  .dropdown-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
  }

  .dropdown-button {
    margin:0;
    cursor: pointer;
  }
  
  .dropdown-color {
    width: 25px;
    height: 25px;
  }

  .dropdown-option {
    cursor: pointer;
    padding: 4px 0;
    text-indent: 5px;
    color: whitesmoke;
  }

  .dropdown-option:hover {
    border-radius: 5px;
    background-color: rgb(91, 91, 218);
  }

  .dropdown {
    width: calc(100% - 10px);
    top: 50px;
    position: absolute;
    border-radius: 0px 0px 10px 10px;
    background-color: #585888;
    padding: 5px;
  }
</style>