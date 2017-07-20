import isPromise from './isPromise'

const PENDING_SUFFIX = '//PENDING'
const RESOLVED_SUFFIX = ''
const REJECTED_SUFFIX = '//REJECTED'

export const defaults = {
  pendingSuffix: PENDING_SUFFIX,
  resolvedSuffix: RESOLVED_SUFFIX,
  rejectedSuffix: REJECTED_SUFFIX
}

/**
 * Redux Store middleware.
 *
 * @return {Function}
 */
export default function promiseMiddleware (options = {}) {
  const config = {
    ...defaults,
    ...options
  }

  return (next) => (action) => {
    const {
      promise,
      type,
      ...rest
    } = action

    // if not really a promise then just continue
    if (!isPromise(promise)) {
      return next(action)
    }

    const ACTION_PENDING = `${type}${config.pendingSuffix}`
    const ACTION_RESOLVED = `${type}${config.resolvedSuffix}`
    const ACTION_REJECTED = `${type}${config.rejectedSuffix}`

    // dispatch pending action (including the original promise)
    next({ ...rest, type: ACTION_PENDING, promise })

    return promise
      .then((result) => {
        next({ ...rest, result, type: ACTION_RESOLVED })
        return result
      })
      .catch((error) => {
        next({ ...rest, error, type: ACTION_REJECTED })
      })
  }
}
