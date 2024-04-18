<script>
  export let data;
  let status = "1";
  let cost = [4.00, 2.99, 4.50, 5.00];
  let subtotal = 0;
  let shipping = 0;

  function calcSubtotal() {
    subtotal = 0;
    for(let i in data.post.items) {
      subtotal += data.post.quantities[i]*cost[i];
    }
    return subtotal;
  }

  function calcShipping() {
    shipping = 0;
    shipping++; // temp
    // get weight cost
    return shipping;
  }

  calcSubtotal();
  calcShipping();
</script>

<svelte:head>
	<title>{data.post.slug}</title>
	<meta name="description" content="{data.post.slug}" />
</svelte:head>

<section>
  <h1 class="py-4">Track Your Order, {data.post.name}</h1>
  {#if status == 0}
    <div class="position-relative m-4">
      <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="height: 1px;">
        <div class="progress-bar" style="width: 0%"></div>
      </div>
      <button type="button" class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">1</button>
      <button type="button" class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill" style="width: 2rem; height:2rem;">2</button>
      <button type="button" class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill" style="width: 2rem; height:2rem;">3</button>
    </div>
  {:else if status == 1}
    <div class="position-relative m-4">
      <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="height: 1px;">
        <div class="progress-bar" style="width: 50%"></div>
      </div>
      <button type="button" class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">1</button>
      <button type="button" class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">2</button>
      <button type="button" class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill" style="width: 2rem; height:2rem;">3</button>
    </div>
  {:else}
    <div class="position-relative m-4">
      <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="height: 1px;">
        <div class="progress-bar" style="width: 50%"></div>
      </div>
      <button type="button" class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">1</button>
      <button type="button" class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">2</button>
      <button type="button" class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">3</button>
    </div>
  {/if}
  <div class="position-relative m-4 py-2">
    <div class="position-absolute translate-middle">
      Processing
    </div>
    <div class="position-absolute start-50 translate-middle">
      Shipped
    </div>
    <div class="position-absolute start-100 translate-middle">
      Arrived
    </div>
  </div>
</section>

<section>
  <h3>Items</h3>
  <ul class="list-group p-2">
    {#each data.post.items as item, i}
      <li class="list-group-item">
        <div class="d-flex justify-content-between">
          <div class="p-1">
            {item}
            <p>
              Amount: {data.post.quantities[i]}
            </p>
          </div>
          ${(cost[i]*data.post.quantities[i]).toFixed(2)}
        </div>
      </li>
    {/each}
  </ul>
  <div class="d-flex justify-content-end">
    <div class="d-flex justify-content-between" style="width: 300px;">
      <div class="p-2">Subtotal:</div>
      <div class="p-2">${subtotal}</div>
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <div class="d-flex justify-content-between" style="width: 300px;">
      <div class="p-2">Shipping:</div>
      <div class="p-2">${shipping}</div>
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <div class="d-flex justify-content-between" style="width: 300px;">
      <div class="p-2">Total:</div>
      <div class="p-2">${subtotal+shipping}</div>
    </div>
  </div>
</section>

<style>
</style>
