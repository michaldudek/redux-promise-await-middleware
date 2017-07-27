/*
 * Redux store middleware that transforms actions that contain 'promise' key (function)
 * into async actions split into 3 different actions fired at appropriate times:
 *
 *  - action.type + '//PENDING' - when the action is dispatched
 *  - action.type - when the promise is successfuly resolved
 *  - action.type + '//REJECTED' - when the promise is rejected
 *
 * Also collects all promises into a reducer so that SSR can wait for them to be resolved
 * before rendering a response.
 */

import promiseAwaitMiddleware from './promiseAwaitMiddleware'
import promiseAwaitReducer from './promiseAwaitReducer'
import promiseMiddleware, { defaults } from './promiseMiddleware'

export {
  promiseAwaitMiddleware,
  promiseAwaitReducer,
  promiseMiddleware,
  defaults
}
