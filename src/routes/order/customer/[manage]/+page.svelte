<script>
  export let data;
  let context_details = data.order[0];

  let status = context_details.order_status;
  let invoice_path = "/api/invoice/" + context_details.transaction_ID;
  let packlist_path = "/api/packlist/" + context_details.transaction_ID;
  let shiplabel_path = "/api/shiplabel/" + context_details.transaction_ID;
</script>

<svelte:head>
	<title>Customer Order Details</title>
</svelte:head>

<div class="container-md">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
    <div class="row">
      <section>
        <h1>Order Information</h1>
        <strong>Order ID: </strong>{context_details.transaction_ID}<br/>
        <strong>Name: </strong>{context_details.first_name + " " + context_details.last_name}<br/>
        <strong>Email: </strong>{context_details.email}<br/>
        <strong>Address Line 1: </strong>{context_details.Address_line1}<br/>
        <strong>Address Line 2: </strong>{context_details.Address_line2}<br/>
        <strong>City: </strong>{context_details.city}<br/>
        <strong>State: </strong>{context_details.customer_state}<br/>
        <strong>Country: </strong>{context_details.country}<br/>
        <strong>ZIP: </strong>{context_details.postal_code}<br/>
        {#if status == "Processing"}
          <div class="position-relative m-4">
            <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height: 1px;">
              <div class="progress-bar" style="width: 0%"></div>
            </div>
            <button type="button" class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">1</button>
            <button type="button" class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill" style="width: 2rem; height:2rem;">2</button>
            <button type="button" class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill" style="width: 2rem; height:2rem;">3</button>
          </div>
        {:else if status == "Completed"}
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
            <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="height: 1px;">
              <div class="progress-bar" style="width: 100%"></div>
            </div>
            <button type="button" class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">1</button>
            <button type="button" class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">2</button>
            <button type="button" class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-primary rounded-pill" style="width: 2rem; height:2rem;">3</button>
          </div>
        {/if}
        <div class="position-relative m-5 py-2">
          <div class="position-absolute translate-middle">
            Processing
          </div>
          <div class="position-absolute start-50 translate-middle">
            Completed & Shipped
          </div>
          <div class="position-absolute start-100 translate-middle">
            Delivered
          </div>
        </div>
      </section>
      
      <section>
        <h3>Order Line Items</h3>
        <ul class="list-group p-2">
          {#each data.order as item}
            <li class="list-group-item">
              <div class="d-flex justify-content-between">
                <div class="p-1">
                  Part Number: {item.part_number}
                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            </li>
          {/each}
        </ul>
        <div class="d-flex justify-content-end">
          <div class="d-flex justify-content-between" style="width: 300px;">
            <div class="p-2">Total Charges:</div>
            <div class="p-2">${context_details.total}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>


<style>
    .form-inline {
    flex-direction: column;
    align-items: stretch;
    display: inline;
  }
</style>
