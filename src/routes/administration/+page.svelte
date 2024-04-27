<script>
  import WeightRow from "$lib/components/weightrow.svelte"
  export let data;

  let brackets = data.weight_table;

  function add_bracket()
  {
    brackets.push({weight: 0, price: 0.00, id: "New"});
    brackets = brackets;
  }

</script>

<svelte:head>
	<title>Administration Portal</title>
</svelte:head>



<div class="container-md">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
    <h2 style="text-center">Shipping Pricing Administration</h2><br/>
    <button class="btn btn-primary mb-2" on:click={add_bracket}>Insert Row</button>

    <form method="POST" action="?/updateWeights">
      {#each brackets as weight}
      <WeightRow price="{weight.price}" weight="{weight.weight}", id="{weight.id}" />
      {/each}
      <button class="btn btn-primary">Submit Changes</button>
    </form>

  </div>
</div>


<style>

</style>
