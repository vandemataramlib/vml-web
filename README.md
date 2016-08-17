> The frontend source for [vandemataramlibrary.org](http://vandemataramlibrary.org).

## Requirements

Node 4.x.

## Installation

1. `npm install`
2. `npm install -g typings`
3. `typings install`
4. Enter appropriate config in `.env` (see `.env.example` for required values).

## Starting the server

In development mode (with hot reloading):

```js
npm start
```

In production mode:

```js
NODE_ENV=production npm start
```

In production mode the server runs as a daemon and the app is rendered on the server for the initial request.
