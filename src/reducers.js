import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'


import history from './utils/history'
import { reducer as User } from './redux/user'
import { reducer as App } from './redux/app'

// const authPersistConfig = {
//   key: 'auth',
//   storage: storage,
//   blacklist: ['isLogin'],
// }

export default (injectedReducers = {}) =>
  connectRouter(history)(
    combineReducers({
      auth: User,
      // auth: User,
      app: App,
      router: connectRouter(history),
      ...injectedReducers,
    }),
  )
