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

function handleResponse(data, res) {
  if (!data) {
    return res.send("")
  } else if (typeof data === 'object') {
    return res.json(data)
  }
  return res.send(data)
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
          .then(result => handleResponse(result, res))
          .catch((err) => catchError(err, res))
      } else {
        return handleResponse(routeFunction, res)
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