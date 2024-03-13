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

    // Format the email.
    var mailOptions = {
        from: 'niucsci467project24@gmail.com',
        to: to,
        subject: 'Sending Email using Node.js',
        text: 'Hello, from the CSCI 467 project. Here is the invoice.'
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

