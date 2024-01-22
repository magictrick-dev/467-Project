// --- CSCI 467 Express Server -------------------------------------------------
//
// Express serves as the core server for the tech stack, though it offloads most
// of the work back to SvelteKit since it handles routing and server-side parsing.
// Generally, databasing won't occur here, since SvelteKit allows us to create
// server-side renderable components that essentially feed back dynamic data to
// the user. Express gives us a way to expose a *public* API that users can see.
//

import { handler } from './build/handler.js';
import express from 'express';
import cors from 'cors';

// Obligatory joke goes here.
const port = 9001;
const app = express();

// Async API definitions.
app.use(cors()); // Required for cross-origin resource sharing support.
app.get('/data', (request, response) => {
    response.json({ "hello": "world" });
});

// Basically hands off the server-side routing back SvelteKit.
app.use(handler);

// You know what it do.
app.listen(port, () => {
    console.log("Server is running on localhost:" + port);
});
