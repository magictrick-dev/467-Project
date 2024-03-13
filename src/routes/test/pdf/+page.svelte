<script>
    export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Homepage" />
</svelte:head>

<section>
    <p>This is the PDF page.</p>
    <p>{JSON.stringify(data.data)}</p>
</section>

<style>
</style>


