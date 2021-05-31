import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createRefundOrderStart: ['payload'],
  createRefundOrderSuccess: ['payload'],
  createRefundOrderFailure: ['payload'],
  createRefundReceiptStart: ['payload'],
  createRefundReceiptSuccess: ['payload'],
  createRefundReceiptFailure: ['payload'],
  getRefundOrdersStart: [],
  getRefundOrdersSuccess: ['payload'],
  getRefundOrdersFailure: ['payload'],
  confirmRefundPaymentStart: ['payload'],
  confirmRefundPaymentSuccess: ['payload'],
  confirmRefundPaymentFailure: ['payload'],
  cancelRefundOrderStart: ['payload'],
  cancelRefundOrderSuccess: ['payload'],
  cancelRefundOrderFailure: ['payload'],
})

export const RefundOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  refundOrders: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const createRefundOrderStart = state => state.merge({
  isWorking: true
})

const createRefundOrderSuccess = (state, { payload }) => {
  state.update("refundOrders", refundOrders => refundOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const createRefundOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createRefundReceiptStart = state => state.merge({
  isWorking: true
})

const createRefundReceiptSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createRefundReceiptFailure = (state, { payload }) => {
  state = state.update('refundOrders', refundOrders => refundOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const getRefundOrdersStart = state => state.merge({
  isWorking: true
})

const getRefundOrdersSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  refundOrders: payload
})

const getRefundOrdersFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmRefundPaymentStart = state => state.merge({
  isWorking: true
})

const confirmRefundPaymentSuccess = (state, { payload }) => {
  state = state.update('refundOrders', refundOrders => refundOrders.map(i => {
    if (i._id === payload) {
      return payload
    }
    return i
  }))

  return state.merge({
    isWorking: false
  })
}

const confirmRefundPaymentFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const cancelRefundOrderStart = (state) => state.merge({
  isWorking: true
})

const cancelRefundOrderSuccess = (state) => state.merge({
  isWorking: false
})

const cancelRefundOrderFailure = (state) => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_REFUND_ORDER_START]: createRefundOrderStart,
  [Types.CREATE_REFUND_ORDER_SUCCESS]: createRefundOrderSuccess,
  [Types.CREATE_REFUND_ORDER_FAILURE]: createRefundOrderFailure,
  [Types.CREATE_REFUND_RECEIPT_START]: createRefundReceiptStart,
  [Types.CREATE_REFUND_RECEIPT_SUCCESS]: createRefundReceiptSuccess,
  [Types.CREATE_REFUND_RECEIPT_FAILURE]: createRefundReceiptFailure,
  [Types.GET_REFUND_ORDERS_START]: getRefundOrdersStart,
  [Types.GET_REFUND_ORDERS_SUCCESS]: getRefundOrdersSuccess,
  [Types.GET_REFUND_ORDERS_FAILURE]: getRefundOrdersFailure,
  [Types.CONFIRM_REFUND_PAYMENT_START]: confirmRefundPaymentStart,
  [Types.CONFIRM_REFUND_PAYMENT_SUCCESS]: confirmRefundPaymentSuccess,
  [Types.CONFIRM_REFUND_PAYMENT_FAILURE]: confirmRefundPaymentFailure,
  [Types.CANCEL_REFUND_ORDER_START]: cancelRefundOrderStart,
  [Types.CANCEL_REFUND_ORDER_SUCCESS]: cancelRefundOrderSuccess,
  [Types.CANCEL_REFUND_ORDER_FAILURE]: cancelRefundOrderFailure,
})
