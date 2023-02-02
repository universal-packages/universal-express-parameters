# Express parameters

[![npm version](https://badge.fury.io/js/@universal-packages%2Fexpress-parameters.svg)](https://www.npmjs.com/package/@universal-packages/express-parameters)
[![Testing](https://github.com/universal-packages/universal-express-parameters/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-express-parameters/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-express-parameters/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-express-parameters)

[universal-parameters](https://github.com/universal-packages/universal-parameters) as an express middleware.

## Install

```shell
npm install @universal-packages/express-parameters

npm install express
```

## Middleware
#### **`parameters([unionKind])`**

Unites request relevant attributes to set a Parameters object in the request to pass to the following handlers.

```js
import { parameters } from '@universal-packages/express-parameters'
import express from 'express'

const app = express()

app.use(parameters())
```

#### Union kind

By default the parameters middleware will use the request `body` as a subject for the `Parameters` object, you can pass another strategy depending your needs. For example:

```js
app.use(parameters('params-body'))
```

- **`join`**
  Joins all `body`, `params` and `query` as the subject.

- **`separate`**
  Builds a new object using all `body`, `params` and `query` within their own keys as the subject.

- **`body`**
  Uses `body` as the subject.

- **`body-params`**
  Joins `body` and `params` as the subject.

- **`body-query`**
  Joins `body` and `query` as the subject.

- **`query`**
  Uses `query` as the subject.

- **`query-params`**
  Joins `query` and `params` as the subject.

- **`params`**
  Uses `params` as the subject.

## express params

In order for the middleware to access the params request object, it needs to be used as route handler.

```js
import { parameters } from '@universal-packages/express-parameters'
import express from 'express'

const app = express()

app.get('/user/:id', parameters('join'), (request) => {
  console.log(equest.parameters.subject.id)
})

// > 1
```

## express body

In order for the middleware to access the body request object, it needs to be previously parsed as `json`.

```js
import { parameters } from '@universal-packages/express-parameters'
import express, { json } from 'express'

const app = express()

app.use(json())
app.use(parameters())
// > 1
```

## Global methods
#### **`injectParameters(request: Request)`**

To only inject the parameters object into the request and don't behave as middle ware use this method. In case you are doing some custom middleware.

```js
import { injectParameters } from '@universal-packages/express-parameters'
import express from 'express'

const app = express()

app.use((request, response, next) => {
  injectParameters(request)
  next()
})

// > 1
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
