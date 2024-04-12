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
    invoice_document.text("Thank you for choosing Chris' Private Parts!", 100);

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
        items: [
            { itemnum: "1234", description: "Product 1", orderqty: 1, shipqty: 1, weight: 1.25 },
            { itemnum: "52134", description: "Product 2", orderqty: 2, shipqty: 1, weight: 2.50 },
            { itemnum: "42-4214E", description: "Chicken Nuggets", orderqty: 10, shipqty: 20, weight: 1.00 },
            { itemnum: "402", description: "Chris' Special Sauce", orderqty: 100, shipqty: 2, weight: 5.00 },
            { itemnum: "990012", description: "Javascript", orderqty: 1, shipqty: 0, weight: 0.5 },
            // Add more items as needed.
        ]
    };

    // Specific order information.
    const orderInfo = {
        customerid: "1",
        date: "4/8/2024",
        ordernum: "123456"
    };

    // Set up SHIP TO information (you can fetch this from the database or request parameters).
    const shipToInfo = {
        name: "Chris Dejong",
        street: "1110 Varsity Blvd",
        city: "Dekalb",
        state: "IL",
        zip: "60115",
        phone: "6306361543"
    };

    // Set up BILL TO information (you can fetch this from the database or request parameters).
    const billToInfo = {
        name: "Anita Ye",
        street: "50 Eastfield rd",
        city: "Montgomery",
        state: "IL",
        zip: "60538",
        phone: "3314258243"
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
    packlist_document.text(`www.chrisprivateparts.com`, 25, 57)
        .moveDown();

    // Packing slip top-right title.
    packlist_document.font('Helvetica-Bold')
        .fillColor('#2c6fbb')
        .fontSize(30)
        .text(`PACKING SLIP`, 385, 15, { width: 300 });

    // Calculate position of order date.
    const pdateWidth = packlist_document.widthOfString(packlistInfo.date);
    const pdateX = 545 + (90 - pdateWidth) / 2;
    const pdateY = 42 + (15 - 12) / 2;

    // Print date of packlist print.
    packlist_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`DATE`, 410, 45);
    packlist_document.rect(500, 40, 90, 15)
        .stroke();
    packlist_document.font('Helvetica')
        .fontSize(10)
        .text(`${packlistInfo.date}`, pdateX, pdateY, { width: pdateWidth });

    // Calculate the position to center justify the text within boxed area.
    const textWidth = packlist_document.widthOfString(orderInfo.customerid);
    const cidX = 500 + (90 - textWidth) / 2;
    const cidY = 57 + (15 - 12) / 2;  // Adjusting for font size.

    // Print Customer ID.
    packlist_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`CUSTOMER ID`, 410, 60);
    packlist_document.rect(500, 55, 90, 15)
        .stroke();
    packlist_document.font('Helvetica')
        .fontSize(10)
        .text(`${orderInfo.customerid}`, cidX, cidY, { width: 90 });

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
        .text(`${billToInfo.name}`, 35, 100)
        .text(`${billToInfo.street}`, 35, 115)
        .text(`${billToInfo.city}, ${billToInfo.state} ${billToInfo.zip}`, 35, 130)
        .text(`(${billToInfo.phone.substring(0, 3)}) ${billToInfo.phone.substring(3, 6)}-${billToInfo.phone.substring(6, 10)}`, 35, 145);

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
        .text(`${shipToInfo.name}`, 310, 100)
        .text(`${shipToInfo.street}`, 310, 115)
        .text(`${shipToInfo.city}, ${shipToInfo.state} ${shipToInfo.zip}`, 310, 130)
        .text(`(${shipToInfo.phone.substring(0, 3)}) ${shipToInfo.phone.substring(3, 6)}-${shipToInfo.phone.substring(6,10)}`, 310, 145);

    // Order detail line.
    packlist_document.rect(25, 160, 245, 20)
        .fill(`#4e5180`);
    packlist_document.rect(25, 180, 115, 20)
        .stroke();
    packlist_document.rect(140, 180, 130, 20)
        .stroke();
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`ORDER DATE`, 42, 165)
        .text(`ORDER #`, 177, 165);

    // Math to center date and order number.
    const odateWidth = packlist_document.widthOfString(orderInfo.date);
    const odateX = 25 + (115 - odateWidth) / 2;    // X position for date.
    const odateY = 182 + (20 - 12) / 2;           // Y position for date.
    const orderWidth = packlist_document.widthOfString(orderInfo.ordernum);
    const orderX = 140 + (130 - orderWidth) / 2;  // X position for order.
    const orderY = 182 + (20 - 12) / 2;          // Y position for order.

    // Print order date and order number.
    packlist_document.font('Helvetica')
        .fontSize(12)
        .fillColor(`black`)
        .text(`${orderInfo.date}`, odateX, odateY)
        .text(`${orderInfo.ordernum}`, orderX, orderY);

    // Variables to hold total quantity ordered and shipped.
    let totalOrdered = 0;
    let totalShipped = 0;
    let orderWeight = 0;
    let shipWeight = 0;

    // Draw parts table.
    packlist_document.rect(25, 205, 565, 20)
        .fill(`#4e5180`);
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`ITEM #`, 63, 210)
        .text(`DESCRIPTION`, 227, 210)
        .text(`ORDER QTY`, 410, 210)
        .text(`SHIP QTY`, 515, 210, { width: 95 });
    drawPackTable(packlist_document, 20, 25, 225);

    // Insert parts onto table.
    const tableStartY = 230; // Adjust this value as needed.
    const col1X = 30;  // X position for first column.
    const col2X = 145; // X position for second column.

    packlist_document.font('Helvetica')
        .fillColor('black');
    packlistInfo.items.forEach((item, index) => {
        totalOrdered += item.orderqty;
        totalShipped += item.shipqty;
        orderWeight += item.orderqty * item.weight;
        shipWeight += item.shipqty * item.weight;

        const rowY = tableStartY + (index) * 20; // Adjust 20 for row height.

        // Math to center justify order and shop qty in their boxes.
        const orderWidth = packlist_document.widthOfString(item.orderqty.toString());
        const orderX = 400 + (95 - orderWidth) / 2;  // X position for the third column.
        const shipWidth = packlist_document.widthOfString(item.shipqty.toString());
        const shipX = 495 + (95 - shipWidth) / 2;    // X position for the fourth column.

        packlist_document.text(item.itemnum, col1X, rowY);
        packlist_document.text(item.description, col2X, rowY);
        packlist_document.text(item.orderqty, orderX, rowY);
        packlist_document.text(item.shipqty, shipX, rowY, { width: shipWidth });
    });

    // Math to center justify totals.
    const tOrderWidth = packlist_document.widthOfString(totalOrdered.toString());
    const tOrderX = 400 + (95 - tOrderWidth) / 2;      // X position for total order number.
    const tShippedWidth = packlist_document.widthOfString(totalShipped.toString());
    const tShippedX = 495 + (95 - tShippedWidth) / 2;  // X position for total shipped number.

    // Print totals.
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('black')
        .text(`TOTAL: `, 400 - packlist_document.widthOfString(`TOTAL: `), 630)
    packlist_document.font('Helvetica')
        .text(`${totalOrdered.toString()}`, tOrderX, 630)
        .text(`${totalShipped.toString()}`, tShippedX, 630, { width: tShippedWidth });

    // Weight detail box.
    packlist_document.rect(185, 650, 230, 20)
        .fill(`#4e5180`);
    packlist_document.rect(185, 670, 115, 20)
        .stroke();
    packlist_document.rect(300, 670, 115, 20)
        .stroke();
    packlist_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('white')
        .text(`ORDER WEIGHT`, 185 + (115 - packlist_document.widthOfString(`ORDER WEIGHT`)) / 2, 656.5)
        .text(`SHIP WEIGHT`, 300 + (115 - packlist_document.widthOfString(`SHIP WEIGHT`)) / 2, 656.5);

    // Write total weights.
    packlist_document.font('Helvetica')
        .fontSize(12)
        .fillColor('black')
        .text(`${orderWeight.toString()} lbs`, 185 + (115 - (packlist_document.widthOfString(orderWeight.toString() + ` lbs`))) / 2, 676)
        .text(`${shipWeight.toString()} lbs`, 300 + (115 - (packlist_document.widthOfString(shipWeight.toString() + ` lbs`))) / 2, 676);

    // Our amazing QR code.
    packlist_document.image(`static/qrcode1.png`, 515, 705, { scale: 0.5 });

    //packlist_document.text(`Here is the packlist: ${request.params.pid}`, 50, 50);
    
    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=packing_list.pdf',
    });

    packlist_document.pipe(response);
    packlist_document.end();

});

// Function to draw table for packing list.
function drawPackTable(doc, rows, startX, startY) {
    let currentX = startX;
    let currentY = startY;

    for (let i = 0; i < rows; ++i) {
        doc.rect(currentX, currentY, 115, 20)
            .stroke();
        doc.rect(currentX + 115, currentY, 260, 20)
            .stroke();
        doc.rect(currentX + 375, currentY, 95, 20)
            .stroke();
        doc.rect(currentX + 470, currentY, 95, 20)
            .stroke();

        currentY += 20;
    }
}

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
