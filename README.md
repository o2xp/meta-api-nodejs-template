# meta-api-gateway

## Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)

## Getting started : 

- Fork the repo on your github.

```sh
$ git clone https://github.deutsche-boerse.de/<YOUR_USERNAME>/cs.meta.git 
$ npm install
```

- Don't forget to create a .env file :

```js
#Node Config File.
NODE_ENV=development
META_PORT=5000
```

- Build and run the project locally

```
npm run build
npm run start
```

- Build and run the Docker image
```sh
$ docker build -t meta .
$ docker run --name meta -d -p 5000:5000 -e NODE_ENV='development' -e META_PORT='5000' meta
```

### Build and Run scripts
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:


| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Does the same as 'npm run serve'. Can be invoked with `npm start`                                 |
| `build`                   | Full build. Runs ALL build tasks (`build-ts`)                                                     |
| `serve`                   | Runs node on `build/src/meta.server.js` which is the apps entry point                             |
| `dev`                     | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task         |
| `test`                    | Runs tests using Jest test runner                                                                 |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `build` folder                              |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed               |
| `lint`                    | Runs ESLint on project files                                                                      |
| `debug`                   | Performs a full build and then serves the app in watch mode                                       |
| `prettier`                | Runs Prettier on project files                                                                    |


## Dependencies
Dependencies are managed through `package.json`.


