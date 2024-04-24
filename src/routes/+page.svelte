<script>
  import * as helpers from "$lib/helpers.js";
  export let data;

  // For the pagination controls, we need to query the entire
  // legacy database, get the number of products, then calculate
  // how many pages total can be displayed based on how many products
  // we want to show. Then, we create a function that performs these
  // math-magics so that when we use the pagination controls, we don't
  // have to think too hard about it.
  let total_count = data.product_listing.length;

  let current_page = 0;
  let item_count = 12;
  let max_page = Math.floor(total_count / item_count) + 1;
  let selection;

  function set_page(number)
  {
    current_page = number;
    let start = (current_page * item_count);
    let end = (current_page * item_count) + item_count;
    selection = data.product_listing.slice(start, end);
  }

  set_page(0);

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Homepage" />
</svelte:head>

<div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img style="object-fit: cover; width: 100%" height="650px"
        src="https://hips.hearstapps.com/hmg-prod/images/2025-porsche-911-spied-front-658200b0a3a5d.jpg" class="d-block" alt="...">
    </div>
    <div class="carousel-item">
      <img style="object-fit: cover; width: 100%" height="650px"
        src="https://hips.hearstapps.com/hmg-prod/images/2022-ford-mustang-shelby-gt500-02-1636734552.jpg" class="d-block" alt="...">
    </div>
    <div class="carousel-item">
      <img style="object-fit: cover; width: 100%" height="650px"
        src="https://upload.wikimedia.org/wikipedia/commons/3/3d/2018-Chevrolet-Camaro-ZL1-1LE-001-01.jpg" class="d-block" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button id="prodtop" class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<div class="container-md">
  <div class="container-fluid bg-white mt-3 mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
  <div class="row row-cols-1 row-cols-md-3 g-4">
    {#each selection as product }
      <div class="col">
          <div class="card">
            <img src="{product.pictureURL}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">
                <a class="link-underline-opacity-0" 
                  href="/product/{product.number}">{helpers.to_pretty(product.description)}</a>
              </h5>
              <p>
                <strong>Product Weight:</strong> {product.weight} lbs.<br/>
                <strong>Product Price:</strong> ${product.price}
              </p>
            </div>
          </div>
      </div>
    {/each}

    <nav>
      <ul class="pagination">
        {#if current_page == 0}
          <li class="page-item disabled">
            <a class="page-link" href="#prodtop">Previous</a>
          </li>
        {:else}
          <li class="page-item">
            <a on:click={() => {set_page(current_page-1)}} class="page-link" href="#prodtop">Previous</a>
          </li>
        {/if}

        {#each {length: max_page } as _, i}
          {#if i == current_page}
          <li class="page-item active">
            <a on:click={() => {set_page(i)}} class="page-link" href="#prodtop">{i + 1}</a>
          </li>
          {:else}
          <li class="page-item">
            <a on:click={() => {set_page(i)}} class="page-link" href="#prodtop">{i + 1}</a>
          </li>
          {/if}
        {/each}

        {#if current_page == max_page - 1}
          <li class="page-item disabled">
            <a class="page-link" href="#prodtop">Next</a>
          </li>
        {:else}
        <li class="page-item">
          <a on:click={() => {set_page(current_page+1)}} class="page-link" href="#prodtop">Next</a>
        </li>
        {/if}
      </ul>
    </nav>
    
  </div>
</div>
</div>

<style>
  .row {
    margin-top:     20px;
    margin-bottom:  20px;
  }
</style>
