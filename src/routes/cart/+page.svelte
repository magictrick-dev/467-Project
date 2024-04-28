<script>
  import * as helpers from "$lib/helpers.js";
  export let data;

  let subtotal = 0.00;
  let subweight = 0;
  let last_weight_price = 0.00;
  let weight_index = 1;
  let total = 0.00;
  if (!data.is_empty) {
    data.items.forEach((product) => {
      subtotal += (product.qty * product.item.price);
      subweight += (product.qty * product.item.weight);
    })

    last_weight_price = data.weights[0].price;
    weight_index = data.weights[0].ID;
    data.weights.forEach((winfo) => {
      if (subweight >= winfo.weight_maximum)
      {
        last_weight_price = winfo.price;
        weight_index = winfo.ID;
      }
    });

    total = subtotal + last_weight_price;
  }

</script>

<svelte:head>
	<title>Cart</title>
	<meta name="description" content="Cart" />
</svelte:head>

<div class="container-md">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
  <section>
    <ul class="list-group p-2">
      {#if data.is_empty != true }
        {#each data.items as product}
          <li class="list-group-item">
            <div class="d-flex justify-content-between">
              <div class="p-2">
                <img height="60px" class="float-start" src="{product.img}" alt="productimage"/>
                <strong>{helpers.to_pretty(product.item.description)}</strong><br/>
                <span>Weight: {product.item.weight} lbs.</span>
                <form method="POST" action="?/update">
                  <div class="input-group">
                    <input type="number" min="0" class="form-control" placeholder="Quantity" value="{product.qty}" name="qty">
                    <button class="btn btn-secondary" type="cart" name="item" value="{product.item.number}" id="button-addon1">Update</button>
                  </div>
                </form>
              </div>
              <div>
                <strong>Base Price:</strong> ${product.item.price}<br/>
                <strong>Ext. Price:</strong> ${(product.item.price * product.qty).toFixed(2)}
              </div>

            </div>
          </li>
        {/each}
      {:else}
         <h3>Your cart is empty!</h3>
      {/if}
    </ul>
    <div class="d-flex justify-content-end">
      <div class="d-flex justify-content-between" style="width: 300px;">
        <div>
          <div class="p-2">Subtotal: ${subtotal.toFixed(2)}</div>
          <div class="p-2">Shipping: ${last_weight_price.toFixed(2)}</div>
          <div class="p-2"><strong>Total:</strong> ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end p-2">
      <a class="btn btn-secondary" href="../checkout" role="button">Checkout</a>
    </div>
  </section>
  </div>
</div>


<style>
</style>