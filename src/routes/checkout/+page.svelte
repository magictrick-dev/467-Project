<script>
  let products = [1, 2, 3, 4];
  let amount = [2, 5, 1, 3];
  let cost = [4.00, 2.99, 4.50, 5.00];
  let subtotal = 0;
  let shipping = 0;
  let yes = false;

  function calcSubtotal() {
    subtotal = 0;
    for(let i in products) {
      subtotal += amount[i]*cost[i];
    }
    return subtotal;
  }

  function calcShipping() {
    shipping = 0;
    shipping++; // temp
    // get weight cost
    return shipping;
  }

  function onSubmit() {
    alert("Payment Confirmed");
  };

  calcSubtotal();
  calcShipping();
</script>

<svelte:head>
	<title>Checkout</title>
	<meta name="description" content="Checkout" />
</svelte:head>

<section>
  <div class="container bd-gutter my-3 bd-layout">
    <ul class="list-group p-2">
      {#each products as _, i}
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div class="p-1">
              {products[i]}
              <p>
                Amount: {amount[i]}
              </p>
            </div>
            ${(cost[i]*amount[i]).toFixed(2)}
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
  </div>
</section>

<section>
  <div class="container bd-gutter my-3 bd-layout">
    <form class="was-validated p-2" novalidate="" on:submit|preventDefault={onSubmit}>
      <h2>Shipping Address</h2>
      <div class="row" style="width: 600px;">
        <div class="col-md-6 mb-2">
          <label for="deliveryFirstName" class="form-label">First Name*</label>
          <input type="text" class="form-control" id="deliveryFirstName" required>
        </div>
        <div class="col-md-6 mb-2">
          <label for="deliveryLastName" class="form-label">Last Name*</label>
          <input type="text" class="form-control" id="deliveryLastName" required>
        </div>
        <div class="col-md-4 mb-2">
          <label for="deliveryPhone" class="form-label">PhoneNumber*</label>
          <input type="text" class="form-control" id="deliveryPhone" required>
        </div>
        <div class="col-md-8 mb-2">
          <label for="deliveryEmail" class="form-label">Email*</label>
          <input type="text" class="form-control" id="deliveryEmail" required>
        </div>
        <div class="col-md-12 mb-2">
          <label for="deliveryAddress" class="form-label">Address*</label>
          <input type="text" class="form-control" id="deliveryAddress" required>
        </div>
        <div class="col-md-12 mb-2">
          <label for="deliveryAddress2" class="form-label">Address 2</label>
          <input type="text" class="form-control" id="deliveryAddress2">
        </div>
        <div class="col-md-6 mb-2">
          <label for="deliveryCity" class="form-label">City*</label>
          <input type="text" class="form-control" id="deliveryCity" required>
        </div>
        <div class="col-md-4 mb-2">
          <label for="deliveryState" class="form-label">State*</label>
          <input type="text" class="form-control" id="deliveryState" required>
        </div>
        <div class="col-md-2 mb-2">
          <label for="deliveryZip" class="form-label">Zip*</label>
          <input type="text" class="form-control" id="deliveryZip" required>
        </div>

        <h2 class="mt-2">Billing Address</h2>
        <div class="col-12">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="billing" bind:checked={yes}>
            <label class="form-check-label" for="billing">
              Same as Shipping Address
            </label>
          </div>
        </div>
        {#if !yes}
          <div class="col-md-6 mb-2">
            <label for="billingFirstName" class="form-label">First Name*</label>
            <input type="text" class="form-control" id="billingFirstName" required>
          </div>
          <div class="col-md-6 mb-2">
            <label for="billingLastName" class="form-label">Last Name*</label>
            <input type="text" class="form-control" id="billingLastName" required>
          </div>
          <div class="col-md-4 mb-2">
            <label for="billingPhone" class="form-label">PhoneNumber*</label>
            <input type="text" class="form-control" id="billingPhone" required>
          </div>
          <div class="col-md-8 mb-2">
            <label for="billingEmail" class="form-label">Email*</label>
            <input type="text" class="form-control" id="billingEmail" required>
          </div>
          <div class="col-md-12 mb-2">
            <label for="billingAddress" class="form-label">Address*</label>
            <input type="text" class="form-control" id="billingAddress" required>
          </div>
          <div class="col-md-12 mb-2">
            <label for="billingAddress2" class="form-label">Address 2</label>
            <input type="text" class="form-control" id="billingAddress2">
          </div>
          <div class="col-md-6 mb-2">
            <label for="billingCity" class="form-label">City*</label>
            <input type="text" class="form-control" id="billingCity" required>
          </div>
          <div class="col-md-4 mb-2">
            <label for="billingState" class="form-label">State*</label>
            <input type="text" class="form-control" id="billingState" required>
          </div>
          <div class="col-md-2 mb-2">
            <label for="billingZip" class="form-label">Zip*</label>
            <input type="text" class="form-control" id="billingZip" required>
          </div>
        {/if}
      </div>
      
      <h2 class="mt-2">Payment Information</h2>
      <div class="mb-2" style="width: 500px;">
        <label for="cardName" class="form-label">Name on Card*</label>
        <input type="text" class="form-control" id="cardName" required>
      </div>
      <div class="mb-2" style="width: 500px;">
        <label for="cardNumber" class="form-label">Card Number*</label>
        <input type="text" class="form-control" id="cardNumber" required>
      </div>
      <div class="row mb-2" style="width: 500px;">
        <div class="col-md">
          <label for="cardDate" class="form-label">Valid Thru*</label>
          <input type="text" class="form-control" id="cardDate" required>
        </div>
        <div class="col-md">
          <label for="cardcvv" class="form-label">CVV*</label>
          <input type="text" class="form-control" id="cardcvv" required>
        </div>
      </div>
      <div>
        <button class="btn btn-primary mt-2" type="submit">Submit</button>
      </div>
    </form>
  </div>
</section>

<style>
</style>