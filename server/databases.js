// --- Database Manager ---------------------------------------------------------------------------
// 
// The database manager file contains the methods needed to quickly reset the
// internal databases to a known state, as well as instantiate them to certain
// specifications should they need to be. This is primarily for testing and isn't
// a production-side API.
//

import fs from 'node:fs';
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

// --- Database Lists -----------------------------------------------------------------------------
//
// The list of databases corresponds to all the working databases we have. This
// is only for the URL calls and shouldn't be used for production-level checks.
//

// --- Database Reset Functions -------------------------------------------------------------------
//
// These reset functions delete and reset with known data. Yes, they're the
// explosive "oops, I fucked the database and need to fix it" functions.
//

// --- Test Database -----------------------------------------------------------

function database_construct_test(error, db_instance)
{

    if (error)
    {
        console.log(error);
        return;
    }

    console.log("Constructing test.");

    // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144
    db_instance.run("CREATE TABLE fibonacci (id INT NOT NULL PRIMARY KEY, fib INT NOT NULL)", (error) => {

        if (error)
        {
            console.log(error);
            return;
        }

        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 0,   0)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 1,   1)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 2,   1)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 3,   2)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 4,   3)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 5,   5)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 6,   8)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 7,  13)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 8,  21)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES ( 9,  34)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES (10,  55)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES (11,  89)");
        db_instance.run("INSERT INTO fibonacci (id, fib) VALUES (12, 144)");

    });

}

function database_reset_test()
{

    console.log("Initiating reset on the test database.");

    // Delete the old database.
    fs.unlink("./db/sqlite3_test_db.sqlitedb", () => {

        // Once we create the database, the callback will construct the test database.
        let database_instance = new sqlite.Database("./db/sqlite3_test_db.sqlitedb",
            (error) => database_construct_test(error, database_instance));

    });

}

// --- Example Database Reset --------------------------------------------------

function database_construct_example(db_instance)
{

    console.log("Constructing example.");

}

function database_reset_example()
{

    console.log("Initiating reset on the example database.");
    let database_instance = new sqlite.Database("./db/sqlite3_example_db.sqlitedb", sqlite.OPEN_CREATE,
        () => database_construct_example(database_instance));

}

// This nonsense is why Javascript is not a good language, but it is the cleanest
// way to do this that isn't packing this garbage into an ES6 class (which actually
// wouldn't be the worst idea imaginable since there is so much data-coupling going
// on here).

var database_list = [
    {
        database_name: "test",
        database_schema_name: "sqlite3_test_db",
        database_instance: null,
        database_reset: database_reset_test,
    },
    {
        database_name: "example",
        database_schema_name: "sqlite3_example_db",
        database_instance: null,
        database_reset: database_reset_example,
    },
];

function database_list_find(database_name)
{

    for (const index in database_list)
    {
        let dbi = database_list[index];
        if (dbi.database_name == database_name)
            return dbi;
    }

    return null;

}


// --- Exports ------------------------------------------------------------------------------------
//
// This packs our reset commands in a nice little object.
//

let database_utils = {
    find: database_list_find,
    list: database_list,
};

export default { sqlite, database_utils };
