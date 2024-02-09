// --- CSCI 467 Express Server -------------------------------------------------
//
// Express serves as the core server for the tech stack, though it offloads most
// of the work back to SvelteKit since it handles routing and server-side parsing.
// Generally, databasing won't occur here, since SvelteKit allows us to create
// server-side renderable components that essentially feed back dynamic data to
// the user. Express gives us a way to expose a *public* API that users can see.
//

import express      from 'express';
import cors         from 'cors';
import { handler }  from './build/handler.js';
import dbman        from './server/databases.js';

const test_database = null;
const port          = 9001;
const app           = express();

// --- CORS --------------------------------------------------------------------

app.use(cors()); // Required for cross-origin resource sharing support.

// --- Async API Definitions ---------------------------------------------------

app.get('/api/:endpoint', (request, response) => {

    // API endpoint definition.
    response.json({ "endpoint": `${ request.params.endpoint }` });

});

// --- Database Modification API -----------------------------------------------
//
// For doing that wack-type shit.
//

app.get('/database/:command/:on', (request, response) => {

    // We can pull the command from the params object.
    let command_type    = request.params.command;
    let command_sub     = request.params.on;

    // In case we don't know what we're doing, here is nifty little guide.
    if (command_type == "help")
    {
        let help_dialogue = "";
        help_dialogue += `<p><strong>Database Rebuild</strong> /database/rebuild/db_name</p>`;
        help_dialogue += `<p><i>Reconstructs the databases back to the defaults.</i></p>`;

        help_dialogue += `<p><strong>Database Rebuild</strong> /database/rebuild/db_name</p>`;
        help_dialogue += `<p><i>Reconstructs the databases back to the defaults.</i></p>`;
    }

    // If the command is a reset command, then we can process it here.
    if (command_type == "reset")
    {
        
        let dbi = dbman.database_utils.find(command_sub);
        if (dbi != null) dbi.database_reset();

    }

});

// Basically hands off the server-side routing back SvelteKit.
app.use(handler);

// You know what it do.
app.listen(port, () => {
    console.log("Server is running on localhost:" + port);
});
