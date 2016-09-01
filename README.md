# Express Middleware

The Modern (ES6) and **Express-Style** Middleware Composition.

## Installation

```
$ npm install expressify-middleware
```

## Examples

```js
const co = require('co')
const Middleware = require('expressify-middleware')
const middleware = new Middleware()

middleware.push((req, res, next) => {
  req.arr.push(1)
  next()
  req.arr.push(6)
})

middleware.push(async (req, res, next) => {
  req.arr.push(2)
  await next()
  req.arr.push(5)
})

middleware.push(co.wrap(function * (req, res, next) {
  req.arr.push(3)
  yield next()
  req.arr.push(4)
}))

const req = { arr: [] }
const res = {}
middleware.compose(req, res).then(() => {
  console.log(req.arr.toString() === '1,2,3,4,5,6')
})
```

## Badges

[![Build Status](https://travis-ci.org/trekjs/expressify-middleware.svg?branch=master)](https://travis-ci.org/trekjs/expressify-middleware)
[![codecov](https://codecov.io/gh/trekjs/expressify-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/expressify-middleware)
![](https://img.shields.io/badge/license-MIT-blue.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
