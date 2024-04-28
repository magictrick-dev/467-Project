import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { set_connection } from "$lib/legacydb.js";
const sqlite = sqlite3.verbose();

async function fetch_parts()
{

  let connection = await set_connection();
  let res = await connection
  .query(`SELECT * FROM parts;`)
  .then(([rows, fields]) => { return rows; });
  return res;

}

async function warehouse_query(id)
{

  return new Promise((resolve, reject) => {

    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

      let fetch_full_order = `
      SELECT * FROM Warehouse WHERE PartID = '${id}';
      `;
  
      database_instance.all(fetch_full_order, (error, data) => {
        if (error) console.log(error);
        return resolve(data);
      });

    });

  });

}

export async function load({ params }) {

  let parts = await fetch_parts();

  let warehouse_data = [];
  for (let i = 0; i < parts.length; ++i)
  {
    
    let whr = await warehouse_query(parts[i].number);

    let avail = 0;
    let set = false;
    if (whr.length == 1)
    {
      avail = whr[0].quantity;
      set = true;
    }

    warehouse_data.push({
      item: parts[i],
      qty: avail,
      set: set,
      img: parts[i].pictureURL,
    });

  }

  //console.log(warehouse_data);
  return {
    parts: warehouse_data,
  }

}

async function warehouse_update(id, qty)
{

  let original = await warehouse_query(id);
  let add = (original.length == 0);
  let query;
  if (add)
  {
    query = `INSERT INTO Warehouse (PartID, quantity) VALUES
      (${id}, ${qty});`
  }
  else
  {
    query = `UPDATE Warehouse SET quantity = 
      ${qty} WHERE PartID = ${id};`;
  }

  return new Promise((resolve, reject) => {
    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {
        database_instance.run(query, function() {
          resolve();
        });
    });
  });

}

export const actions = {
  update: async (request) => {
    const form_data = await request.request.formData();
    const id = form_data.get("id");
    const adjust = form_data.get("qty");
    if (adjust < 0)
      redirect(301, "/warehouse?nonegative");
    await warehouse_update(id, adjust);

  },
}