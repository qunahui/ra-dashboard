import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProductsStart: ['payload'],
  getProductsSuccess: ['payload'],
  getProductsFailure: ['payload'],
  createProductStart: ['payload'],
  createProductSuccess: ['payload'],
  createProductFailure: ['payload'],
  createProductFromPlatformStart: ['payload'],
  createProductFromPlatformSuccess: ['payload'],
  createProductFromPlatformFailure: ['payload'],
  createVariantStart: ['payload'],
  createVariantSuccess: ['payload'],
  createVariantFailure: ['payload'],
  updateProductStart: ['payload'],
  updateProductSuccess: ['payload'],
  updateProductFailure: ['payload'],
  updateVariantStart: ['payload'],
  updateVariantSuccess: ['payload'],
  updateVariantFailure: ['payload'],
  deleteProductStart: ['payload'],
  deleteProductSuccess: ['payload'],
  deleteProductFailure: ['payload'],
  deleteVariantStart: ['payload'],
  deleteVariantSuccess: ['payload'],
  deleteVariantFailure: ['payload'],
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  products: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const getProductsStart = state => state.merge({
  isWorking: true
})

const getProductsSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  products: payload
})

const getProductsFailure = state => state.merge({
  isWorking: false
})

const createProductStart = state => state.merge({
  isWorking: true
})

const createProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.concat(payload))
  return state.merge({
    isWorking: false
  })
}

const createProductFromPlatformStart = state => state.merge({
  isWorking: true
})

const createProductFromPlatformSuccess = (state, { payload }) => {
  isWorking: false
}

const createProductFromPlatformFailure = (state, { payload }) => {
  isWorking: false
}

const createVariantStart = state => state.merge({
  isWorking: true
})

const createVariantSuccess = (state, { payload }) => {
  // state = state.update('products', products => products.find(i => i._id === payload.productId).variants.concat(payload))
  return state.merge({
    isWorking: false
  })
}

const createVariantFailure = state => state.merge({
  isWorking: false
})

const createProductFailure = state => state.merge({
  isWorking: false
})

const updateProductStart = state => state.merge({
  isWorking: true
})

const updateProductSuccess = (state, { payload }) => {
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

const updateProductFailure = state => state.merge({
  isWorking: false
})

const updateVariantStart = state => state.merge({ 
  isWorking: true
})

const updateVariantSuccess = state => state.merge({ 
  isWorking: false
})

const updateVariantFailure = state => state.merge({ 
  isWorking: false
})

const deleteProductStart = state => state.merge({
  isWorking: true
})

const deleteProductSuccess = (state, { payload }) => {
  state = state.update('products', products => products.filter(i => i._id !== payload._id))

  return state.merge({
    isWorking: false
  })
}

const deleteProductFailure = state => state.merge({
  isWorking: false
})

const deleteVariantStart = state => state.merge({
  isWorking: true
})

const deleteVariantSuccess = (state, { payload }) => state.merge({
  isWorking: false
})

const deleteVariantFailure = state => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PRODUCTS_START]: getProductsStart,
  [Types.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [Types.GET_PRODUCTS_FAILURE]: getProductsFailure,
  [Types.CREATE_PRODUCT_START]: createProductStart,
  [Types.CREATE_PRODUCT_SUCCESS]: createProductSuccess,
  [Types.CREATE_PRODUCT_FROM_PLATFORM_START]: createProductFromPlatformStart,
  [Types.CREATE_PRODUCT_FROM_PLATFORM_SUCCESS]: createProductFromPlatformSuccess,
  [Types.CREATE_PRODUCT_FROM_PLATFORM_FAILURE]: createProductFromPlatformFailure,
  [Types.CREATE_VARIANT_START]: createVariantStart,
  [Types.CREATE_VARIANT_SUCCESS]: createVariantSuccess,
  [Types.CREATE_VARIANT_FAILURE]: createVariantFailure,
  [Types.UPDATE_PRODUCT_START]: updateProductStart,
  [Types.UPDATE_PRODUCT_SUCCESS]: updateProductSuccess,
  [Types.UPDATE_PRODUCT_FAILURE]: updateProductFailure,
  [Types.UPDATE_VARIANT_START]: updateVariantStart,
  [Types.UPDATE_VARIANT_SUCCESS]: updateVariantSuccess,
  [Types.UPDATE_VARIANT_FAILURE]: updateVariantFailure,
  [Types.DELETE_PRODUCT_START]: deleteProductStart,
  [Types.DELETE_PRODUCT_SUCCESS]: deleteProductSuccess,
  [Types.DELETE_PRODUCT_FAILURE]: deleteProductFailure,
  [Types.DELETE_VARIANT_START]: deleteVariantStart,
  [Types.DELETE_VARIANT_SUCCESS]: deleteVariantSuccess,
  [Types.DELETE_VARIANT_FAILURE]: deleteVariantFailure,
})
