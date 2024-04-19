<script>
  let products = [1, 2, 3, 4];
  let amount = [2, 5, 1, 3];
  let cost = [4.00, 2.99, 4.50, 5.00];
  let subtotal = 0;

  function clear(event) {
    let temp_prods =[];
    for(let b in products) {
      if(b != event.srcElement.getAttribute("id")) {
        temp_prods.push(products[b]);
      }
    }
    products = temp_prods;

    let temp_amounts =[];
    for(let b in amount) {
      if(b != event.srcElement.getAttribute("id")) {
        temp_amounts.push(amount[b]);
      }
    }
    amount = temp_amounts;
  }

  function calcSubtotal() {
    subtotal = 0;
    for(let i in products) {
      subtotal += amount[i]*cost[i];
    }
    return subtotal;
  }
</script>

<svelte:head>
	<title>Cart</title>
	<meta name="description" content="Cart" />
</svelte:head>

<section>
  <ul class="list-group p-2">
    {#each products as _, i}
      <li class="list-group-item">
        <div class="d-flex justify-content-between">
          <div class="p-2">
            {products[i]}
            <input type="number" bind:value={amount[i]} min="0" max="100"/>
            <button class="btn btn-secondary btn-sm" id={i} on:click={clear}>
              remove item
            </button>
          </div>
          ${(cost[i]*amount[i]).toFixed(2)}
        </div>
      </li>
    {/each}
  </ul>
  <div class="d-flex justify-content-end p-2">
    <button class="btn btn-secondary" on:click={calcSubtotal}>Get Subtotal</button>
  </div>
  <div class="d-flex justify-content-end">
    <div class="d-flex justify-content-between" style="width: 300px;">
      <div class="p-2">Subtotal:</div>
      <div class="p-2">${subtotal}</div>
    </div>
  </div>
  <div class="d-flex justify-content-end p-2">
    <a class="btn btn-secondary" href="../checkout" role="button">Checkout</a>
  </div>
</section>

<style>
</style>