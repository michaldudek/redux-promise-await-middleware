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
export default function promiseAwaitMiddleware (options = {}) {
  const config = {
    ...defaults,
    ...options
  }

  return () => (next) => (action) => {
    const {
      promise,
      __await
    } = action

    // if not really a promise then just continue
    if (__await || !isPromise(promise)) {
      return next(action)
    }

    // dispatch action to add this promise to our await stack
    next({ type: config.awaitActionName, __await: true, promise })

    promise.then((result) => {
      // dispatch action to clear this promise from our await stack
      next({ type: config.clearActionName, __await: true, promise })

      return result
    }, (error) => {
      // dispatch action to clear this promise from our await stack
      next({ type: config.clearActionName, __await: true, promise })

      // continue rejection, not our place to deal with it
      return Promise.reject(error)
    })

    // continue to next middleware
    return next(action)
  }
}
