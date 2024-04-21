<script>
  import * as helpers from "$lib/helpers.js";
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  export let data;

    function sortTable(n, sort_type = 0) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("sortable");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            console.log(rows);
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            console.log(x);
            console.log(y);
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (sort_type == 1)
                {
                    if (Number(x.innerHTML.toLowerCase()) > Number(y.innerHTML.toLowerCase())) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                    }
                }
                if (sort_type == 0)
                {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                    }
                }
            } else if (dir == "desc") {
                if (sort_type == 1)
                {
                    if (Number(x.innerHTML.toLowerCase()) < Number(y.innerHTML.toLowerCase())) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                    }
                }
                if (sort_type == 0)
                {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                    }
                }
            }
            }
            if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
            } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
            }
        }
    }

</script>

<div class="container-md mt-3">
    <div class="container-fluid bg-white mb-3" style="border-radius: 12px; padding-top: 10px; padding-bottom: 10px">
      <h3>Order Detail Inspection</h3><br/>
      <table id="sortable" class="table table-hover">
        <thead>
          <tr>
            <th class="colsort" on:click={() => {sortTable(0, 1); }} scope="col">Customer ID</th>
            <th scope="col">Transaction ID</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th class="colsort" on:click={() => {sortTable(4, 1); }} scope="col">Total Sale</th>
            <th class="colsort" on:click={() => {sortTable(5); }} scope="col">Order Status</th>
            <th class="colsort" hidden on:click={() => {sortTable(6, 1); }} scope="col">Timestamp</th>
            <th class="colsort" on:click={() => {sortTable(6, 1); }} scope="col">Date</th>
            <th scope="col">Address Detail</th>
          </tr>
        </thead>
        <tbody>
          {#each data.orders as order_detail}
            <tr on:click={() => { goto(`/order/employee/${order_detail.transaction_ID}`); }}>
                <td>{order_detail.customer_ID}</td>
                <td>{order_detail.transaction_ID}</td>
                <td>{order_detail.first_name}</td>
                <td>{order_detail.last_name}</td>
                <td>{order_detail.total}</td>
                <td>{order_detail.order_status}</td>
                <td hidden>{order_detail.DateAndTime}</td>
                <td>{helpers.unix_to_time(order_detail.DateAndTime)}</td>
                <td>
                    {order_detail.Address_line1} <br/>
                    {order_detail.Address_line2} <br/>
                    {order_detail.country}, {order_detail.city}, {order_detail.postal_code} <br/>
                </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
</div>

<style>
    .table-hover tbody tr
    {
        cursor: pointer
    }
    .colsort
    {
        cursor: pointer;
        text-decoration: underline;
    }
    .colsort:hover
    {
        color: gray;
        transition: 275ms ease;
    }
</style>