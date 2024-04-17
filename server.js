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
import { send } from './node_modules/vite/dist/node/index.js';

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
        email: "www.chrisprivateparts.com"
    };

    // Set up customer information (you can fetch this from the database or request parameters).
    const customerInfo = {
        name: "Chris Dejong",
        street: "1110 Varsity Blvd",
        city: "Dekalb",
        state: "IL",
        zip: "60115",
        email: "chrisLovesJS@hotmail.com",
        phone: "3314525215"
    };

    // Set up invoice details (from order line information on the database and part information from Legacy).
    const invoiceDetails = {
        id: request.params.iid,
        date: "4/12/2024",
        items: [
            { itemnum: "4215", description: "Product 1", quantity: 1, price: 5000 },
            { itemnum: "45-A421E", description: "Product 2", quantity: 2, price: 25 },
            // Add more items as needed.
        ]
    };






    // Add content to the PDF.
    invoice_document.font('Helvetica-Bold')
        .fillColor('#2c6fbb')
        .fontSize(30)
        .text('INVOICE', 470, 15, { width: invoice_document.widthOfString(`INVOICE`) });

    // Company information.
    invoice_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(20)
        .text(companyInfo.name, 25, 20);
    invoice_document.font('Helvetica')
        .fontSize(12)
        .text(`Taking matters into both hands.`, 25, 42)
        .text(`${companyInfo.email}`)
        .moveDown();

    // Bill to header.
    invoice_document.rect(25, 75, 200, 20)
        .fill(`#4e5180`);
    invoice_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`BILL TO`, 40, 80);

    // Bill to customer information.
    invoice_document.font('Helvetica')
        .fontSize(12)
        .fillColor(`black`)
        .text(`${customerInfo.name}`, 35, 100)
        .text(`${customerInfo.street}`, 35, 115)
        .text(`${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}`, 35, 130)
        .text(`${customerInfo.email}`, 35, 145)
        .text(`(${customerInfo.phone.substring(0, 3)}) ${customerInfo.phone.substring(3, 6)}-${customerInfo.phone.substring(6, 10)}`, 35, 160);

    // Calculate position of order date.
    const dateWidth = invoice_document.widthOfString(invoiceDetails.date);
    const dateX = 505 + (90 - dateWidth) / 2;
    const dateY = 42 + (15 - 12) / 2;

    // Print date for invoice.
    invoice_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`DATE`, 425, 45);
    invoice_document.rect(500, 40, 90, 15)
        .stroke();
    invoice_document.font('Helvetica')
        .fontSize(10)
        .text(`${invoiceDetails.date}`, dateX, dateY, { width: dateWidth });

    // Calculate the position to center justify the text within boxed area.
    const textWidth = invoice_document.widthOfString(invoiceDetails.id);
    const iidX = 500 + (90 - textWidth) / 2;
    const iidY = 57 + (15 - 12) / 2;  // Adjusting for font size.

    // Print Invoice ID.
    invoice_document.font('Helvetica-Bold')
        .fillColor('black')
        .fontSize(12)
        .text(`INVOICE ID`, 425, 60);
    invoice_document.rect(500, 55, 90, 15)
        .stroke();
    invoice_document.font('Helvetica')
        .fontSize(10)
        .text(`${invoiceDetails.id}`, iidX, iidY, { textWidth });

    // Our amazing QR code.
    invoice_document.image(`static/qrcode2.png`, 500, 90, { scale: 0.5 });

    // Draw table.
    invoice_document.rect(25, 185, 565, 20)
        .fill(`#4e5180`);
    invoice_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(`white`)
        .text(`ITEM #`, 63, 190)
        .text(`DESCRIPTION`, 140 + (212.5 - invoice_document.widthOfString(`DESCRIPTION`)) / 2, 190)
        .text(`QTY`, 352.5 + (47.5 - invoice_document.widthOfString(`QTY`)) / 2, 190)
        .text(`UNIT PRICE`, 400 + (95 - invoice_document.widthOfString(`UNIT PRICE`)) / 2, 190)
        .text(`NET PRICE`, 495 + (95 - invoice_document.widthOfString(`NET PRICE`)) / 2, 190, { width: invoice_document.widthOfString(`NET PRICE`) + 20 });
    drawInvoiceTable(invoice_document, 25, 25, 205);

    // Insert items into table.
    const tableStartY = 210; // Adjust this value as needed.
    const col1X = 30;  // X position for first column.
    const col2X = 145; // X position for second column.

    let totalQty = 0;
    let totalNet = 0;

    invoice_document.font('Helvetica')
        .fillColor('black');
    invoiceDetails.items.forEach((item, index) => {
        totalQty += item.quantity;

        const netPrice = item.quantity * item.price;

        totalNet += netPrice;

        const rowY = tableStartY + (index) * 20; // Adjust 20 for row height.

        // Math to center justify order and shop qty in their boxes.
        const qtyWidth = invoice_document.widthOfString(item.quantity.toString());
        const orderX = 352.5 + (47.5 - qtyWidth) / 2;  // X position for the third column.
        const priceWidth = invoice_document.widthOfString("$" + item.price.toFixed(2).toString());
        const priceX = 400 + (95 - priceWidth) / 2;    // X position for the fourth column.
        const netWidth = invoice_document.widthOfString("$" + netPrice.toFixed(2).toString());
        const netX = 495 + (95 - netWidth) / 2;        // X position for the fifth column.

        invoice_document.text(item.itemnum, col1X, rowY);
        invoice_document.text(item.description, col2X, rowY);
        invoice_document.text(item.quantity, orderX, rowY);
        invoice_document.text("$" + item.price.toFixed(2), priceX, rowY);
        invoice_document.text("$" + netPrice.toFixed(2), netX, rowY, { width: netWidth });
    });

    // Width of page.
    const pageWidth = invoice_document.page.width;

    // What I have to do to write things in the margins.
    let margins = invoice_document.page.margins;  // Save the current margins.
    invoice_document.page.margins = {             // Remove bottom margin so a new page does not print.
        bottom: 0
    };

    // Compute totals location.
    const tQtyWidth = invoice_document.widthOfString(totalQty.toString());
    const tQtyX = 352.5 + (47.5 - tQtyWidth) / 2;      // X position for total order number.
    const tNetWidth = invoice_document.widthOfString("$" + totalNet.toFixed(2).toString());
    const tNetX = 495 + (95 - tNetWidth) / 2;          // X position for total shipped number.

    // Print totals.
    invoice_document.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('black')
        .text(`TOTAL: `, 352.5 - invoice_document.widthOfString(`TOTAL: `), 708)
    invoice_document.font('Helvetica')
        .text(`${totalQty.toString()}`, tQtyX, 708)
        .text("$" + totalNet.toFixed(2), tNetX, 708, { width: tNetWidth });

    // Print thank you message.
    invoice_document.font('Helvetica')
        .fontSize(12)
        .fillColor(`black`)
        .text("Thank you for choosing Chris' Private Parts!",
            (pageWidth - invoice_document.widthOfString("Thank you for choosing Chris' Private Parts!")) / 2, 750);

    // Return margins back to normal.
    invoice_document.page.argins = margins;

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
        ordernum: request.params.pid
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
    drawTable(packlist_document, 20, 25, 225);

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
    
    response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=packing_list.pdf',
    });

    packlist_document.pipe(response);
    packlist_document.end();

});

app.get('/api/shiplabel/:slabel', (request, response) => {

    // The shipping label is 4" x 6".
    let shiplabel = new pdfkit({ size: [4 * 72, 6 * 72] }); // 1 ich = 72 points.

    const sender = {
        name: `Chris' Private Parts`,
        address: `1234 CPP Drive`,
        city: `Dekalb`,
        state: `IL`,
        postalCode: `60115`
    }

    // Recipient information.
    const recipient = {
        name: 'Ryan Solfisburg',
        addressLine1: '1110 Varsity Blvd',
        addressLine2: 'Apt 220',
        city: 'Dekalb',
        state: 'IL',
        postalCode: '60115',
    };

    // Shipping weight information.
    const packageInfo = {
        trackingNumber: request.params.slabel, // Assuming the tracking number is passed as a parameter
        weight: 999,
        routingNumber: '9405 5112 9837 0132 0951 98'
    };

    // Width of page.
    const pageWidth = shiplabel.page.width;
    const pageHeight = shiplabel.page.height;

    // What I have to do to write things in the margins.
    shiplabel.page.margins = {             // Remove margin.
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    };

    // Shipping Header.
    shiplabel.font('Helvetica-Bold')
        .fontSize(55)
        .text(`P`, 10, 10);

    // Line Delimiter.
    shiplabel.moveTo(0, 60)
        .lineTo(pageWidth, 60)
        .stroke();
    shiplabel.moveTo(shiplabel.widthOfString(`P`) + 20, 60)
        .lineTo(shiplabel.widthOfString(`P`) + 20, 0)
        .stroke();

    // Name of Company.
    shiplabel.font('Helvetica-Bold')
        .fontSize(20)
        .text(`CHRIS'`, 60, 2)
        .fontSize(16)
        .text(`PRIVATE SHIPPING`, 60, 24);

    // Weight of package.
    shiplabel.font('Helvetica')
        .fontSize(10)
        .text(`WEIGHT: `, 60, 48);
    shiplabel.font('Helvetica')
        .fontSize(10)
        .text(`${packageInfo.weight.toFixed(2)} lbs`, shiplabel.widthOfString(`WEIGHT: `) + 60, 48);

    // Shipping type.
    const shipTWidth = shiplabel.widthOfString(`PRIORITY MAIL 2-DAY`);
    shiplabel.font('Helvetica-Bold')
        .fontSize(14)
        .text(`PRIORITY MAIL 2-DAY`, ((pageWidth - shipTWidth) / 2) - 20, 69);

    // Line Delimiter.
    shiplabel.moveTo(0, 90)
        .lineTo(pageWidth, 90)
        .stroke();

    // From Label.
    shiplabel.font('Helvetica-Bold')
        .fontSize(12)
        .text(`FROM:`, 3, 93);
    // From Label Information.
    shiplabel.font('Helvetica')
        .fontSize(10)
        .text(`${sender.name}`, 5, 106)
        .text(`${sender.address}`, 5, 118)
        .text(`${sender.city}, ${sender.state} ${sender.postalCode}`, 5, 130);

    // Ship To Label.
    shiplabel.font('Helvetica-Bold')
        .fontSize(14)
        .text(`SHIP`, 10, 150)
        .text(`TO:`, 10, 165);

    // Ship To Label Information.
    let addressY = 194; 

    shiplabel.font('Helvetica')
        .fontSize(20)
        .text(`${recipient.name}`, 65, 150)
        .text(`${recipient.addressLine1}`, 65, 172);
    if (recipient.addressLine2 != ``) { 
        shiplabel.text(`${recipient.addressLine2}`, 65, addressY);
        addressY += 22;
    }
    shiplabel.text(`${ recipient.city }, ${ recipient.state } ${ recipient.postalCode }`, 65, addressY)

    // Line Delimiter Thick.
    shiplabel.moveTo(0, 280)
        .lineWidth(3)
        .lineTo(pageWidth, 280)
        .stroke();

    // Draw tracking number
    shiplabel.font('Helvetica-Bold')
        .fontSize(14)
        .text(`Tracking Number: ${packageInfo.trackingNumber}`, ((pageWidth - shiplabel.widthOfString(`Tracking Number: ` + packageInfo.trackingNumber)) / 2), 300);

    // Barcode.
    shiplabel.image(`static/barcode.png`, 3.5, 320, { scale: 0.5 });

    // Routing Number.
    shiplabel.font('Helvetica-Bold')
        .fontSize(14)
        .text(`${packageInfo.routingNumber}`, (pageWidth - shiplabel.widthOfString(packageInfo.routingNumber)) / 2, 395);

    // Line Delimiter Thick
    shiplabel.moveTo(0, pageHeight - 2)
        .lineWidth(3)
        .lineTo(pageWidth, pageHeight - 2)
        .stroke();

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

// --- Helper Function Definitions ---------------------------------------------

// --- Draw Table --------------------------------------------------------------
//
// Function to draw table.
//
// doc    :  Name of the document.
// rows   :  Number of rows to insert.
// startX :  X-coordinate of the top left position.
// startY :  Y-coordinate of the top left position.
//
function drawTable(doc, rows, startX, startY) {
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

// --- Draw Invoice Table ------------------------------------------------------
//
// Function to draw the invoice table.
//
// doc    :  Name of the document.
// rows   :  Number of rows to insert.
// startX :  X-coordinate of the top left position.
// startY :  Y-coordinate of the top left position.
//
function drawInvoiceTable(doc, rows, startX, startY) {
    let currentX = startX;
    let currentY = startY;

    for (let i = 0; i < rows; ++i) {
        doc.rect(currentX, currentY, 115, 20)
            .stroke();
        doc.rect(currentX + 115, currentY, 212.5, 20)
            .stroke();
        doc.rect(currentX + 327.5, currentY, 47.5, 20)
            .stroke();
        doc.rect(currentX + 375, currentY, 95, 20)
            .stroke();
        doc.rect(currentX + 470, currentY, 95, 20)
            .stroke();

        currentY += 20;
    }
}
