<script>
  export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Homepage" />
</svelte:head>

<section>
  <div class="row row-cols-1 row-cols-md-3 g-4">
    {#each data.summaries as { slug, title, description }, num}
      <div class="col">
        <a href="/{slug}">
          <div class="card">
            <img src="./test.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{title}</h5>
              <p class="card-text text-truncate">{description}</p>
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>

<style>
  .row {
    margin: 20px;
  }
</style>
