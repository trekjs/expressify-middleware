import test from 'ava'
import Middleware from '..'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware[Symbol.iterator] should a function', t => {
  const middleware = t.context
  t.true('function' === typeof middleware[Symbol.iterator])
})

test('middleware[Symbol.iterator]() should return self', t => {
  const middleware = t.context
  t.is(middleware, middleware[Symbol.iterator]())
})

test('middleware iterator', async t => {
  const middleware = t.context
  middleware.push((req, res, next) => {
    req.arr.push(1)
    next()
    res.sended = true
    req.arr.push(6)
  })
  middleware.push((req, res, next) => {
    req.arr.push(2)
    next()
    req.arr.push(5)
  })
  middleware.push((req, res, next) => {
    req.arr.push(3)
    next()
    req.arr.push(4)
  })

  const iter = middleware[Symbol.iterator]()

  t.is('function', typeof iter.next)

  const req = { arr: [] }
  const res = {}

  await iter.next(0, req, res)

  t.deepEqual(req.arr, [1, 2, 3, 4, 5, 6])
  t.true(res.sended)
})
