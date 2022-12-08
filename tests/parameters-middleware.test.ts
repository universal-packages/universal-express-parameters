import { Parameters } from '@universal-packages/parameters'
import express, { Express, json, Request, Response } from 'express'
import { Server } from 'http'
import fetch from 'node-fetch'
import { parameters } from '../src'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])
let server: Server

async function startServer(app: Express): Promise<void> {
  await new Promise<void>((resolve) => {
    server = app.listen(port, resolve)
  })
}

afterEach(async (): Promise<void> => {
  await new Promise((resolve) => server.close(resolve))
})

describe('parameters-middleware', (): void => {
  describe('join', (): void => {
    it('gets all attributes from params, query and body if available and join them', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.use(json())

      app.get('/:id', parameters('join'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', parameters('join'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123', part: 1 })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123' })
    })
  })

  describe('separate', (): void => {
    it('gets all attributes from params, query and body if available in separate keys', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('separate'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('separate'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ params: { id: '18' }, query: { extra: '123' } })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ params: { id: '18' }, query: { extra: '123' }, body: { part: 1 } })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ params: { id: '18' }, query: { extra: '123' }, body: {} })
    })
  })

  describe('body', (): void => {
    it('gets all attributes from body as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters(), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters(), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({})

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ part: 1 })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({})
    })
  })

  describe('body-params', (): void => {
    it('gets all attributes from body and params as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('body-params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('body-params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', part: 1 })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18' })
    })
  })

  describe('body-query', (): void => {
    it('gets all attributes from body and query as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('body-query'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('body-query'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ part: 1, extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ extra: '123' })
    })
  })

  describe('query', (): void => {
    it('gets all attributes from query as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('query'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('query'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 1 })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ extra: '123' })
    })
  })

  describe('query-params', (): void => {
    it('gets all attributes from query and params as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('query-params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('query-params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '18' })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123' })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18', extra: '123' })
    })
  })

  describe('params', (): void => {
    it('gets all attributes from params as subject', async (): Promise<void> => {
      const app = express()
      let instance: Parameters

      app.get('/:id', parameters('params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      app.post('/:id', json(), parameters('params'), (request: Request, response: Response) => {
        instance = request.parameters
        response.end()
      })

      await startServer(app)

      await fetch(`http://localhost:${port}/18?extra=123`)

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18' })

      await fetch(`http://localhost:${port}/18?extra=123`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '18' })
      })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18' })

      await fetch(`http://localhost:${port}/18?extra=123`, { method: 'POST' })

      expect(instance).toBeInstanceOf(Parameters)
      expect(instance.subject).toEqual({ id: '18' })
    })
  })
})
