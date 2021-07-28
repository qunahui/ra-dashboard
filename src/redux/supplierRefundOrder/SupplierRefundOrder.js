import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createSupplierRefundOrderStart: ['payload'],
  createSupplierRefundOrderSuccess: ['payload'],
  createSupplierRefundOrderFailure: ['payload'],
  createSupplierRefundReceiptStart: ['payload'],
  createSupplierRefundReceiptSuccess: ['payload'],
  createSupplierRefundReceiptFailure: ['payload'],
  getSupplierRefundOrdersStart: ['payload'],
  getSupplierRefundOrdersSuccess: ['payload'],
  getSupplierRefundOrdersFailure: ['payload'],
  confirmSupplierRefundPaymentStart: ['payload'],
  confirmSupplierRefundPaymentSuccess: ['payload'],
  confirmSupplierRefundPaymentFailure: ['payload'],
  cancelSupplierRefundOrderStart: ['payload'],
  cancelSupplierRefundOrderSuccess: ['payload'],
  cancelSupplierRefundOrderFailure: ['payload'],
})

export const SupplierRefundOrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  refundOrders: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const createSupplierRefundOrderStart = state => state.merge({
  isWorking: true
})

const createSupplierRefundOrderSuccess = (state, { payload }) => {
  state.update("refundOrders", refundOrders => refundOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const createSupplierRefundOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createSupplierRefundReceiptStart = state => state.merge({
  isWorking: true
})

const createSupplierRefundReceiptSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createSupplierRefundReceiptFailure = (state, { payload }) => {
  state = state.update('refundOrders', refundOrders => refundOrders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const getSupplierRefundOrdersStart = state => state.merge({
  isWorking: true
})

const getSupplierRefundOrdersSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  refundOrders: payload
})

const getSupplierRefundOrdersFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmSupplierRefundPaymentStart = state => state.merge({
  isWorking: true
})

const confirmSupplierRefundPaymentSuccess = (state, { payload }) => {
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

const confirmSupplierRefundPaymentFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const cancelSupplierRefundOrderStart = (state) => state.merge({
  isWorking: true
})

const cancelSupplierRefundOrderSuccess = (state) => state.merge({
  isWorking: false
})

const cancelSupplierRefundOrderFailure = (state) => state.merge({
  isWorking: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_SUPPLIER_REFUND_ORDER_START]: createSupplierRefundOrderStart,
  [Types.CREATE_SUPPLIER_REFUND_ORDER_SUCCESS]: createSupplierRefundOrderSuccess,
  [Types.CREATE_SUPPLIER_REFUND_ORDER_FAILURE]: createSupplierRefundOrderFailure,
  [Types.CREATE_SUPPLIER_REFUND_RECEIPT_START]: createSupplierRefundReceiptStart,
  [Types.CREATE_SUPPLIER_REFUND_RECEIPT_SUCCESS]: createSupplierRefundReceiptSuccess,
  [Types.CREATE_SUPPLIER_REFUND_RECEIPT_FAILURE]: createSupplierRefundReceiptFailure,
  [Types.GET_SUPPLIER_REFUND_ORDERS_START]: getSupplierRefundOrdersStart,
  [Types.GET_SUPPLIER_REFUND_ORDERS_SUCCESS]: getSupplierRefundOrdersSuccess,
  [Types.GET_SUPPLIER_REFUND_ORDERS_FAILURE]: getSupplierRefundOrdersFailure,
  [Types.CONFIRM_SUPPLIER_REFUND_PAYMENT_START]: confirmSupplierRefundPaymentStart,
  [Types.CONFIRM_SUPPLIER_REFUND_PAYMENT_SUCCESS]: confirmSupplierRefundPaymentSuccess,
  [Types.CONFIRM_SUPPLIER_REFUND_PAYMENT_FAILURE]: confirmSupplierRefundPaymentFailure,
  [Types.CANCEL_SUPPLIER_REFUND_ORDER_START]: cancelSupplierRefundOrderStart,
  [Types.CANCEL_SUPPLIER_REFUND_ORDER_SUCCESS]: cancelSupplierRefundOrderSuccess,
  [Types.CANCEL_SUPPLIER_REFUND_ORDER_FAILURE]: cancelSupplierRefundOrderFailure,
})
