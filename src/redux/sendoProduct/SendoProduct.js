import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getSendoProductsStart: ['payload'],
  getSendoProductsSuccess: ['payload'],
  getSendoProductsFailure: ['payload'],
  createSendoProductStart: ['payload'],
  createSendoProductSuccess: ['payload'],
  createSendoProductFailure: ['payload'],
  updateSendoProductStart: ['payload'],
  updateSendoProductSuccess: ['payload'],
  updateSendoProductFailure: ['payload'],
  deleteSendoProductStart: ['payload'],
  deleteSendoProductSuccess: ['payload'],
  deleteSendoProductFailure: ['payload'],
})

export const SendoProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  products: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const getSendoProductsStart = state => state.merge({
  isWorking: true
})

const getSendoProductsSuccess = (state, { payload }) => {
  // state = state.update('products', products => products.concat(payload))

  return state.merge({
    isWorking: false,
    products: payload
  })
}

const getSendoProductsFailure = state => state.merge({
  isWorking: false
})

const createSendoProductStart = state => state.merge({
  isWorking: true
})

const createSendoProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.concat(payload))
  return state.merge({
    isWorking: false
  })
}

const createSendoProductFailure = state => state.merge({
  isWorking: false
})

const updateSendoProductStart = state => state.merge({
  isWorking: true
})

const updateSendoProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.map(i => {
    if (i._id === payload) {
      return payload
    }
    return i
  }))

  return state.merge({
    isWorking: false
  })
}

const updateSendoProductFailure = state => state.merge({
  isWorking: false
})

const deleteSendoProductStart = state => state.merge({
  isWorking: true
})

const deleteSendoProductSuccess = (state, { payload }) => {
  fstate = state.update('products', products => products.filter(i => i._id !== payload._id))

  return state.merge({
    isWorking: false
  })
}

const deleteSendoProductFailure = state => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_SENDO_PRODUCTS_START]: getSendoProductsStart,
  [Types.GET_SENDO_PRODUCTS_SUCCESS]: getSendoProductsSuccess,
  [Types.GET_SENDO_PRODUCTS_FAILURE]: getSendoProductsFailure,
  [Types.CREATE_SENDO_PRODUCT_START]: createSendoProductStart,
  [Types.CREATE_SENDO_PRODUCT_SUCCESS]: createSendoProductSuccess,
  [Types.CREATE_SENDO_PRODUCT_FAILURE]: createSendoProductFailure,
  [Types.UPDATE_SENDO_PRODUCT_START]: updateSendoProductStart,
  [Types.UPDATE_SENDO_PRODUCT_SUCCESS]: updateSendoProductSuccess,
  [Types.UPDATE_SENDO_PRODUCT_FAILURE]: updateSendoProductFailure,
  [Types.DELETE_SENDO_PRODUCT_START]: deleteSendoProductStart,
  [Types.DELETE_SENDO_PRODUCT_SUCCESS]: deleteSendoProductSuccess,
  [Types.DELETE_SENDO_PRODUCT_FAILURE]: deleteSendoProductFailure,
})
