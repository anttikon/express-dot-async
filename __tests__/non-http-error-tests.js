import request from 'supertest'
import { getServer } from '../testUtils'

describe('non HttpError', () => {
  let express

  afterEach(() => {
    express.server.close()
  })

  describe('with route that returns promise', () => {
    it('should use default error handling middleware if declared', async () => {
      express = await getServer()
      express.app.async.get('/', () => {
        throw new Error('Random error')
      })
      express.app.use((err, req, res, next) => res.status(418).send('Something broke!'))

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(418)
      expect(response.text).toEqual('Something broke!')
    })

    it('should return HTTP 500 if error handling middleware is not declared', async () => {
      express = await getServer()
      express.app.async.get('/', () => {
        throw new Error('Random error')
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(500)
      expect(response.text.includes('Error: Random error')).toBe(true)
    })
  })

  describe('with route that does not return promise', () => {
    it('should use default error handling middleware if declared', async () => {
      express = await getServer()
      express.app.async.get('/', async () => {
        throw new Error('Random error')
      })

      express.app.use((err, req, res, next) => res.status(418).send('Something broke!'))

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(418)
      expect(response.text).toEqual('Something broke!')
    })

    it('should return HTTP 500 if error handling middleware is not declared', async () => {
      express = await getServer()
      express.app.async.get('/', async () => {
        throw new Error('Random error')
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(500)
      expect(response.text.includes('Error: Random error')).toBe(true)
    })
  })
})
