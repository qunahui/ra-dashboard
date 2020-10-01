import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import history from './utils/history'
import { reducer as Bar } from './components/Bar/BarRedux'
export default (injectedReducers = {}) =>
  connectRouter(history)(
    combineReducers({
      bar: Bar,
      router: connectRouter(history),
      ...injectedReducers,
    }),
  )
