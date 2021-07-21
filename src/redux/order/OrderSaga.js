import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import qs from 'qs'
import { request, setToken } from '../../config/axios'
import Creators, { OrderTypes } from './Order'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export const getAllCredsToken = (state) => {
  const { storage } = state.app.toJS()

  return [ ...storage.sendoCredentials, ...storage.lazadaCredentials ]
}

export function* createOrderReceiptProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/orders/receipt/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xuất kho thành công !'})
      console.log(result.data)
      yield put(Creators.createOrderReceiptSuccess(result.data))
    }
  } catch(e) {
    console.log("Create purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Xuất kho thất bại !'})
    yield put(Creators.createOrderReceiptFailure())
  } finally {
    NProgress.done()
  }
}

export function* createOrderPackagingProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/orders/pack/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Đóng gói thành công !'})
      console.log(result.data)
      yield put(Creators.createOrderPackagingSuccess(result.data))
    }
  } catch(e) {
    console.log("Create purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Đóng gói thất bại !'})
    yield put(Creators.createOrderPackagingFailure())
  } finally {
    NProgress.done()
  }
}

export function* createOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/orders', payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo đơn hàng mới thành công !'})
      console.log(result.data)
      yield put(Creators.createOrderSuccess(result.data))
      yield put(push(`/app/orders/${result.data._id}`))
    }
  } catch(e) {
    console.log("Create purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Tạo đơn hàng mới thất bại !'})
    yield put(Creators.createOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* cancelOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.get(`/orders/cancel/${payload._id}`)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Hủy đơn hàng thành công !'})
      yield put(Creators.cancelOrderSuccess(result.data))
    }
  } catch(e) {
    console.log("Cancel order failure: ", e.message)
    toast({ type: 'error', message: 'Hủy đơn hàng thất bại !'})
    yield put(Creators.cancelOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* getOrdersProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.get('/orders', {
      params: {
        ...payload,
      },
      paramsSerializer: params => {
        return qs.stringify(params)
      } 
    })
    console.log(result)
    if(result.code === 200) {
      yield put(Creators.getOrdersSuccess(result.data))
    }
  } catch(e) {
    console.log("Get purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Lấy đơn hàng mới thất bại !'})
    yield put(Creators.getOrdersFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmPaymentProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/orders/payment/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận thanh toán thành công !'})
      yield put(Creators.confirmOrderPaymentSuccess(result.data))
    }
  } catch(e) {
    console.log("Get order failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận thanh toán thất bại !'})
    yield put(Creators.confirmOrderPaymentFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmDeliveryProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/orders/delivery/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận giao hàng thành công !'})
      yield put(Creators.confirmOrderDeliverySuccess(result.data))
    }
  } catch(e) {
    console.log("confirm delivery failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận giao hàng thất bại !'})
    yield put(Creators.confirmOrderDeliveryFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmPlatformOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const allCred = yield select(getAllCredsToken)
    const matchedCred = allCred.find(i => i.store_id === payload.store_id)
    const result = yield request({
      method: 'POST',
      url: `/orders/confirm-platform-order`,
      headers: {
        'Platform-Token': matchedCred.access_token
      },
      data: {
        order: payload
      }
    })

    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận còn hàng thành công !'})
      yield put(Creators.confirmPlatformOrderSuccess())
    }
  } catch(e) {
    console.log("confirm platform order failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận còn hàng thất bại !'})
    yield put(Creators.confirmOrderDeliveryFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateOrderStart() {
  yield takeLatest(OrderTypes.CREATE_ORDER_START, createOrderProcess);
}

export function* onCreateOrderReceiptStart() {
  yield takeLatest(OrderTypes.CREATE_ORDER_RECEIPT_START, createOrderReceiptProcess);
}

export function* onCreateOrderPackagingStart() {
  yield takeLatest(OrderTypes.CREATE_ORDER_PACKAGING_START, createOrderPackagingProcess);
}

export function* onGetOrdersStart() {
  yield takeLatest(OrderTypes.GET_ORDERS_START, getOrdersProcess);
}

export function* onConfirmOrderPaymentStart() {
  yield takeLatest(OrderTypes.CONFIRM_ORDER_PAYMENT_START, confirmPaymentProcess);
}

export function* onConfirmDeliveryStart() {
  yield takeLatest(OrderTypes.CONFIRM_ORDER_DELIVERY_START, confirmDeliveryProcess);
}

export function* onCancelOrderStart() {
  yield takeLatest(OrderTypes.CANCEL_ORDER_START, cancelOrderProcess);
}

export function* onConfirmPlatformOrderStart() {
  yield takeLatest(OrderTypes.CONFIRM_PLATFORM_ORDER_START, confirmPlatformOrderProcess);
}

const orderRootSagas = [
  call(onCreateOrderStart),
  call(onCreateOrderReceiptStart),
  call(onCreateOrderPackagingStart),
  call(onGetOrdersStart),
  call(onCancelOrderStart),
  call(onConfirmOrderPaymentStart),
  call(onConfirmDeliveryStart),
  call(onConfirmPlatformOrderStart),
];

export default orderRootSagas