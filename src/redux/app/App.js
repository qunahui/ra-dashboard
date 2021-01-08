import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchShopsStart: [''],
  fetchShopsSuccess: ['payload'],
  loadStorage: ['payload'],
  addPlatformCredentials: ['payload'],
})

export const AppTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  storage: {},
  isGettingShops: false
})

/* ------------- Reducers ------------- */
const fetchShopsStart = (state) => state.merge({
  isGettingShops: true
})
const loadStorage = (state, { payload: { storage } }) => {
  return state.merge({
    storage
  })
}
const addPlatformCredentials = (state, { payload }) => {
  console.log("payload: ", payload)
  let platformCredentials = state.toJS().platformCredentials
  if(platformCredentials) {
    platformCredentials = platformCredentials.push(payload)
  } else {
    platformCredentials = [payload]
  }
  return state.mergeDeep({
    storage: {
      platformCredentials
    }
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_SHOPS_START] : fetchShopsStart,
  [Types.LOAD_STORAGE] : loadStorage,
  [Types.ADD_PLATFORM_CREDENTIALS] : addPlatformCredentials,
})
