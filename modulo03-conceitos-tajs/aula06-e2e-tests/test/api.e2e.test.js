import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals'

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err))
    server.once('listening', () => resolve())
  })
}

describe('E2E Test Suite', () => {
  describe('E2e Tests for Server in a non-test env', () => {
    it('should start server with PORT 4000', async () => {
      const PORT = 4000
      process.env.NODE_ENV = 'production'
      process.env.PORT = PORT

      jest
        .spyOn(
          console,
          console.log.name
        )

      const { default: server } = await import('../src/index.js')
      await waitForServerStatus(server)

      const serverInfo = server.address()
      expect(serverInfo.port).toBe(4000)
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}:${serverInfo.port}`
      )

      return new Promise(resolve => server.close(resolve))
    })
  })

  describe('E2E Tests for Server', () => {
    let _testServer
    let _testServerAddress

    beforeAll(async () => {
      process.env.NODE_ENV = 'test'
      const { default: server } = await import('../src/index.js')
      _testServer = server.listen();

      await waitForServerStatus(_testServer)

      const serverInfo = _testServer.address()
      _testServerAddress = `http://localhost:${serverInfo.port}`

    })

    afterAll(done => _testServer.close(done))

    it('should return 404 for unsupported routes', async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`, {
        method: 'POST'
      })
      expect(response.status).toBe(404)
    })

    it('should return 400 when cpf is missing and show message', async () => {
      const invalidPerson = { name: 'John Doe' } // Missing CPF

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('cpf is required')
    })

    it('should return 400 when name is missing and show message', async () => {
      const invalidPerson = { cpf: '123.456.789-10' } // Missing Name

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('name is required')
    })

    it('should return error when data is invalid', async () => {
      const invalidPerson = { name: 'JohnDoe', cpf: '123.456.789-10' } // Invalid Name

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPerson)
      })

      expect(response.status).toBe(500)
    })

    it('should save person when data is valid', async () => {
      const validPerson = { name: 'John Doe', cpf: '123.456.789-10' }

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(validPerson)
      })

      expect(response.status).toBe(200)
    })
  })

})

