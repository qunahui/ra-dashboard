import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createPurchaseOrderStart: ['payload'],
  createPurchaseOrderSuccess: ['payload'],
  createPurchaseOrderFailure: ['payload'],
  createPurchaseReceiptStart: ['payload'],
  createPurchaseReceiptSuccess: ['payload'],
  createPurchaseReceiptFailure: ['payload'],
  getPurchaseOrdersStart: [],
  getPurchaseOrdersSuccess: ['payload'],
  getPurchaseOrdersFailure: ['payload'],
  confirmPurchasePaymentStart: ['payload'],
  confirmPurchasePaymentSuccess: ['payload'],
  confirmPurchasePaymentFailure: ['payload'],
  cancelPurchaseOrderStart: ['payload'],
  cancelPurchaseOrderSuccess: ['payload'],
  cancelPurchaseOrderFailure: ['payload'],
})

export const PurchaseOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  purchaseOrders: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const createPurchaseOrderStart = state => state.merge({
  isWorking: true
})

const createPurchaseOrderSuccess = (state, { payload }) => {
  state.update("purchaseOrders", purchaseOrders => purchaseOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const createPurchaseOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createPurchaseReceiptStart = state => state.merge({
  isWorking: true
})

const createPurchaseReceiptSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createPurchaseReceiptFailure = (state, { payload }) => {
  state = state.update('purchaseOrders', purchaseOrders => purchaseOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const getPurchaseOrdersStart = state => state.merge({
  isWorking: true
})

const getPurchaseOrdersSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  purchaseOrders: payload
})

const getPurchaseOrdersFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmPurchasePaymentStart = state => state.merge({
  isWorking: true
})

const confirmPurchasePaymentSuccess = (state, { payload }) => {
  state = state.update('purchaseOrders', purchaseOrders => purchaseOrders.map(i => {
    if (i._id === payload) {
      return payload
    }
    return i
  }))

  return state.merge({
    isWorking: false
  })
}

const confirmPurchasePaymentFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const cancelPurchaseOrderStart = (state) => state.merge({
  isWorking: true
})

const cancelPurchaseOrderSuccess = (state) => state.merge({
  isWorking: false
})

const cancelPurchaseOrderFailure = (state) => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_PURCHASE_ORDER_START]: createPurchaseOrderStart,
  [Types.CREATE_PURCHASE_ORDER_SUCCESS]: createPurchaseOrderSuccess,
  [Types.CREATE_PURCHASE_ORDER_FAILURE]: createPurchaseOrderFailure,
  [Types.CREATE_PURCHASE_RECEIPT_START]: createPurchaseReceiptStart,
  [Types.CREATE_PURCHASE_RECEIPT_SUCCESS]: createPurchaseReceiptSuccess,
  [Types.CREATE_PURCHASE_RECEIPT_FAILURE]: createPurchaseReceiptFailure,
  [Types.GET_PURCHASE_ORDERS_START]: getPurchaseOrdersStart,
  [Types.GET_PURCHASE_ORDERS_SUCCESS]: getPurchaseOrdersSuccess,
  [Types.GET_PURCHASE_ORDERS_FAILURE]: getPurchaseOrdersFailure,
  [Types.CONFIRM_PURCHASE_PAYMENT_START]: confirmPurchasePaymentStart,
  [Types.CONFIRM_PURCHASE_PAYMENT_SUCCESS]: confirmPurchasePaymentSuccess,
  [Types.CONFIRM_PURCHASE_PAYMENT_FAILURE]: confirmPurchasePaymentFailure,
  [Types.CANCEL_PURCHASE_ORDER_START]: cancelPurchaseOrderStart,
  [Types.CANCEL_PURCHASE_ORDER_SUCCESS]: cancelPurchaseOrderSuccess,
  [Types.CANCEL_PURCHASE_ORDER_FAILURE]: cancelPurchaseOrderFailure,
})
