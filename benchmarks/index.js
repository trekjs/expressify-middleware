'use strict'

const Middleware = require('..')

suite('expressify-middleware', () => {
  set('type', 'adaptive')
  set('mintime', 1000)
  set('delay', 100)

  const logic = () => Promise.resolve(true)

  const fn = (req, res, next) => {
    return logic().then(next).then(logic)
  }

  for (let exp = 0; exp <= 10; exp++) {
    const count = Math.pow(2, exp)
    const middleware = new Middleware()
    for (let i = 0; i < count; i++) {
      middleware.push(fn)
    }
    bench(`(fn * ${count})`, done => {
      middleware.compose({}, {}).then(done, done)
    })
  }
})
