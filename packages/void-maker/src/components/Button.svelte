<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let text: string = "Button";
  const dispatch = createEventDispatcher();
  function onClickHandler() {
    dispatch('onSelected');
  }

</script>

  <button on:click={onClickHandler} class="button">
    {text}
  </button>

<style>
  .button {
    width: 5em;
    border-radius: 8px;
    background-color: whitesmoke;
    font-weight: bold;
    margin: 5px 10px;
  }

  .button:hover {
    transform: scale(1.1);
		cursor: pointer;
  }

</style>
