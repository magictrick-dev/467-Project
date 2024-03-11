// --- Legacy Connection Driver API ------------------------------------
//
// This is the driver for loading the legacy database on svelte pages.
// You need only to call set_connection which will properly configure
// the MySQL connection.
//

import mysql from 'mysql2/promise';
let database_connection = null;

export function
set_connection()
{

    // If we already have the connection, exit.
    if (database_connection != null)
        return;

    // Otherwise, create the connection.
    database_connection = mysql.createConnection({
        host: "blitz.cs.niu.edu",
        port: "3306",
        database: "csci467",
        user: "student",
        password: "student",
    });

    return database_connection;

}


