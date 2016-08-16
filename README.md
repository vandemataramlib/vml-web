## > The frontend source for [vandemataramlibrary.org](http://vandemataramlibrary.org).

---

## Development setup


1. `npm install`
2. `npm install -g typings`
3. `typings install`
4. Enter appropriate config in `.env` (see `.env.example` for required values).

## Starting the server

In development mode

```js
npm start
```

In production mode

```js
NODE_ENV=production npm start
```

In production mode the app is initially rendered on the server for the first request, after which client-side rendering takes over.
