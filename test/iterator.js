import test from 'ava'
import Middleware from '..'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('iterator', async t => {
  const middleware = t.context
  middleware.push((req, res, next) => {
    req.arr.push(1)
    return next().then(() => {
      res.sended = true
      req.arr.push(6)
    })
  })
  middleware.push(async (req, res, next) => {
    req.arr.push(2)
    await next()
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

  await middleware.compose(req, res)

  t.deepEqual(req.arr, [1, 2, 3, 4, 5, 6])
  t.true(res.sended)
})
