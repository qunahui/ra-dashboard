import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router/immutable'
import createSagaMiddleware from 'redux-saga'
import logger, { createLogger } from 'redux-logger'
import history from './utils/history'

import createReducer from './reducers'
import persistConfig from './config/ReduxPersist'
import rootSagas from './sagas'
import customMiddleware from './config/ReduxMiddleware'

const sagaMiddleware = createSagaMiddleware()

export function configureStore(initialState = {}, history) {
  /*
    Create the store with two middlewares
    1. sagaMiddleware: Makes redux-sagas work
    2. routerMiddleware: Syncs the location/URL path to the state
  */
  const middlewares = [sagaMiddleware, customMiddleware(), routerMiddleware(history), createLogger({ collapsed: true })]

  const enhancers = [applyMiddleware(...middlewares)]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) // eslint-disable-line no-undef
      : compose

  // Create reducer with redux-persist
  const persistedReducer = persistReducer(persistConfig, createReducer())
  // Create store
  const store = createStore(persistedReducer, initialState, composeEnhancers(...enhancers))
  // Create persistor
  const persistor = persistStore(store)

  // Extensions
  store.runSaga = sagaMiddleware.run
  store.injectedReducers = {} // Reducer registry
  store.injectedSagas = {} // Saga registry
  sagaMiddleware.run(rootSagas)

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers.js', () => {
      console.log("reducer hot reload")
      store.replaceReducer(persistReducer(persistConfig, createReducer(store.injectedReducers)))
    })
    module.hot.accept('./sagas', () => {
      console.log("sagas hot reload")
      const getNewSagas = require('./sagas');
      sagaMiddleware.run(function*() {
        yield rootSagas()
      })
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(function* replacedSaga (action) {
          yield getNewSagas()
        })
      })
    })
  }
  return { store, persistor }
}
const initialState = {}

const { store, persistor } = configureStore(initialState, history)

export default store;
export { persistor }
