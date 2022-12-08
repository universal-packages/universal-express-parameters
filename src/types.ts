export type UnionKind = 'join' | 'separate' | 'body' | 'body-params' | 'body-query' | 'query' | 'query-params' | 'params'

declare global {
  namespace Express {
    interface Request {
      parameters: import('@universal-packages/parameters').Parameters
    }
  }
}
