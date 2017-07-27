import { defaults } from './awaitPromiseMiddleware'

/**
 * Creates a reducer function that collects pending promises from dispatched actions
 * (requires awaitPromiseMiddleware).
 *
 * @param  {Object} options Optional options.
 * @return {Function}
 */
export default function promiseAwaitReducer (options = {}) {
  const config = {
    ...defaults,
    ...options
  }

  return (state = [], action) => {
    switch (action.type) {
      case config.awaitActionName:
        return state.concat([action.promise])

      case config.clearActionName:
        const index = state.indexOf(action.promise)
        if (index < 0) {
          return state
        }

        return state.filter((promise) => promise !== action.promise)
    }

    return state
  }
}
