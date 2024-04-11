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

    // Set up company information.
    const companyInfo = {
        name: "Chris' Private Parts",
        address: "123 Main Street, Cityville, State, Zip",
        phone: "123-456-7890",
        email: "info@chrisprivateparts.com"
    };

    // Set up customer information (you can fetch this from the database or request parameters).
    const customerInfo = {
        name: "Customer Name",
        address: "456 Elm Street, Townsville, State, Zip",
        email: "customer@example.com"
    };

    // Set up invoice details (from cart information on the database and part information from Legacy).
    const invoiceDetails = {
        id: request.params.iid,
        date: new Date().toLocaleDateString('en-US'),
        items: [
            { description: "Product 1", quantity: 1, price: 50 },
            { description: "Product 2", quantity: 2, price: 25 },
            // Add more items as needed.
        ]
    };

    // Add content to the PDF.
    invoice_document.font('Helvetica-Bold')
        .fontSize(18)
        .text('Invoice', { align: 'center' })
        .moveDown();

    // Company information.
    invoice_document.font('Helvetica')
        .fontSize(12)
        .text(companyInfo.name)
        .text(companyInfo.address)
        .text(`Phone: ${companyInfo.phone}`)
        .text(`Email: ${companyInfo.email}`)
        .moveDown();

    // Customer information.
    invoice_document.text(`Bill To: ${customerInfo.name}`)
        .text(customerInfo.address)
        .text(`Email: ${customerInfo.email}`)
        .moveDown();

    // Invoice details.
    invoice_document.text(`Invoice ID: ${invoiceDetails.id}`)
        .text(`Date: ${invoiceDetails.date}`)
        .moveDown();

    // Itemized list
    const tableStartY = 300; // Adjust this value as needed.
    const col1X = 100; // X position for first column.
    const col2X = 250; // X position for second column.
    const col3X = 400; // X position for third column.
    const col4X = 500; // X position for fourth column.

    invoice_document.font('Helvetica-Bold')
        .fontSize(12)
        .text('Item', col1X, tableStartY)
        .text('Quantity', col2X, tableStartY)
        .text('Price', col3X, tableStartY)
        .text('Total', col4X, tableStartY);

    invoice_document.font('Helvetica');
    invoiceDetails.items.forEach((item, index) => {
        const rowY = tableStartY + (index + 1) * 20; // Adjust 20 for row height.
        invoice_document.text(item.description, col1X, rowY);
        invoice_document.text(item.quantity.toString(), col2X, rowY);
        invoice_document.text('$' + item.price.toFixed(2), col3X, rowY);
        invoice_document.text('$' + (item.quantity * item.price).toFixed(2), col4X, rowY);
    });
    invoice_document.moveDown();

    // Thank you message.
    invoice_document.text("Thank you for choosing Chris' Private Parts!",100);

    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=invoice.pdf',
    });

    invoice_document.pipe(response);
    invoice_document.end();

});

app.get('/api/packlist/:pid', (request, response) => {

    let packlist_document = new pdfkit;

    // General information for the packing slip.
    const packlistInfo = {
        id: request.params.pid,
        date: new Date().toLocaleDateString('en-US'),
    };

    // Company name.
    packlist_document.font('Helvetica-Bold')
        .fontSize(20)
        .text(`Chris' Private Parts`, 25, 20);

    // Company slogan.
    packlist_document.font('Helvetica')
        .fontSize(12)
        .text(`Taking matters into both hands.`, 25, 42);

    // Web address.
    packlist_document.text(`www.chrisprivateparts.com`, 25, 55)
        .moveDown();

    // Packing slip top-right title.
    packlist_document.font('Helvetica-Bold')
        .fillColor('#2c6fbb')
        .fontSize(30)
        .text(`PACKING SLIP`, 385, 15, { width: 300 });

    // Date of order.
    packlist_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`DATE`, 410, 45);
    packlist_document.rect(500, 40, 90, 15)
        .stroke();
    packlist_document.font('Helvetica')
        .fontSize(10)
        .text(`${packlistInfo.date}`, 525, 43, { width: 100 });

    // Customer ID.
    packlist_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`CUSTOMER ID`, 410, 60);
    packlist_document.rect(500, 55, 90, 15)
        .stroke();
    packlist_document.font('Helvetica')
        .fontSize(10)
        .text(`12345`, 525, 58, { width: 200 });

    // Bill to.
    packlist_document.rect(25, 75, 200, 20)
        .fill(`#4e5180`);
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`BILL TO`, 40, 80);
    packlist_document.font('Helvetica')
        .fontSize(12)
        .fillColor(`black`)
        .text(`[NAME]`, 35, 100)
        .text(`[STREET ADDRESS]`, 35, 115)
        .text(`[CITY, STREET ZIP]`, 35, 130)
        .text(`[PHONE]`, 35, 145);

    // Ship to.
    packlist_document.rect(300, 75, 200, 20)
        .fill(`#4e5180`);
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`SHIP TO`, 315, 80);
    packlist_document.font('Helvetica')
        .fontSize(12)
        .fillColor(`black`)
        .text(`[NAME]`, 310, 100)
        .text(`[STREET ADDRESS]`, 310, 115)
        .text(`[CITY, STREET ZIP]`, 310, 130)
        .text(`[PHONE]`, 310, 145);

    // Order detail line.
    packlist_document.rect(25, 160, 565, 20)
        .fill(`#4e5180`);
    packlist_document.rect(500, 40, 90, 20)
        .stroke();
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`ORDER DATE`, 40, 165);

    //packlist_document.text(`Here is the packlist: ${request.params.pid}`, 50, 50);
    
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
