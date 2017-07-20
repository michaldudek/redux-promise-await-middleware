import isPromise from './isPromise'

const AWAIT_PROMISE_ACTION = '__AWAIT_PROMISE'
const CLEAR_PROMISE_ACTION = '__CLEAR_PROMISE'

export const defaults = {
  awaitActionName: AWAIT_PROMISE_ACTION,
  clearActionName: CLEAR_PROMISE_ACTION
}

/**
 * Redux store middleware that dispatches await and clear actions for all actions that have a promise
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
export default function awaitPromiseMiddleware (options = {}) {
  const config = {
    ...defaults,
    ...options
  }

  return (next) => (action) => {
    const { promise } = action

    // if not really a promise then just continue
    if (!isPromise(promise)) {
      return next(action)
    }

    // dispatch action to add this promise to our await stack
    next({ type: config.awaitActionName, promise })

    promise.then((result) => {
      // dispatch action to clear this promise from our await stack
      next({ type: config.clearActionName, promise })

      return result
    }, (error) => {
      // dispatch action to clear this promise from our await stack
      next({ type: config.clearActionName, promise })

      // continue rejection, not our place to deal with it
      return Promise.reject(error)
    })

    // continue to next middleware
    return next(action)
  }
}
