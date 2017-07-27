Redux Promise Await Middleware
==============================

Combination of Redux middlewares and reducers that help in dealing with async actions and server side rendering.

It exports three main modules:

- `promiseAwaitMiddleware`
- `promiseAwaitReducer`
- `promiseMiddleware`

# Installation

```
npm i redux-promise-await-middleware --save
```

# Promise Await Middleware + Reducer

The middleware and the reducer work in tandem to make server side rendering with React easy when you have to prefetch
data.

This is done by keeping reference to any dispatched promises and only rendering the application and sending the response
to the client after they have resolved. See the example below.

### Usage:

_store.js:_

```
import { createStore, compose, applyMiddleware } from 'redux'
import { promiseAwaitMiddleware, promiseAwaitReducer } from 'redux-promise-await-middleware'

export default (initialState = {}) => {
  const store = createStore(
    {
      __promises: promiseAwaitReducer()
    },
    initialState,
    compose(
      applyMiddleware(
        promiseAwaitMiddleware()
      )
    )
  )

  return store
}
```

### Examples:

This is just one example on how to handle server side rendering while waiting for all async actions to finish. Doing it
this way you can dispatch actions normally inside `componentWillMount()` method so that SSR is completely transparent
for your app.

One controversial issue here is that this effectively re-renders the React app multiple times (at least 2) until
sending the final response. In my tests on a bigger application it takes about 50-70ms per render.

_server.js:_

```
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import App from 'components/App'
import createStore from 'store' // the file above

// normal express handling
const app = express()
app.use((req, res) => {
  // create separate store for each request
  const store = createStore()
  
  // see below
  render(req.url, store)
    .then((html) => {
      res.render('index', {
        html,
        initialState: store.getState()
      })
    })
})

// render the application but wait for any async actions to resolve
function render (url, store) {
  const promises = store.getState().__promises || []
  const promisesCount = promises.length

  return Promise.all(promises)
    .then(() => {
      const html = renderToString((
        <Provider store={store}>
          <App />
        </Provider>
      ))

      // if amount of promises in the store has grown
      // then wait for those new promises to resolve and re-render again
      const newPromises = store.getState()._promises || []
      if (newPromises.length > promisesCount) {
        return render(url, store)
      }

      return html
    })
}
```

# Promise Middleware

This is very similar to [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware) package. It
kicks in when a dispatched action has a property `promise` that is indeed a Promise and splits the action into three
separate actions:

- `[action_name]//PENDING` dispatched immediatelly instead of the original action, contains the original promise
- `[action_name]` dispatched when the promise is resolved, contains `result` property which is what the promise
resolved with and doesn't contain the original promise
- `[action_name]//REJECTED` dispatched when the promise is rejected, contains `error` property and doesn't contain the
original promise.

(The names are configurable).

### Usage:

_store.js:_

```
import { createStore, compose, applyMiddleware } from 'redux'
import { promiseMiddleware } from 'redux-promise-await-middleware'

export default (initialState = {}) => {
  const store = createStore(
    {}, // your reducers
    initialState,
    compose(
      applyMiddleware(
        // install our middleware, the options argument is optional and what you see here are defaults
        promiseMiddleware({
          pendingSuffix: '//PENDING',
          resolvedSuffix: '//',
          rejectedSuffix: '//REJECTED'
        })
      )
    )
  )

  return store
}
```

### Examples:

```
const GET_DATA = 'GET_DATA'

// typical reducer that updates the state with promise status so that UI can give nice feedback on what is happening
function dataReducer (state = {}, action) {
  switch (action.type) {
    // received immediatelly when original action is dispatched, we can show a loading indicator to the user
    case GET_DATA + '//PENDING':
      return {
        ...state,
        data: {},
        loading: true,
        error: false
      }
    }

    // received when the promise in the original action successfully resolves, we can show the data to the user
    case GET_DATA:
      return {
        ...state,
        data: action.result,
        loading: false,
        error: false
      }

    // received when the promise in the original action is rejected, we can show the error to the user
    case GET_DATA + '//REJECTED':
      return {
        ...state,
        data: {},
        loading: false,
        error: action.error
      }

    default:
      return state
  }
}

// just dispatch regular action
dispatch({
  type: GET_DATA,
  promise: fetch('/data/')
})
```

If you ignore the `//PENDING` and `//REJECTED` actions and just deal with the original action name, this middleware can
be totally transparent for you while you can be sure that any data you fetch is there.

# License

MIT, see [LICENSE.md](LICENSE.md).

Copyright (c) 2017 Michał Pałys-Dudek
