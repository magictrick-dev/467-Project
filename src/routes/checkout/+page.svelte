<script>
  import * as helpers from "$lib/helpers.js";
  export let data;
  let yes = true;
  let subtotal = 0.00;
  let subweight = 0;
  data.items.forEach((product) => {
    subtotal += (product.qty * product.item.price);
    subweight += (product.qty * product.item.weight);
  })

  let last_weight_price = data.weights[0].price;
  let weight_index = data.weights[0].ID;
  data.weights.forEach((winfo) => {
    if (subweight >= winfo.weight_maximum)
    {
      last_weight_price = winfo.price;
      weight_index = winfo.ID;
    }
  });

  let total = subtotal + last_weight_price;
</script>

<svelte:head>
	<title>Checkout</title>
	<meta name="description" content="Checkout" />
</svelte:head>

<div class="container-md">
<div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
  <section>
    <ul class="list-group p-2">
      {#each data.items as product}
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div class="p-1">
              {helpers.to_pretty(product.item.description)}
              <p>
                Quantity: {product.qty}
              </p>
            </div>
            ${(product.item.price * product.qty).toFixed(2)}
          </div>
        </li>
      {/each}
    </ul>
    <div class="d-flex justify-content-end">
      <div class="d-flex justify-content-between" style="width: 300px;">
        <div class="p-2">Subtotal:</div>
        <div class="p-2">${subtotal.toFixed(2)}</div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <div class="d-flex justify-content-between" style="width: 300px;">
        <div class="p-2">Shipping:</div>
        <div class="p-2">${last_weight_price.toFixed(2)}</div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <div class="d-flex justify-content-between" style="width: 300px;">
        <div class="p-2">Total:</div>
        <div class="p-2">${total.toFixed(2)}</div>
      </div>
    </div>
  </section>

  <section>
    <div class="container bd-gutter my-3 bd-layout">
      <form class="was-validated p-2" method="POST" action="?/ordersend">
        <input type="hidden" name="weight_class" value="{weight_index}"/> 
        <h2>Shipping Address</h2>
        <div class="row" style="width: 600px;">
          <div class="col-md-6 mb-2">
            <label for="deliveryFirstName" class="form-label">First Name*</label>
            <input type="text" class="form-control" name="deliveryFirstName" required>
          </div>
          <div class="col-md-6 mb-2">
            <label for="deliveryLastName" class="form-label">Last Name*</label>
            <input type="text" class="form-control" name="deliveryLastName" required>
          </div>
          <div class="col-md-4 mb-2">
            <label for="deliveryPhone" class="form-label">PhoneNumber*</label>
            <input type="text" class="form-control" name="deliveryPhone" required>
          </div>
          <div class="col-md-8 mb-2">
            <label for="deliveryEmail" class="form-label">Email*</label>
            <input type="text" class="form-control" name="deliveryEmail" required>
          </div>
          <div class="col-md-12 mb-2">
            <label for="deliveryAddress" class="form-label">Address*</label>
            <input type="text" class="form-control" name="deliveryAddress" required>
          </div>
          <div class="col-md-12 mb-2">
            <label for="deliveryAddress2" class="form-label">Address 2</label>
            <input type="text" class="form-control" name="deliveryAddress2">
          </div>
          <div class="col-md-6 mb-2">
            <label for="deliveryCity" class="form-label">City*</label>
            <input type="text" class="form-control" name="deliveryCity" required>
          </div>
          <div class="col-md-4 mb-2">
            <label for="deliveryState" class="form-label">State*</label>
            <input type="text" class="form-control" name="deliveryState" required>
          </div>
          <div class="col-md-2 mb-2">
            <label for="deliveryZip" class="form-label">Zip*</label>
            <input type="text" class="form-control" name="deliveryZip" required>
          </div>

          <h2 class="mt-2">Billing Address</h2>
          <div class="col-12">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="billing" bind:checked={yes}>
              <label class="form-check-label" for="billing">
                Same as Shipping Address
              </label>
            </div>
          </div>
          {#if !yes}
            <div class="col-md-6 mb-2">
              <label for="billingFirstName" class="form-label">First Name*</label>
              <input type="text" class="form-control" name="billingFirstName" required>
            </div>
            <div class="col-md-6 mb-2">
              <label for="billingLastName" class="form-label">Last Name*</label>
              <input type="text" class="form-control" name="billingLastName" required>
            </div>
            <div class="col-md-4 mb-2">
              <label for="billingPhone" class="form-label">PhoneNumber*</label>
              <input type="text" class="form-control" name="billingPhone" required>
            </div>
            <div class="col-md-8 mb-2">
              <label for="billingEmail" class="form-label">Email*</label>
              <input type="text" class="form-control" name="billingEmail" required>
            </div>
            <div class="col-md-12 mb-2">
              <label for="billingAddress" class="form-label">Address*</label>
              <input type="text" class="form-control" name="billingAddress" required>
            </div>
            <div class="col-md-12 mb-2">
              <label for="billingAddress2" class="form-label">Address 2</label>
              <input type="text" class="form-control" name="billingAddress2">
            </div>
            <div class="col-md-6 mb-2">
              <label for="billingCity" class="form-label">City*</label>
              <input type="text" class="form-control" name="billingCity" required>
            </div>
            <div class="col-md-4 mb-2">
              <label for="billingState" class="form-label">State*</label>
              <input type="text" class="form-control" name="billingState" required>
            </div>
            <div class="col-md-2 mb-2">
              <label for="billingZip" class="form-label">Zip*</label>
              <input type="text" class="form-control" name="billingZip" required>
            </div>
          {/if}
        </div>
        
        <h2 class="mt-2">Payment Information</h2>
        <div class="mb-2" style="width: 500px;">
          <label for="cardName" class="form-label">Name on Card*</label>
          <input type="text" class="form-control" name="cardName" required>
        </div>
        <div class="mb-2" style="width: 500px;">
          <label for="cardNumber" class="form-label">Card Number*</label>
          <input type="text" class="form-control" name="cardNumber" required>
        </div>
        <div class="row mb-2" style="width: 500px;">
          <div class="col-md">
            <label for="cardDate" class="form-label">Valid Thru*</label>
            <input type="text" class="form-control" name="cardDate" required>
          </div>
          <div class="col-md">
            <label for="cardcvv" class="form-label">CVV*</label>
            <input type="text" class="form-control" name="cardcvv" required>
          </div>
        </div>
        <div>
          <button class="btn btn-primary mt-2" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </section>
</div>
</div>


<style>
</style>