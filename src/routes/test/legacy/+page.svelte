<script>  
    export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Homepage" />
</svelte:head>

<section>
    {#each data.data as row}
        <p>{JSON.stringify(row)}</p>
    {/each}
</section>

<style>
</style>
