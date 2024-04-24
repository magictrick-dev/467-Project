import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { set_connection } from "$lib/legacydb.js";
import * as mailer from "$lib/mailer.js";
import { send_confirmation } from '../../../../lib/mailer';
const sqlite = sqlite3.verbose();

function fetch_order(id)
{

  return new Promise((resolve, reject) => {

      let database_instance = new sqlite.Database("./db/projectdb.sl3");
      database_instance.serialize(() => {

        let fetch_full_order = `
        SELECT * FROM LineItem
          JOIN Purchase ON Purchase.transaction_ID = LineItem.ID
          JOIN Customer ON Purchase.Customer_ID = Customer.ID
          WHERE LineItem.ID = '${id}';
        `;
    
        database_instance.all(fetch_full_order, (error, data) => {
          if (error) console.log(error);
          return resolve(data);
      });

    });


  });

}

export async function load({ params }) {

  let order_details = await fetch_order(params.manage);
  //console.log(order_details);

	return {
		order: order_details
	};
}

async function set_status(id, status)
{
  let statement = `UPDATE Purchase SET order_status = '${status}' WHERE transaction_ID = '${id}';`
  //console.log(statement);
  return new Promise((resolve, reject) => {
    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {
      database_instance.run(statement, function () {
        resolve();
      });
    });
  }); 
}

async function send_email(id)
{
  let order_details = await fetch_order(id);
  //console.log(order_details);

  let cart_data = { is_empty: false, items: [], weights: [] };
  let connection = await set_connection();
  for (let i = 0; i < order_details.length; ++i)
  {
    let res = await connection
    .query(`SELECT * FROM parts WHERE number = '${order_details.part_number}'`)
    .then(([rows, fields]) => { return rows; });
    cart_data.items.push({
      item: res,
      qty: order_details.quantity,
    })
  }

  let details = {
    first: order_details[0].first_name,
    last: order_details[0].last_name,
    email: order_details[0].email,
    country: order_details[0].country,
    city: order_details[0].city,
    state: order_details[0].customer_state,
    zip: order_details[0].postal_code,
    addr1: order_details[0].Address_line1,
    addr2: order_details[0].Address_line2,
    orderid: id,
    total: order_details[0].total,
    cart: cart_data,
  }

  // Whoops, someone got an email.......
  if (order_details[0].email == "magiktrikdev@gmail.com")
    send_confirmation(order_details[0].email, details);
  else
    console.log("Not emailing...");

}

export const actions = {
  shipped: async (request) => {
    const form_data = await request.request.formData();
    const id = form_data.get("id");
    await set_status(id, "Completed");
    await send_email(id)
  },
  delivered: async (request) => {
    const form_data = await request.request.formData();
    const id = form_data.get("id");
    await set_status(id, "Delivered");
  },
  reset: async (request) => {
    const form_data = await request.request.formData();
    const id = form_data.get("id");
    await set_status(id, "Processing");
  }
}