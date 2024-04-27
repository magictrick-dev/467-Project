import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { set_connection } from "$lib/legacydb.js";
const sqlite = sqlite3.verbose();

async function weights_query()
{

  return new Promise((resolve, reject) => {

    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

      let fetch_full_order = `SELECT * FROM WeightTable;`;
  
      database_instance.all(fetch_full_order, (error, data) => {
        if (error) console.log(error);
        return resolve(data);
      });

    });

  });

}

async function update_weights(weights)
{
  return new Promise((resolve, reject) => {

    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

      let delete_all = `DELETE FROM WeightTable;` // nuclear option lmfao
      let reinsert = `INSERT INTO WeightTable (ID, weight_maximum, price) VALUES `
      let index_start = 1;
      for (let i = 0; i < weights.length; ++i)
      {
        reinsert += `(${index_start++}, ${weights[i].weight}, ${weights[i].price})`;
        if (i < weights.length - 1)
          reinsert += `,`;
      }
      reinsert += `;`;
      
      database_instance.run(delete_all, (error) => {
        if (error) console.log(error);
      });

      database_instance.run(reinsert, (error) => {
        if (error) console.log(error);
        resolve();
      });

    });

  })
}

function sort_weights(weights)
{
  weights.sort((a, b) => {
    return (a.weight - b.weight);
  })
}

export async function load({ params }) {

  let results = await weights_query();
  console.log(results);

  let weights = [];
  results.forEach((res) => {
    weights.push({weight: res.weight_maximum, price: res.price, id: res.ID});
  });

  sort_weights(weights);

  return {
    weight_table: weights,
  }

}


export const actions = {
  updateWeights: async (request) => {
    const form_data = await request.request.formData();
    const weights = form_data.getAll("weight");
    const prices = form_data.getAll("price");

    let w = [];
    for (let i = 0; i < weights.length; ++i)
    {
      w.push({weight: weights[i], price: prices[i]});
    }

    sort_weights(w);
    await update_weights(w);
    redirect(301, "/administration");
  },
}