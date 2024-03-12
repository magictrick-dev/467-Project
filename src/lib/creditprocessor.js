// --- Credit Card Processor -------------------------------------------
//
// The credit card processor API. The authorize function will send a unique
// transaction to the credit processor and return the result. The return
// data will contain the mirror'd input data which can then be stored and
// operated on.
//

import axios from "axios";
import { v4 as uuidv4 } from "uuid";


export async function authorize(name, number, exp, amount)
{
 
    // Generate a unique identifier for the transaction.
    let transaction_identifier = uuidv4();

    // Construct the request data.
    let request_data = {
        "vendor": "CAMR20-24",
        "trans": uuidv4(),
        "cc": number,
        "name": name,
        "exp": exp,
        "amount": amount,
    };

    // Send the request through axios.
    return axios.post("http://blitz.cs.niu.edu/creditcard", request_data);

}
