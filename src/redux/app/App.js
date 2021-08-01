import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getStoresStart: ['payload'],
  getStoresSuccess: ['payload'],
  getStoresFailure: ['payload'],
  connectLazadaStart: ['payload'],
  connectLazadaSuccess: ['payload'],
  connectLazadaFailure: ['payload'],
  connectSendoStart: ['payload'],
  connectSendoSuccess: ['payload'],
  connectSendoFailure: ['payload'],
  disconnectStoreStart: ['payload'],
  disconnectStoreSuccess: ['payload'],
  disconnectStoreFailure: ['payload'],
  addPlatformCredentials: ['payload'],
  syncDataStart: ['payload'],
  syncDataSuccess: ['payload'],
  syncDataFailure: ['payload'],
  refreshAllTokenStart: ['payload'],
  refreshAllTokenSuccess: ['payload'],
  refreshAllTokenFailure: ['payload'],
  createMultiPlatformProductStart: ['payload'],
  createMultiPlatformProductSuccess: ['payload'],
  createMultiPlatformProductFailure: ['payload'],
  autoLinkDataStart: ['payload'],
  autoLinkDataSuccess: ['payload'],
  autoLinkDataFailure: ['payload'],
  hideMessage: [],
})

export const AppTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  storage: {},
  error: null,
  isWorking: false,
  isShowMessage: false,
  messagePayload: ''
})

/* ------------- Reducers ------------- */
const getStoresStart = (state) => state.merge({
  isWorking: true
})

const getStoresSuccess = (state, { payload: { storage } }) => {
  return state.merge({
    storage,
    isWorking: false
  })
}

const getStoresFailure = (state, { payload: { error } }) => state.merge({
  isWorking: false,
  error
})

const connectLazadaStart = (state) => state.merge({
  isWorking: true,
})

const connectLazadaSuccess = (state, { payload }) => {
  return state.merge({
    isWorking: false,
  })
}

const connectLazadaFailure = (state, { error }) => state.merge({
  isWorking: false,
  // error
})

const connectSendoStart = (state) => state.merge({
  isWorking: true,
})

const connectSendoSuccess = (state, { payload }) => {
  let sendoCredentials = state.toJS().storage.sendoCredentials
  if(sendoCredentials.length > 0) {
    sendoCredentials = sendoCredentials.concat(payload)
  } else {
    sendoCredentials = [payload]
  }
  return state.mergeDeep({
    isWorking: false,
    storage: {
      sendoCredentials
    }
  })
}

const connectSendoFailure = (state, { error }) => state.merge({
  isWorking: false,
  // error
})

const disconnectStoreStart = (state) => state.merge({
  isWorking: true
})

const disconnectStoreSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  storage: payload
})

const disconnectStoreFailure = (state) => state.merge({
  isWorking: false
})

const addPlatformCredentials = (state, { payload }) => {
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

const syncDataStart = state => state.merge({
  isWorking: true,
})

const syncDataSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  products: payload
})

const syncDataFailure = (state, { payload }) => {
  return state.merge({
    isWorking: false,
    error: payload
  })
}

const refreshAllTokenStart = (state, { payload }) => state.merge({
  isWorking: true,
})

const refreshAllTokenSuccess = (state, { payload }) => state.merge({
  storage: payload,
  isWorking: false,
})

const refreshAllTokenFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createMultiPlatformProductStart = (state, { payload }) => state.merge({
  isWorking: true,
})

const createMultiPlatformProductSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createMultiPlatformProductFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const autoLinkDataStart = (state) => state.merge({
  isWorking: true,
})

const autoLinkDataSuccess = (state, { payload }) => state.merge({
  isWorking: true,
  isShowMessage: true,
  message: JSON.stringify(payload)
})

const autoLinkDataFailure = (state) => state.merge({
  isWorking: true,
})

const hideMessage = (state) => state.merge({
  isShowMessage: false,
  messagePayload: {}
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONNECT_LAZADA_START]: connectLazadaStart,
  [Types.CONNECT_LAZADA_SUCCESS]: connectLazadaSuccess,
  [Types.CONNECT_LAZADA_FAILURE]: connectLazadaFailure,
  [Types.CONNECT_SENDO_START]: connectSendoStart,
  [Types.CONNECT_SENDO_SUCCESS]: connectSendoSuccess,
  [Types.CONNECT_SENDO_FAILURE]: connectSendoFailure,
  [Types.DISCONNECT_STORE_START]: disconnectStoreStart,
  [Types.DISCONNECT_STORE_SUCCESS]: disconnectStoreSuccess,
  [Types.DISCONNECT_STORE_FAILURE]: disconnectStoreFailure,
  [Types.GET_STORES_START] : getStoresStart,
  [Types.GET_STORES_SUCCESS] : getStoresSuccess,
  [Types.GET_STORES_FAILURE] : getStoresFailure,
  [Types.ADD_PLATFORM_CREDENTIALS] : addPlatformCredentials,
  [Types.SYNC_DATA_START] : syncDataStart,
  [Types.SYNC_DATA_SUCCESS] : syncDataSuccess,
  [Types.SYNC_DATA_FAILURE] : syncDataFailure,
  [Types.AUTO_LINK_DATA_START] : autoLinkDataStart,
  [Types.AUTO_LINK_DATA_SUCCESS] : autoLinkDataSuccess,
  [Types.AUTO_LINK_DATA_FAILURE] : autoLinkDataFailure,
  [Types.REFRESH_ALL_TOKEN_START] : refreshAllTokenStart,
  [Types.REFRESH_ALL_TOKEN_SUCCESS] : refreshAllTokenSuccess,
  [Types.REFRESH_ALL_TOKEN_FAILURE] : refreshAllTokenFailure,
  [Types.CREATE_MULTI_PLATFORM_PRODUCT_START] : createMultiPlatformProductStart,
  [Types.CREATE_MULTI_PLATFORM_PRODUCT_SUCCESS] : createMultiPlatformProductSuccess,
  [Types.CREATE_MULTI_PLATFORM_PRODUCT_FAILURE] : createMultiPlatformProductFailure,
  [Types.HIDE_MESSAGE] : hideMessage,
})
