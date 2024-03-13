
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

Alternatively, combine both build and server with start:

```
npm run start
```

The commands above create production builds, however, if you're creating
pages and designing them (without ExpressJS backend functionality), you
can run `npm run dev` which will launch an auto-refreshing instance so you
can see changes live as you make them.

### Documentation

You will need to reference [the SvelteKit documentation](https://kit.svelte.dev/docs/introduction)
in order to properly learn how to create new routings (pages). There is a [tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte)
on Svelte which basically explains how the UI framework works in small steps.

**Creating Pages**

In the `src/routes` directory, each directory corresponds to a "page" route.
If you want to create a new page, simply go in there and create a physical
directory paired with a `+page.svelte`. The route should be complete. A link
can now be created in HTML which navigates to that route.

**Legacy Database Connection**

Go to `src/routes/test/legacy` and note the files in the directory. In order
to do any "server-side" interactivity that isn't native-JS, you will need
to perform the following steps:

1.  Create a `+page.server.js` which exports an async function called "load".
    This function is responsible for returning *server-side data* to the client.
    In the example within this directory, all this function does is fetch
    all the rows from the legacy parts database and returns it. You can
    wrap this data into a JSON object to which the front-end can access.
    
    Take note of the `import` statement at the top, this is a library
    function which I created which connects to the MySQL database. It's
    already done, all you need to do is call the `set_connection()` function
    as seen in the `+page.server.js` file and it should just work.

2.  From `+page.svelte`, you only need to grab the data with `export let data`,
    (or at least that's how I learned how to do it). You can then use this
    data on the front-end as desired.

**Credit Card Processor**

Go to `src/routes/test/ccprocessor` which contains a running example.
Like the legacy database connection example, mirror the setup to get the
output from the function calls. The paradigm used in this example is probably
not the ideal with of handling this because this will most likely come from
a form which the user submits. We will need to handle this differently, but
the core driver API is built: `authorize()`.

**Mailing**

Probably best if you didn't play with this.

**Printing PDFs**

See `server.js` for the API endpoint examples. Uses PDFKit to generate and send
PDFs which can be programmatically generated without having to create physical
files. Very neat.

This *requires* that you build and run the server rather than executing the dev
build since it uses express JS as the primary API-handler for this. Trust me,
any other way is a hassle.

**Bootstrap CSS**

I have already included bootstrap as the CSS framework for the project. You
can view the [documentation here](https://getbootstrap.com/docs/5.3/customize/overview/).
It is pretty easy to do, just either copy-and-paste the examples into
the Svelte-HTML or just follow the documentation.

### License

i had to write the readme again because sveltekit delete the old one. very cool

no license i guess.

