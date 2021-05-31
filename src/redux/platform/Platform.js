import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getPlatformProductStart: ['payload'],
  getPlatformProductSuccess: ['payload'],
  getPlatformProductFailure: ['payload'],
  getLazadaProductSuccess: [],
  getSendoProductSuccess: [],
  linkDataStart: ['payload'],
  linkDataSuccess: ['payload'],
  linkDataFailure: ['payload'],
  unlinkDataStart: ['payload'],
  unlinkDataSuccess: ['payload'],
  unlinkDataFailure: ['payload'],
})

export const PlatformTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  products: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */

const getPlatformProductStart = state => state.merge({
  isWorking: true
})

const getPlatformProductSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  products: payload
})

const getPlatformProductFailure = state => state.merge({
  isWorking: false,
})

const getLazadaProductSuccess = state => state
const getSendoProductSuccess = state => state

const linkDataStart = state => state.merge({
  isWorking: true,
})

const linkDataSuccess = (state, { payload }) => {
  state = state.update('products', products => {
    if(payload.productId) {
      return products.map(pro => {
        if(pro._id === payload.productId) {
          pro.variants = pro.variants.map(variant => {
            if(variant._id === payload._id) {
              return {
                ...variant,
                linkedId: payload.linkedId,
                linkedDetails: payload.linkedDetails,
              }
            }
            return variant
          })
        }
        return pro
      })
    } else {
      return products.map(pro => {
        if(pro._id === payload._id) {
          return {
            ...pro,
            linkedId: payload.linkedId,
            linkedDetails: payload.linkedDetails,
          }
        }
        return pro
      })
    }
  })

  return state.merge({
    isWorking: false,
  })
}

const linkDataFailure = state => state.merge({
  isWorking: false,
})

const unlinkDataStart = state => state.merge({
  isWorking: true,
})

const unlinkDataSuccess = (state, { payload }) => {
  state = state.update('products', products => {
    if(payload.productId) {
      return products.map(pro => {
        if(pro._id === payload.productId) {
          pro.variants = pro.variants.map(variant => {
            if(variant._id === payload._id) {
              return {
                ...variant,
                linkedId: null,
                linkedDetails: null,
              }
            }
            return variant
          })
        }
        return pro
      })
    } else {
      return products.map(pro => {
        if(pro._id === payload._id) {
          return {
            ...pro,
            linkedId: null,
            linkedDetails: null,
          }
        }
        return pro
      })
    }
  })

  return state.merge({
    isWorking: false,
  })
}

const unlinkDataFailure = state => state.merge({
  isWorking: false,
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PLATFORM_PRODUCT_START]: getPlatformProductStart,
  [Types.GET_PLATFORM_PRODUCT_SUCCESS]: getPlatformProductSuccess,
  [Types.GET_PLATFORM_PRODUCT_FAILURE]: getPlatformProductFailure,
  [Types.GET_LAZADA_PRODUCT_SUCCESS]: getSendoProductSuccess,
  [Types.GET_SENDO_PRODUCT_SUCCESS]: getLazadaProductSuccess,
  [Types.LINK_DATA_START] : linkDataStart,
  [Types.LINK_DATA_SUCCESS] : linkDataSuccess,
  [Types.LINK_DATA_FAILURE] : linkDataFailure,
  [Types.UNLINK_DATA_START] : unlinkDataStart,
  [Types.UNLINK_DATA_SUCCESS] : unlinkDataSuccess,
  [Types.UNLINK_DATA_FAILURE] : unlinkDataFailure,
})
