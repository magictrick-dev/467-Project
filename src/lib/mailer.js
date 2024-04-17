import nodemailer from "nodemailer";

const test_email    = "niucsci467project24@gmail.com";
const test_pwd      = "mtoe nsvh rlqz gmmq";

export async function
send_invoice(to)
{

    // Create the transporter.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: test_email,
            pass: test_pwd,
        }
    });

    const contactInfo = {

    }

    const orderInfo = {
        name: "Ryan Solfisburg",
        trackingNum: "59012",
        receiptNum: "1421",
        items: [
            { itemnum: "4215", description: "Product 1", quantity: 1, price: 5000 },
            { itemnum: "45-A421E", description: "Product 2", quantity: 2, price: 25 },
            { itemnum: "", description: "Product 3", quantity: 5, price: 2.99 }
            // Add more items as needed.
        ]
    }

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

    // Total Price Row.
    const totalRow = `
        <tr>
            <td class="fw-700 border-top">Amount paid</td>
            <td class="fw-700 text-right border-top">$${totalPrice.toFixed(2)}</td>
        </tr>`;


    // HTML Content
    var htmlContent = `
        <body style="background-color: #ebf8ff;">
            <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
                <br></br>
                <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 2.25rem; font-weight: 800;">Thanks for your order, ${orderInfo.name}</h1>
                    <p style="margin-top: 16px;">The estimated delivery time for your order is 2-3 business days. Track your order on the Chris' Private Part website.</p>
                    <a href="http://localhost:9001/" style="display: inline-block; background-color: #3b82f6; color: #fff; border-radius: 9999px; padding: 12px 24px; width: 100%; max-width: 155px; text-align: center; text-decoration: none; margin-top: 16px;">Track Your Order</a>
                </div>
                <div style="border-radius: 1.5rem; padding: 16px; margin-bottom: 24px; background-color: #fff;">
                    <h3 style="text-align: center; margin-bottom: 16px;">Receipt from Chris' Private Parts</h3>
                    <p style="text-align: center; color: #6b7280; margin-bottom: 8px;">Receipt #${orderInfo.receiptNum}</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tbody>
                            ${itemsHTML}
                            <tr style="height: 20px;"><td colspan="2"></td></tr> <!-- Empty row for spacing -->
                            ${totalRow}
                        </tbody>
                    </table>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #d1d5db;">
                    <p style="margin-bottom: 0;">If you have any questions, contact us at questions@chrisprivateparts.com.</p>
                </div>
            </div>
        </body>`;

    // Format the email.
    var mailOptions = {
        from: 'niucsci467project24@gmail.com',
        to: to,
        subject: `Your Chris' Private Parts order`,
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
send_confirmation()
{

    // Create the transporter.
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: test_email,
            pass: test_pwd,
        }
    });

    // Format the email.
    var mailOptions = {
        from: 'niucsci467project24@gmail.com',
        to: to,
        subject: 'Sending Email using Node.js',
        text: 'Hello, from the CSCI 467 project. Here is the shipping confirmation.'
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

