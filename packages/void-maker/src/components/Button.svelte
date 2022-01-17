<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let text: string = "Button";
  export let style: string = "width: 10em";
  const dispatch = createEventDispatcher();
  function onClickHandler() {
    dispatch('onSelected');
  }

</script>

  <button on:click={onClickHandler} style={style} class="button">
    {text}
  </button>

<style>
  .button {
    border-radius: 8px;
    background-color: whitesmoke;
    font-weight: bold;
  }

  .button:hover {
		cursor: pointer;
    box-shadow: 0px 0px 10px 1px rgb(160, 160, 160);
  }

</style>
