import { set_connection } from "$lib/legacydb.js";

// --- MySQL Legacy DB Connection ------------------------------------------
//
// This is a working example of connecting to the legact database and fetching
// a query from it. The process is pretty easy, just make sure to set the
// connection details properly and it should just work.
//

// This will properly load everything on the pag
export async function
load()
{

    // Establish the connection.
    let connection = await set_connection();

    // Attempt a query.
    try
    {
        
        // Some magic happens here, idk.
        let results = await connection
            .query("SELECT * FROM parts")
            .then(([rows, fields]) => { return rows; });

        // Send the data back.
        return {
            data: results,
        }

    }

    // Query failed, shoot out the error.
    catch(error)
    {
        console.error("Unable to perform query!");
        console.log(error);
        return error;
    }

}

