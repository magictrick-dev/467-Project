import { set_connection } from "$lib/legacydb.js";
import { setContext } from "svelte";

export async function load() {

/*
	return {
		summaries: products.map((product) => ({
			slug: product.slug,
			title: product.title,
			description: product.content
		}))
	};
*/

    // Establish the connection.
    let connection = await set_connection();

    // Attempt a query.
    try
    {
        
        // Some magic happens here, idk.
        let results = await connection
            .query("SELECT * FROM parts")
            .then(([rows, fields]) => { return rows; });

		//console.log(results);

        // Send the data back.
        return {
			product_listing: results
		}

    }

    // Query failed, shoot out the error.
    catch(error)
    {
        console.error("Unable to perform query!");
        console.log(error);
        return error;
    }


}

export const actions = {
  default: async (request) => {
    const form_data = await request.request.formData();
    const filter = form_data.get("filter");
    return {
        query: filter,
    }
  }
}