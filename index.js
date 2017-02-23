'use strict'

module.exports = class Middleware extends Array {

  next (req, res, last, i = 0, done = false, called = false, fn = undefined) {
    if ((done = i > this.length)) return

    fn = this[i] || last

    return fn && fn(req, res, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.next(req, res, last, i + 1))
    })
  }

  compose (req, res, last) {
    try {
      return Promise.resolve(this.next(req, res, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
