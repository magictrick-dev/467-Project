import * as helpers from "$lib/helpers.js";
import { set_connection } from "$lib/legacydb.js";
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

function fetch_weights() {

  // What the fuck.
  return new Promise((resolve, reject) => {

      let database_instance = new sqlite.Database("./db/projectdb.sl3");
      database_instance.serialize(() => {
  
          let fetch_orders = `
              SELECT * FROM WeightTable;
          `;
  
          database_instance.all(fetch_orders, (error, data) => {
              if (error) console.log(error);
              return resolve(data);
          });
  
      });

  });

}

export async function load({ cookies }) {
  
      // Get the existing cart.
      let current_cart = cookies.get("cart");

      let cart_items = helpers.cart_body();
      if (current_cart != null)
      {
        cart_items = JSON.parse(current_cart);
      }
      else
      {
        return { is_empty: true };
      }

      // Establish the connection.
      let connection = await set_connection();

      // Attempt a query.
      try
      {
          
          // Some magic happens here, idk.


          // Okay, now, lets search for the products.
          let cart_data = { is_empty: false, items: [], weights: [] };
          for (let i = 0; i < cart_items.items.length; ++i)
          {
            let res = await connection
              .query(`SELECT * FROM parts WHERE number = '${cart_items.items[i].item}'`)
              .then(([rows, fields]) => { return rows; });
            cart_data.items.push({item: res[0], qty: cart_items.items[i].qty });
          }

          let weight_brackets = await fetch_weights();
          cart_data.weights = weight_brackets;

          return cart_data;

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
  ordersend: async (request) => {
    const form_data = await request.request.formData();
    console.log(form_data);

    // Get the existing cart.
    let current_cart = request.cookies.get("cart");
    if ((current_cart == null || current_cart == ""))
    {
      redirect(301, "/");
    }

    let cart = JSON.parse(current_cart);
    console.log(cart);

  }
};