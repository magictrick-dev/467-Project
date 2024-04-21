import { set_connection } from "$lib/legacydb.js";

export async function load({ params }) {

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
            .query(`SELECT * FROM parts WHERE number = '${params.slug}'`)
            .then(([rows, fields]) => { return rows; });

		//console.log(results);

        // Send the data back.
        return {
			product_listing: results[0]
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