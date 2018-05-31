import request from 'supertest'
import { HttpError } from '../src'
import { getServer } from '../testUtils'

describe('HttpError', () => {
  let express

  afterEach(() => {
    express.server.close()
  })

  describe('with route that returns promise', () => {
    it('should default to HTTP Status 500', async () => {
      express = await getServer()
      express.app.async.get('/', () => {
        throw new HttpError({ message: 'ALERT 500' })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(500)
      expect(response.text).toEqual('ALERT 500')
    })

    it('should be able to declare HTTP Status code', async () => {
      express = await getServer()
      express.app.async.get('/', () => {
        throw new HttpError({ status: 403, message: 'ALERT 403' })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(403)
      expect(response.text).toEqual('ALERT 403')
    })

    it('should default message to "Error"', async () => {
      express = await getServer()
      express.app.async.get('/', () => {
        throw new HttpError({ status: 403 })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(403)
      expect(response.text).toEqual('Error')
    })
  })

  describe('with route that does not return promise', () => {
    it('should default to HTTP Status 500', async () => {
      express = await getServer()
      express.app.async.get('/', async () => {
        throw new HttpError({ message: 'ALERT 500' })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(500)
      expect(response.text).toEqual('ALERT 500')
    })

    it('should be able to declare HTTP Status code', async () => {
      express = await getServer()
      express.app.async.get('/', async () => {
        throw new HttpError({ status: 403, message: 'ALERT 403' })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(403)
      expect(response.text).toEqual('ALERT 403')
    })

    it('should default message to "Error"', async () => {
      express = await getServer()
      express.app.async.get('/', async () => {
        throw new HttpError({ status: 403 })
      })

      const response = await request(express.app).get('/')
      expect(response.status).toEqual(403)
      expect(response.text).toEqual('Error')
    })
  })
})
