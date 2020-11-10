import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import configureStore from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router/immutable'
import history from './utils/history'
import store, { persistor } from './store'

const MOUNT_NODE = document.getElementById('root') //eslint-disable-line

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  MOUNT_NODE,
)
