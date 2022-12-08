import { Parameters } from '@universal-packages/parameters'
import { NextFunction, Request, Response } from 'express'
import { UnionKind } from './types'

export function parameters(union: UnionKind = 'body'): any {
  return (request: Request, _response: Response, next: NextFunction): void => {
    let subject: any

    switch (union) {
      case 'join':
        subject = { ...request.params, ...request.query, ...request.body }
        break
      case 'separate':
        subject = { params: request.params, query: request.query, body: request.body }
        break
      case 'body':
        subject = { ...request.body }
        break
      case 'body-params':
        subject = { ...request.params, ...request.body }
        break
      case 'body-query':
        subject = { ...request.query, ...request.body }
        break
      case 'query':
        subject = { ...request.query }
        break
      case 'query-params':
        subject = { ...request.params, ...request.query }
        break
      case 'params':
        subject = { ...request.params }
        break
    }

    request.parameters = new Parameters(subject, 'request')

    next()
  }
}
