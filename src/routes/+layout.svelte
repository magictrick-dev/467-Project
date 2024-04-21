<script>
  import Navbar from "$lib/components/navigation.svelte";
  import Footer from "$lib/components/footer.svelte";
</script>

<Navbar />

<div style="min-height:75vh; background-color:rgba(245,245,245,1.0);">
  <slot />
</div>

<Footer />