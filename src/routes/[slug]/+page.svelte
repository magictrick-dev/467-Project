<script>
  export let data;

  function addItem(){
    //add item to cart
  }
</script>

<svelte:head>
	<title>{data.post.slug}</title>
	<meta name="description" content="{data.post.slug}" />
</svelte:head>

<section>
  <div class="row row-cols-1 row-cols-md-3 p-2">
    <div class="col">
      <img src="../test.jpg" class="object-fit-contain border rounded" width="100%;" alt="..."></div>
    <div class="col">
      <h1>{data.post.title}</h1>
    </div>
    <div class="col text-break">
      {@html data.post.content}
    </div>
  </div>
  <div class="d-flex justify-content-end p-2">
    <button class="btn btn-secondary" on:click={addItem}>Add to Cart</button>
  </div>
</section>

<style>
</style>
