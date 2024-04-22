<script>
  import * as helpers from "$lib/helpers.js";
  export let data;

  function addItem(){
    //add item to cart
  }
</script>

<svelte:head>
	<title>Product Listing</title>
	<meta name="description" content="Product listing" />
</svelte:head>

<div class="container-md mt-3">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
  <section>
    <div class="row">
      <div class="col-3">
        <img src="{data.product_listing.pictureURL}" class="object-fit-contain border rounded"
          width="100%" alt="..." />
      </div>
      <div class="col-9 text-start">
        <h1>{helpers.to_pretty(data.product_listing.description)}</h1>
        <strong>Price:</strong> ${data.product_listing.price} <br/>
        <strong>Weight:</strong> ${data.product_listing.weight} <br/>
        <strong>Product Identifier:</strong> {data.product_listing.number} <br/>
      </div>
    </div>
    <div class="d-flex justify-content-end p-2">
      <form method="POST">
        <div class="input-group mb-3">
          <input type="number" min="1" class="form-control" placeholder="Quantity" value="1" name="qty">
          <button class="btn btn-secondary" type="cart" name="item" value="{data.product_listing.number}" id="button-addon1">Add to Cart</button>
        </div>
      </form>
    </div>
  </section>
</div>
</div>

<style>
</style>
