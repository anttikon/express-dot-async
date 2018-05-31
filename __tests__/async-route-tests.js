import request from 'supertest'
import { getServer } from '../testUtils'

describe('async route', () => {
  let express

  afterEach(() => {
    express.server.close()
  })

  it('should be able to return non-promise value from route with return', async () => {
    express = await getServer()
    express.app.async.get('/', () => ({ coolResponse: true }))

    return request(express.app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ coolResponse: true })
  })

  it('should be able to return promise value from route', async () => {
    express = await getServer()
    express.app.async.get('/', () => new Promise(resolve => {
      setTimeout(() => resolve({ coolPromiseResponse: true }), 50)
    }))

    return request(express.app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ coolPromiseResponse: true })
  })
})
