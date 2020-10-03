import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import history from './utils/history'
import { reducer as User } from './redux/user'
export default (injectedReducers = {}) =>
  connectRouter(history)(
    combineReducers({
      auth: User,
      router: connectRouter(history),
      ...injectedReducers,
    }),
  )
