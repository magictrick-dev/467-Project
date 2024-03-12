import { authorize } from "$lib/creditprocessor.js";

// --- Credit Card Processor Test --------------------------------------
//
// A barebones example of pushing credit card requests to the credit
// card processor API.
//

export async function
load()
{

    let name = "Richard Enballs";
    let credit_card_number = "6011 1234 4321 1234";
    let expire = "12/2027";
    let amount = "21.69";

    let result = await authorize(name, credit_card_number, expire, amount);
    return { data: result.data };

}

