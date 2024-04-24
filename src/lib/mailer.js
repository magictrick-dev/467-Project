import nodemailer from "nodemailer";
import * as helpers from "./helpers.js"

const test_email    = "niucsci467project24@gmail.com";
const test_pwd      = "mtoe nsvh rlqz gmmq";

export async function
send_invoice(to, details)
{

    // Create the transporter.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: test_email,
            pass: test_pwd,
        }
    });

    // Customer order information.
    const orderInfo = {
        name: details.first + " " + details.last,
        receiptNum: details.orderid,
        trackingLink: "https://www.youtube.com/watch?v=GmG4X9PGOXs",
        items: [
          /*
            { itemnum: "4215", description: "Product 1", quantity: 1, price: 5000 },
            { itemnum: "45-A421E", description: "Product 2", quantity: 2, price: 25 },
            { itemnum: "", description: "Product 3", quantity: 5, price: 2.99 }
          */
            // Add more items as needed.
        ]
    }
/*
  item: {
    number: 2,
    description: 'wiper blade pair',
    price: 23.37,
    weight: 2.5,
    pictureURL: 'http://blitz.cs.niu.edu/pics/wip.jpg'
  },
*/
    details.cart.items.forEach(line => {
      orderInfo.items.push({
        itemnum: line.item.number,
        description: line.item.description,
        quantity: line.qty,
        price: line.item.price,
      })
    });



    // Total Price.
    let totalPrice = 0;

    // Order Items.
    const itemsHTML = orderInfo.items.map(item => {
        totalPrice += (item.quantity * item.price);
        return `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>`;
    }).join('');

    let ship_cost = parseFloat(details.total) - totalPrice;

    // Total Price Row.
    const totalRow = `
        <tr>
            <td class="fw-700 border-top">Amount paid</td>
            <td class="fw-700 text-right border-top">$${totalPrice.toFixed(2)}</td>
        </tr>`;

    const shipping = `
    <tr>
        <td class="fw-700 border-top">Shipping charge</td>
        <td class="fw-700 text-right border-top">$${ship_cost.toFixed(2)}</td>
    </tr>
    `

    // HTML Content
    var htmlContent = `
        <body style="background-color: #ebf8ff;">
            <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
                <br></br>
                <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 2.25rem; font-weight: 800;">Thanks for your order,<br>
                    ${orderInfo.name}!</h1>
                    <p style="margin-top: 16px;">The estimated delivery time for your order is 2-3 business days.<br>
                    Track your order on the Chris' Private Part website.</p>
                    <a href="${orderInfo.trackingLink}" style="display: inline-block; background-color: #3b82f6; color: #fff; border-radius: 9999px; padding: 12px 24px; width: 100%; max-width: 155px; text-align: center; text-decoration: none; margin-top: 16px;">Track Your Order</a>
                </div>
                <div style="border-radius: 1.5rem; padding: 16px; margin-bottom: 24px; background-color: #fff;">
                    <h3 style="text-align: center; margin-bottom: 16px;">Receipt from NIU Automotive</h3>
                    <p style="text-align: center; color: #6b7280; margin-bottom: 8px;">Receipt #${orderInfo.receiptNum}</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tbody>
                            ${itemsHTML}
                            <tr style="height: 20px;"><td colspan="2"></td></tr> <!-- Empty row for spacing -->
                            ${shipping}
                            ${totalRow}
                        </tbody>
                    </table>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #d1d5db;">
                    <p style="margin-bottom: 0;">If you have any questions, contact us at questions@niuautomotive.com.</p>
                </div>
            </div>
        </body>`;

    // Format the email.
    var mailOptions = {
        from: 'niucsci467project24@gmail.com',
        to: to,
        subject: `Your NIU Automative Order`,
        html: htmlContent
    };

    // Send it.
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return info.response
        }
    });
}

export async function
send_confirmation(to, details)
{

    // Create the transporter.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: test_email,
            pass: test_pwd,
        }
    });

    // Customer order information.
    const orderInfo = {
        name: details.first + " " + details.last,
        city: details.city,
        state: details.state,
        trackingLink: "https://www.youtube.com/watch?v=5PsnxDQvQpw",
        orderNum: details.orderid,
        shipmentTotal: parseFloat(details.total)
    }






    // HTML Content
    var htmlContent = `
        <body style="background-color: #ebf8ff;">
            <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
                <br></br>
                <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 2.25rem; font-weight: 800;">Hello, ${orderInfo.name}!<br>
                    Your order has shipped!</h1>
                    <p style="margin-top: 16px;">The estimated delivery time for your order is 2-3 business days.<br>
                    Track your order on the NIU Automotive website.</p>
                    <a href="${orderInfo.trackingLink}" style="display: inline-block; background-color: #3b82f6; color: #fff; border-radius: 9999px; padding: 12px 24px; width: 100%; max-width: 155px; text-align: center; text-decoration: none; margin-top: 16px;">Track Your Order</a>
                </div>
                <div style="border-radius: 1.5rem; padding: 16px; margin-bottom: 24px; background-color: #fff;">
                    <h3 style="text-align: center; margin-bottom: 16px; font-size: 1.50rem;">Shipping Confirmation</h3>
                    <p style="text-align: left; color: #6b7280; margin-bottom: 8px;">Ship to</p>
                    <p style="text-align: left; font-weight: 500; font-size: 1.25rem; margin-bottom: 12px;">${orderInfo.name}<br>
                    ${orderInfo.city}, ${orderInfo.state}</p>
                    <p style="text-align: left; color: #6b7280; margin-bottom: 8px;">Order #</p>
                    <p style="text-align: left; font-weight: 500; font-size: 1.25rem; margin-bottom: 12px;">${orderInfo.orderNum}</p>
                    <br>
                    <!-- Shipment total box -->
                    <div style="display: flex; align-items: center; justify-content: space-between; background-color: #f3f4f6; padding: 6px;">
                        <p style="font-weight: 500; font-size: 1.25rem;">Shipment total&nbsp;</p>
                        <p style="font-weight: 500; font-size: 1.25rem;">$${orderInfo.shipmentTotal.toFixed(2)}</p>
                    </div>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #d1d5db;">
                    <p style="margin-bottom: 0;">If you have any questions, contact us at questions@niuautomotive.com.</p>
                </div>
            </div>
        </body>`;

    // Format the email.
    var mailOptions = {
        from: 'niucsci467project24@gmail.com',
        to: to,
        subject: `Your order has shipped (#${orderInfo.orderNum})`,
        html: htmlContent
    };

    // Send it.
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return info.response
        }
    });

}

