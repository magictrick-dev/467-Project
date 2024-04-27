import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { set_connection } from "$lib/legacydb.js";
const sqlite = sqlite3.verbose();

function remove_weight_bracket(id)
{
  return new Promise((resolve, reject) => {

    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {

      let statement = `DELETE FROM WeightTable WHERE ID='${id}';`
      console.log(statement);
      database_instance.run(statement, (error) => {
        if (error) console.log(error);
        resolve();
      })

    });

  })
}

export async function load({ params }) {

  let remove_id = params.remove;
  console.log(remove_id);
  await remove_weight_bracket(remove_id);
  redirect(301, "/");

}
