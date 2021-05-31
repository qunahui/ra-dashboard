import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createOrderStart: ['payload'],
  createOrderSuccess: ['payload'],
  createOrderFailure: ['payload'],
  createOrderReceiptStart: ['payload'],
  createOrderReceiptSuccess: ['payload'],
  createOrderReceiptFailure: ['payload'],
  createOrderPackagingStart: ['payload'],
  createOrderPackagingSuccess: ['payload'],
  createOrderPackagingFailure: ['payload'],
  getOrdersStart: [],
  getOrdersSuccess: ['payload'],
  getOrdersFailure: ['payload'],
  confirmPlatformOrderStart: ['payload'], //xac nhan con hang
  confirmPlatformOrderSuccess: ['payload'], //xac nhan con hang
  confirmPlatformOrderFailure: ['payload'], //xac nhan con hang
  confirmOrderPaymentStart: ['payload'],
  confirmOrderPaymentSuccess: ['payload'],
  confirmOrderPaymentFailure: ['payload'],
  confirmOrderDeliveryStart: ['payload'],
  confirmOrderDeliverySuccess: ['payload'],
  confirmOrderDeliveryFailure: ['payload'],
  cancelOrderStart: ['payload'],
  cancelOrderSuccess: ['payload'],
  cancelOrderFailure: ['payload'],
})

export const OrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  orders: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const createOrderStart = state => state.merge({
  isWorking: true
})

const createOrderSuccess = (state, { payload }) => {
  state.update("orders", orders => orders.concat(payload))

  return state.merge({
    isWorking: false,
  })
}

const createOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createOrderReceiptStart = state => state.merge({
  isWorking: true
})

const createOrderReceiptSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createOrderReceiptFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const createOrderPackagingStart = state => state.merge({
  isWorking: true
})

const createOrderPackagingSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const createOrderPackagingFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const getOrdersStart = state => state.merge({
  isWorking: true
})

const getOrdersSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  orders: payload
})

const getOrdersFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmOrderPaymentStart = state => state.merge({
  isWorking: true
})

const confirmOrderPaymentSuccess = (state, { payload }) => {
  state = state.update('orders', orders => orders.map(i => {
    if (i._id === payload) {
      return payload
    }
    return i
  }))

  return state.merge({
    isWorking: false
  })
}

const confirmOrderPaymentFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmOrderDeliveryStart = state => state.merge({
  isWorking: true
})

const confirmOrderDeliverySuccess = (state, { payload }) => {
  // state = state.update('orders', orders => orders.map(i => {
  //   if (i._id === payload) {
  //     return payload
  //   }
  //   return i
  // }))

  return state.merge({
    isWorking: false
  })
}

const confirmOrderDeliveryFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const confirmPlatformOrderStart = state => state.merge({
  isWorking: true
})

const confirmPlatformOrderSuccess = (state, { payload }) => {
  return state.merge({
    isWorking: false
  })
}

const confirmPlatformOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const cancelOrderStart = (state, { payload }) => state.merge({
  isWorking: true,
})

const cancelOrderSuccess = (state, { payload }) => state.merge({
  isWorking: false,
})

const cancelOrderFailure = (state, { payload }) => state.merge({
  isWorking: false,
})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_ORDER_START]: createOrderStart,
  [Types.CREATE_ORDER_SUCCESS]: createOrderSuccess,
  [Types.CREATE_ORDER_FAILURE]: createOrderFailure,
  [Types.CREATE_ORDER_RECEIPT_START]: createOrderReceiptStart,
  [Types.CREATE_ORDER_RECEIPT_SUCCESS]: createOrderReceiptSuccess,
  [Types.CREATE_ORDER_RECEIPT_FAILURE]: createOrderReceiptFailure,
  [Types.CREATE_ORDER_PACKAGING_START]: createOrderPackagingStart,
  [Types.CREATE_ORDER_PACKAGING_SUCCESS]: createOrderPackagingSuccess,
  [Types.CREATE_ORDER_PACKAGING_FAILURE]: createOrderPackagingFailure,
  [Types.GET_ORDERS_START]: getOrdersStart,
  [Types.GET_ORDERS_SUCCESS]: getOrdersSuccess,
  [Types.GET_ORDERS_FAILURE]: getOrdersFailure,
  [Types.CONFIRM_ORDER_PAYMENT_START]: confirmOrderPaymentStart,
  [Types.CONFIRM_ORDER_PAYMENT_SUCCESS]: confirmOrderPaymentSuccess,
  [Types.CONFIRM_ORDER_PAYMENT_FAILURE]: confirmOrderPaymentFailure,
  [Types.CONFIRM_ORDER_DELIVERY_START]: confirmOrderDeliveryStart,
  [Types.CONFIRM_ORDER_DELIVERY_SUCCESS]: confirmOrderDeliverySuccess,
  [Types.CONFIRM_ORDER_DELIVERY_FAILURE]: confirmOrderDeliveryFailure,
  [Types.CONFIRM_PLATFORM_ORDER_START]: confirmPlatformOrderStart,
  [Types.CONFIRM_PLATFORM_ORDER_SUCCESS]: confirmPlatformOrderSuccess,
  [Types.CONFIRM_PLATFORM_ORDER_FAILURE]: confirmPlatformOrderFailure,
  [Types.CANCEL_ORDER_START]: cancelOrderStart,
  [Types.CANCEL_ORDER_SUCCESS]: cancelOrderSuccess,
  [Types.CANCEL_ORDER_FAILURE]: cancelOrderFailure,
})
