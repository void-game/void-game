<script lang="ts">
    import { generateMap } from '../generate';
</script>

<button on:click={() => generateMap({ screenMultipler: 25, frequency: 10, redistribution: 1.9 })}>Generate World</button>