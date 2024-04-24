import * as helpers from "$lib/helpers.js";
import * as mailer from "$lib/mailer.js";
import * as ccp from "$lib/creditprocessor.js";
import { set_connection } from "$lib/legacydb.js";
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

function fetch_inventory(inventory_id)
{

  return new Promise((resolve, reject) => {
    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

        let fetch_orders = `SELECT * FROM Warehouse WHERE PartID = ${inventory_id}`;
  
        database_instance.all(fetch_orders, (error, data) => {
          if (error) console.log(error);
          return resolve(data);
      });

    });
  });

}

function add_customer(details)
{

    return new Promise((resolve, reject) => {
      let database_instance = new sqlite.Database("./db/projectdb.sl3");
      database_instance.serialize(() => {
  
          let fetch_orders = `
            INSERT INTO Customer (first_name, last_name, email, country, city, customer_state,
              postal_code, Address_line1, Address_line2) VALUES
              ('${details.first}', '${details.last}', '${details.email}', '${details.country}', '${details.city}',
              '${details.state}', '${details.zip}', '${details.addr1}', '${details.addr2}');
          `;
  
          console.log(fetch_orders);

          database_instance.run(fetch_orders, function () {
            mailer.send_invoice(details.email, details);
            resolve(this.lastID);
          });


      });
    });
}

function place_order(details)
{
        

  return new Promise((resolve, reject) => {
    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

        let fetch_orders = `
          INSERT INTO Purchase (transaction_ID, customer_ID, bracket_ID, authorization_code, order_status, DateAndTime, total) VALUES
              ('${details.transaction_id}', ${details.customer}, ${details.weight_id}, ${details.auth_code}, 'Processing', '${details.data}', '${details.total}');
        `;


        database_instance.run(fetch_orders, function () {
          resolve();
        });

        for (let i = 0; i < details.line_items.items.length; ++i)
        {
          let citem = details.line_items.items[i];
          let set_litem = `
          INSERT INTO LineItem (ID, part_number, quantity) VALUES
          ('${details.transaction_id}', ${citem.item.number}, ${citem.qty});
          `;
          database_instance.run(set_litem, function () {});

          // update warehouse
          let set_warehouse = `UPDATE Warehouse SET quantity = ${citem.wh - citem.qty} WHERE PartID = ${citem.item.number}`;
          database_instance.run(set_warehouse, function () {});
        }
        
        resolve();
        
    });
  });

}

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
        redirect(301, "/cart");
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

/*
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(60),
    country VARCHAR(50),
    city VARCHAR(50),
    customer_state VARCHAR(50),
    postal_code VARCHAR(10),
    Address_line1 VARCHAR(99),
    Address_line2 VARCHAR(99) 
*/
/*
FormData {
  [Symbol(state)]: [
    { name: 'weight_class', value: '1' },
    { name: 'deliveryFirstName', value: 'a' },
    { name: 'deliveryLastName', value: 'a' },
    { name: 'deliveryPhone', value: 'a' },
    { name: 'deliveryEmail', value: 'a' },
    { name: 'deliveryAddress', value: 'a' },
    { name: 'deliveryAddress2', value: 'a' },
    { name: 'deliveryCity', value: 'a' },
    { name: 'deliveryState', value: 'a' },
    { name: 'deliveryZip', value: 'a' },
    { name: 'billing', value: 'on' },
    { name: 'cardName', value: 'a' },
    { name: 'cardNumber', value: 'a' },
    { name: 'cardDate', value: 'a' },
    { name: 'cardcvv', value: 'a' }
  ]
}

{
  vendor: 'CAMR20-24',
  trans: '6d668382-6375-4c5d-ac60-1b0b01f5deb6',
  cc: '1234567812345678',
  name: 'Richard Enball',
  exp: '4/2027',
  amount: '193.30',
  errors: [ 'credit card number is invalid' ]
}
{
  vendor: 'CAMR20-24',
  trans: 'd5128468-a20d-4fac-a09b-13d0f62a5759',
  cc: '6011123443211234',
  name: 'Richard Enball',
  exp: '4/2029',
  amount: '193.30',
  brand: 'discover',
  authorization: '14666',
  timeStamp: 1713835636290,
  _id: '66270e74eaa56404ebb0dcda'
}
*/
    const form_data = await request.request.formData();
    //console.log(form_data);

    // Customer shit.
    let first_name    = form_data.get("deliveryFirstName");
    let last_name     = form_data.get("deliveryLastName");
    let email         = form_data.get("deliveryEmail");
    let country       = "USA";
    let city          = form_data.get("deliveryCity");
    let zipcode       = form_data.get("deliveryZip");
    let state         = form_data.get("deliveryState");
    let addr1         = form_data.get("deliveryAddress");
    let addr2         = form_data.get("deliveryAddress2");

    // Transaction shit.
    let card_name     = form_data.get("cardName");
    let card_number   = form_data.get("cardNumber");
    let card_date     = form_data.get("cardDate");
    let order_total   = form_data.get("order_total");
    let weight_class  = form_data.get("weight_class");

    // Get the existing cart.
    let current_cart = request.cookies.get("cart");
    if (!current_cart)
    {
      redirect(301, "/");
    }

    let cart_items = JSON.parse(current_cart);
    let order_status_result = await ccp.authorize(card_name, card_number, card_date, order_total);
    console.log(order_status_result.data);
    if (order_status_result.hasOwnProperty("errors"))
    {
      redirect(301, "/cart?error_" + order_status_result.errors[0]);
    }

    let transaction_id  = order_status_result.data.trans;
    let auth_id         = order_status_result.data.authorization;
    let order_time      = order_status_result.data.timeStamp;
    //console.log(order_status_result.data);
    
    let connection = await set_connection();

    // Okay, now, lets search for the products.
    let cart_data = { is_empty: false, items: [], weights: [] };
    for (let i = 0; i < cart_items.items.length; ++i)
    {
      let res = await connection
        .query(`SELECT * FROM parts WHERE number = '${cart_items.items[i].item}'`)
        .then(([rows, fields]) => { return rows; });

      let inventory = await fetch_inventory(cart_items.items[i].item);
      console.log(inventory);

      if (inventory.length != 1 || inventory[0].quantity < cart_items.items[i].qty)
        redirect(301, "/cart?noinventory_" + cart_items.items[i].item);

      cart_data.items.push({item: res[0], qty: cart_items.items[i].qty, wh: inventory[0].quantity });
    }
    cart_data.items.forEach(item => console.log(item));

    let customer_id = await add_customer({
      first: first_name,
      last: last_name,
      email: email,
      country: country,
      city: city,
      state: state,
      zip: zipcode,
      addr1: addr1,
      addr2: addr2,
      orderid: transaction_id,
      total: order_total,
      cart: cart_data,
    });

    await place_order({
      email: email,
      transaction_id: transaction_id,
      customer: customer_id,
      weight_id: weight_class,
      auth_code: auth_id,
      data: order_time,
      total: order_total,
      line_items: cart_data
    });

    request.cookies.delete("cart", { path: '/' });
    redirect(301, "/cart?ordersuccess");

  }
};