<script>
  import { goto } from '$app/navigation';
  export let weight;
  export let price;
  export let id;

  function remove_row(id)
  {
    goto(`/administration/${id}`);
  }

</script>
<div class="input-group mb-2">
  <span class="input-group-text">Bracket ID #{id}</span>
  <span class="input-group-text">lbs.</span>
  <input type="number" name="weight" value="{weight}" class="form-control"/>
  <span class="input-group-text">$</span>
  <input type="text" name="price" value="{price}" class="form-control"/>
  <button class="btn btn-outline-secondary" on:click={() => remove_row(id)} type="button">Remove</button>
</div>