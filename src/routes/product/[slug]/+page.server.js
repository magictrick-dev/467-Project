import { set_connection } from "$lib/legacydb.js";
import * as helpers from "$lib/helpers.js";

export const actions = {
	default: async (request) => {
		console.log(request.params);
        let current_cart = request.cookies.get("cart");
        let cart_body = helpers.cart_body();
	}
};

export async function load({ params }) {

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