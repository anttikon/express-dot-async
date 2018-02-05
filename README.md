# express-dot-async

Have you always wanted to use Express with Promises like a boss?

## Basics

Usually you have to do things like this:
```js
app.get('/api/songs', (req, res) => {
  database.find('songs')
    .then(songs => res.json(songs))
    .catch(e => res.status(500).send(e.message))
})
```

But with express-dot-async you can do it this way:
```js
app.async.get('/api/songs', () => database.find('songs'))
```

## Error handling

express-dot-async contains special `HttpError` which enable this kind of stuff:
```js
import { HttpError } from 'express-dot-async'

function doStuff(opts) {
  if (!opts.mandatory) {
    throw new HttpError({status: 400, message: 'Mandatory is mandatory!'})
  }
}
```

## Full HD working example

```js
import express from 'express'
import asyncify, { HttpError } from 'express-dot-async'

const app = express()
app.async = asyncify(app)

const getData = (error) => {
  if (error) {
    throw new HttpError({status: 400, message: 'help ducks'})
  }
  return new Promise(resolve => resolve(['ducks', 'dogs', 'cats']))
}

app.async.get('/api/songs', (req) => getData(req.query.error === 'true'))

app.listen(6505)
```