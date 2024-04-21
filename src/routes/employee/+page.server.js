import { set_connection } from "$lib/legacydb.js";
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

function fetch_orders() {

    // What the fuck.
    return new Promise((resolve, reject) => {

        let database_instance = new sqlite.Database("./db/projectdb.sl3");
        database_instance.serialize(() => {
    
            let fetch_orders = `
                SELECT * FROM Purchase JOIN Customer ON Purchase.Customer_ID=Customer.ID;
            `;
    
            database_instance.all(fetch_orders, (error, data) => {
                if (error) console.log(error);
                return resolve(data);
            });
    
        });

    });

}

export async function load() {

    let orders = await fetch_orders();
    return {
        orders
    };

}