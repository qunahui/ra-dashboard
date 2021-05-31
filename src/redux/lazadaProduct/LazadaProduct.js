import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getLazadaProductsStart: ['payload'],
  getLazadaProductsSuccess: ['payload'],
  getLazadaProductsFailure: ['payload'],
  createLazadaProductStart: ['payload'],
  createLazadaProductSuccess: ['payload'],
  createLazadaProductFailure: ['payload'],
  updateLazadaProductStart: ['payload'],
  updateLazadaProductSuccess: ['payload'],
  updateLazadaProductFailure: ['payload'],
  deleteLazadaProductStart: ['payload'],
  deleteLazadaProductSuccess: ['payload'],
  deleteLazadaProductFailure: ['payload'],
})

export const LazadaProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  products: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const getLazadaProductsStart = state => state.merge({
  isWorking: true
})

const getLazadaProductsSuccess = (state, { payload }) => {
  // state = state.update('products', products => products.concat(payload))

  return state.merge({
    isWorking: false,
    products: payload
  })
}

const getLazadaProductsFailure = state => state.merge({
  isWorking: false
})

const createLazadaProductStart = state => state.merge({
  isWorking: true
})

const createLazadaProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.concat(payload))
  return state.merge({
    isWorking: false
  })
}

const createLazadaProductFailure = state => state.merge({
  isWorking: false
})

const updateLazadaProductStart = state => state.merge({
  isWorking: true
})

const updateLazadaProductSuccess = (state, { payload }) => {
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

const updateLazadaProductFailure = state => state.merge({
  isWorking: false
})

const deleteLazadaProductStart = state => state.merge({
  isWorking: true
})

const deleteLazadaProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.filter(i => i._id !== payload._id))

  return state.merge({
    isWorking: false
  })
}

const deleteLazadaProductFailure = state => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LAZADA_PRODUCTS_START]: getLazadaProductsStart,
  [Types.GET_LAZADA_PRODUCTS_SUCCESS]: getLazadaProductsSuccess,
  [Types.GET_LAZADA_PRODUCTS_FAILURE]: getLazadaProductsFailure,
  [Types.CREATE_LAZADA_PRODUCT_START]: createLazadaProductStart,
  [Types.CREATE_LAZADA_PRODUCT_SUCCESS]: createLazadaProductSuccess,
  [Types.CREATE_LAZADA_PRODUCT_FAILURE]: createLazadaProductFailure,
  [Types.UPDATE_LAZADA_PRODUCT_START]: updateLazadaProductStart,
  [Types.UPDATE_LAZADA_PRODUCT_SUCCESS]: updateLazadaProductSuccess,
  [Types.UPDATE_LAZADA_PRODUCT_FAILURE]: updateLazadaProductFailure,
  [Types.DELETE_LAZADA_PRODUCT_START]: deleteLazadaProductStart,
  [Types.DELETE_LAZADA_PRODUCT_SUCCESS]: deleteLazadaProductSuccess,
  [Types.DELETE_LAZADA_PRODUCT_FAILURE]: deleteLazadaProductFailure,
})
