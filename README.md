
# CSCI 467 Group Project

### Getting Started

First, make sure you have NodeJS installed, then clone this repository somewhere.
After you have the project cloned, you will need to install the necessary packages
for this to work. Open up a terminal, navigate to the directory, and run:

```
npm install
```

Once you have done this, you will then need to build the svelte project by calling:

```
npm run build
```

You can now run the server with:

```
npm run server
```

### Documentation

The project structure has changed slightly to accomodate the utter jank that is
modern web-development UI libraries, however much of the same principles apply
for ExpressJS (the backend). In `server.js`, you will find the routings for the
project. Since Svelte does most of the heavy work for us, you rarely need to edit
this file directory unless you intend to add custom API end-points.

You will need to reference [the SvelteKit documentation](https://kit.svelte.dev/docs/introduction)
in order to properly learn how to create new routings (pages). There is a [tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte)
on Svelte which basically explains how the UI framework works in small steps.

### License

i had to write the readme again because sveltekit delete the old one. very cool

no license i guess.

