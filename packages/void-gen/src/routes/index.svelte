<script lang="ts">
    import { generateMap } from '@core';
</script>

<button on:click={() => generateMap({ screenMultiplier: 25, frequency: 10, redistribution: 1.9 })}>Generate World</button>