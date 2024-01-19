// --- Project 467 -------------------------------------------------------------
// 
// Authors:
//      Milad, Anita, Ryan, Chris
//
// This is the entry point for the express server. Essentially, express requires
// us to define "routes" which correspond to various URLs that users can access.
// For the most part, we are given complete flexibility in terms of what we can
// return back to a user in the response.send function, but we generally want to
// send back files instead of just plain text.
//
// Yes, this is all there is to it.
//

const path = require("path");
const express = require("express");
const app = express();
const port = 9001;

const asset_directory = path.join(__dirname + "/../www/static").normalize();
const view_directory = path.join(__dirname + "/../www/view").normalize();


// --- Static Assets -----------------------------------------------------------
//
// Rather than individually routing each static asset, we can just create a default
// directory and simply send assets back to the user (stuff like images, CSS files, etc.).
// We disable serving index files since we actually want to serve our svelte instead.
// You probably won't need to edit this.
//

app.use(express.static(asset_directory, { "index": false }));

// --- Index -------------------------------------------------------------------
//
// This is the index page, default. We server back HTML through a string, which
// you would *never* actually do in practice, but serves as a demonstration of
// how it would work if you actually wanted to do that.
//

app.get('/', (request, response) => {
    response.send('<h1>Hello, world!</h1><br/><a href="/other">Click here for more!</a>');
});

// --- The "other" Page --------------------------------------------------------
//
// Unlike the index route, we would much rather want to serve an HTML file instead of
// raw text because doing it any other way would be tantamount to kicking puppies
// and vandalizing orphanages.
//

app.get('/other', (request, response) => {

    // Options are optional, how nice.
    let options = {};

    // Send our file back.
    response.sendFile(path.join(view_directory, "/other.html"), options, (error) => {
        if (error) console.log("There was an error: " + error);
    });

});

// --- Server Start ------------------------------------------------------------
//
// We bind the port and tell express to run the web server.
//

app.listen(port, () => {
    console.log("Application is running on localhost:3000/");
});
