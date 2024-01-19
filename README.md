# CSCI 467 Group Project

The repository for the undescribed e-commerce website we are supposed to make.

## Project Setup

First, [install NodeJS LTS](https://nodejs.org/en) and make sure that you can
run it from the terminal. Something like `node --version` is enough to make sure
it works. Once you do this, clone the repository somewhere.

In order to get the required external modules we need for the project, run:

```
npm install
```

Once everything is installed, you can run the server with:

```
npm run server
```

Navigate to your browser and type:

```
localhost:9001
```

If you see a web page load up, then you know everything is installed. You can now
hit control-c to force-stop the server.

## Documentation

The web server file is `source/server.js`. This is the file that is ran when you
invoke `npm run server` as defined in `package.json` in case you are wondering why
you are running that command instead of `node ./source/server.js` like normal. Any
server-side files that we create should be placed within the `source/` directory.
Basically, any files we **don't** want the outside world to see should be placed
within this folder. It's good convention.

For out front-end stuff, the `www` folder is designed to contain it. It's important
to note that we specifically reserve the `www/static` directory for anything that
we want to automatically serve to the front-end. Stuff like images and CSS & JS files
go here. Any subdirectories are also automatically added. The `www/view` folder is
just a directory for our front-end HTML files. Until we start to use Svelte,
we just need to have a place to store our files.


### Creating Routes

Routes are basically "paths" that map to the URL paths. For example, `youtube.com`
root route is `/`. The root route is special because this is the websites landing page,
or "index page". All other routes are simply sub-routes of the root-route. You can
create "sub-directories" like `youtube.com/watch?v=dQw4w9WgXcQ`, which is a route
that evaluates to `/watch` with a GET-request attached to it.

The point of ExpressJS is to give us the flexibility to create custom routes that serve
custom files however we want. It's not meant to be super complicated and won't need
the majority of the deep-customization that Express offers, but if we do, it's there
and we can use it.

If you look in `source/server.js`, there will be some examples of routes within
there. You can see `/other` listed as a route that simply returns `www/view/other.html`
to the client. Very simple to add more routes; copy and paste this, change the route
name, serve whatever file you want (literally any file, not even joking lol), and
it just works(TM).


# License

idk lol, its a school project

go wild

