<script>
  import * as helpers from "$lib/helpers.js";
  export let data;
</script>

<svelte:head>
	<title>Customer Order Details</title>
</svelte:head>



<div class="container-md">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
    <h2 style="text-center">Warehouse Management</h2>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Part Number</th>
          <th scope="col">Part Name</th>
          <th scope="col">Database Set</th>
          <th scope="col">Current Quantity</th>
          <th scope="col">Adjust</th>
        </tr>
      </thead>
      <tbody>
        {#each data.parts as part}
        <tr>
          <td># {part.item.number}</td>
          <td>{helpers.to_pretty(part.item.description)}</td>
          <td>{helpers.to_pretty(`${part.set}`)}</td>
          <td>{part.qty}</td>
          <td>
            <form method="POST" action="?/update">
              <div class="input-group mb-3">
                <input type="text" class="form-control" value="{part.qty}" name="qty" placeholder="{part.qty}">
                <input type="hidden" name="id" value="{part.item.number}" />
                <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Adjust</button>
              </div>
            </form>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>

  </div>
</div>


<style>

</style>
