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
import pdfkit       from 'pdfkit';

const test_database = null;
const port          = 9001;
const app           = express();

// --- CORS --------------------------------------------------------------------

app.use(cors()); // Required for cross-origin resource sharing support.

// --- Async API Definitions ---------------------------------------------------
//
// The first endpoint is a test-endpoint example that can be referenced to create
// new endpoints. The following two endpoints simply generate PDFs which get sent
// to the user.
//

app.get('/api/:endpoint', (request, response) => {

    // API endpoint definition.
    response.json({ "endpoint": `${ request.params.endpoint }` });

});

app.get('/api/invoice/:iid', (request, response) => {

    let invoice_document = new pdfkit;
    invoice_document.text(`Here is the invoice: ${request.params.iid}`, 100, 100);
    
    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=invoice.pdf',
    });

    invoice_document.pipe(response);
    invoice_document.end();

});

app.get('/api/packlist/:pid', (request, response) => {

    let packlist_document = new pdfkit;
    packlist_document.text(`Here is the packlist: ${request.params.pid}`, 100, 100);
    
    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=packing_list.pdf',
    });

    packlist_document.pipe(response);
    packlist_document.end();

});

app.get('/api/shiplabel/:slabel', (request, response) => {

    // The shipping label is of size-A9.
    let shiplabel = new pdfkit({ size: 'A9' });
    shiplabel.text(`Here is the shipping label: ${request.params.slabel}`, 100, 100);
    
    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=shipping_label.pdf',
    });

    shiplabel.pipe(response);
    shiplabel.end();

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
