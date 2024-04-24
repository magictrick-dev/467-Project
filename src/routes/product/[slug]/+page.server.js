import { set_connection } from "$lib/legacydb.js";
import * as helpers from "$lib/helpers.js";
import { redirect } from '@sveltejs/kit';
 
export const actions = {
  default: async (request) => {

    // Carly Rae Jepsen kinda bops tho
    const form_data = await request.request.formData();

    const item_number = form_data.get("item");
    const item_qty = form_data.get("qty");

    // Reset.
    //request.cookies.delete("cart", {path: '/'});

    // Get the existing cart.
    let current_cart = request.cookies.get("cart");

    // Create a working cart.
    let cart_body = helpers.cart_body();

    if (!(current_cart == null || current_cart == ""))
    {
      let cookie_cart = JSON.parse(current_cart);
      cookie_cart.items.forEach((item) => {
        cart_body.items.push(item);
      })
    }

    let found = false;
    cart_body.items.forEach((element) => {
      if (element.item == item_number)
      {
        element.qty = Number(element.qty) + Number(item_qty);
        found = true;
      }
    });
    if (found == false)
    {
      cart_body.items.push({item: item_number, qty: Number(item_qty)});
    }


    let cookie_string = JSON.stringify(cart_body);
    console.log(cookie_string);
    request.cookies.set("cart", cookie_string, {path: '/'});
    redirect(301, "/cart");
    //request.cookies.set("cart", request.params.slug, { path: '/' });
    /*
    let cart_body = helpers.cart_body();

    
    if (current_cart != "")
    {
      let ccart = JSON.parse(current_cart);
      console.log("Existing cart is: ");
      console.log(ccart);
      ccart.items.forEach(element => {
        cart_body.items.push(element);
      });
    }

    cart_body.items.push(request.params.slug);

    request.cookies.set("cart", JSON.stringify(cart_body), { path: '/' });

    console.log(cart_body);
    */

  }
};

export async function load({ params }) {

  // Establish the connection.
  let connection = await set_connection();

  // Attempt a query.
  try {

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
  catch (error) {
    console.error("Unable to perform query!");
    console.log(error);
    return error;
  }


}