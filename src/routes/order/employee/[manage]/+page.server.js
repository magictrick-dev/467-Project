import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
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
  console.log(order_details);

	return {
		order: order_details
	};
}