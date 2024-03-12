import { send_invoice, send_confirmation } from "$lib/mailer.js";

export async function
load()
{

    const test_data = {
        hello: "world",
    };

    //let mail_status = send_invoice("magiktrikdev@gmail.com");
    return { data: test_data };

}

