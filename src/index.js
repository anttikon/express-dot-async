module.exports = function (app) {
  return {
    get: (...args) => {
      const routeFunction = args[args.length - 1]
      app.get(...args.slice(0, -1), wrap(routeFunction))
    },
    put: (...args) => {
      const routeFunction = args[args.length - 1]
      app.put(...args.slice(0, -1), wrap(routeFunction))
    },
    post: (...args) => {
      const routeFunction = args[args.length - 1]
      app.post(...args.slice(0, -1), wrap(routeFunction))
    },
    delete: (...args) => {
      const routeFunction = args[args.length - 1]
      app.delete(...args.slice(0, -1), wrap(routeFunction))
    }
  }
}

function wrap(fn) {
  return (req, res, next) => {
    try {
      const routeFunction = fn(req, res, next)

      const resSendOrJsonUsed = routeFunction && routeFunction.constructor && routeFunction.constructor.name === 'ServerResponse'
      const routeReturnPromise = routeFunction && routeFunction.then
      if (resSendOrJsonUsed) {
        return next()
      } else if (routeReturnPromise) {
        return routeFunction
          .then(result => (result ? res.json(result) : res.send()))
          .catch((err) => catchError(err, res))
      } else {
        return routeFunction ? res.json(routeFunction) : res.send()
      }
    } catch (err) {
      catchError(err, res)
    }
  }
}

function catchError(err, res) {
  const status = err.status ? err.status : 500
  const message = err.message || 'Error'
  res.status(status).send(message)
}

module.exports.HttpError = class HttpError extends Error {
  constructor(opts = {}) {
    super()
    this.status = opts.status || 500
    this.message = opts.message
  }
}