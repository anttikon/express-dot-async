import express from 'express'
import asyncify from './src/index'

export const getServer = () => {
  return new Promise(resolve => {
    const app = express()
    app.async = asyncify(app)
    const server = app.listen(3000, () => resolve({ app, server }))
  })
}
