const SYMBOL_ITERATOR = Symbol.iterator

export default class Middleware extends Array {

  [SYMBOL_ITERATOR] () {
    return this
  }

  next (i, req, res, nextFunc) {
    i |= 0
    const fn = this[i] || nextFunc
    let nextCalled = 0

    return {
      done: i === this.length,
      value: fn && fn(req, res, () => {
        if (1 === nextCalled) {
          throw new Error('next() called multiple times')
        }
        nextCalled = 1
        // If you really want to use in excess of 5k middleware, ex:
        // return i > 5120 ? Promise.resolve().then(() => this.next(++i, req, res, nextFunc).value) : Promise.resolve(this.next(++i, req, res, nextFunc).value)
        return Promise.resolve(this.next(++i, req, res, nextFunc).value)
      })
    }
  }

  compose (req, res, nextFunc) {
    try {
      return Promise.resolve(this[SYMBOL_ITERATOR]().next(0, req, res, nextFunc).value)
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
