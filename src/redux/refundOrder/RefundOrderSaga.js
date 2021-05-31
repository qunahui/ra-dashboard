import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { RefundOrderTypes } from './RefundOrder'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* createReceiptProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/refund-orders/receipt/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xuất kho thành công !'})
      console.log(result.data)
      yield put(Creators.createRefundReceiptSuccess(result.data))
    }
  } catch(e) {
    console.log("Create refund order failure: ", e.message)
    toast({ type: 'error', message: 'Xuất kho thất bại !'})
    yield put(Creators.createRefundReceiptFailure())
  } finally {
    NProgress.done()
  }
}

export function* createRefundOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/refund-orders', payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo đơn hoàn hàng mới thành công !'})
      console.log(result.data)
      yield put(Creators.createRefundOrderSuccess(result.data))
      yield put(push(`/app/refund_orders/${result.data._id}`))
    }
  } catch(e) {
    console.log("Create refund order failure: ", e.message)
    toast({ type: 'error', message: 'Tạo đơn hoàn hàng mới thất bại !'})
    yield put(Creators.createRefundOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* getRefundOrdersProcess() {
  NProgress.start()
  try { 
    const result = yield request.get('/refund-orders')
    console.log(result)
    if(result.code === 200) {
      yield put(Creators.getRefundOrdersSuccess(result.data))
    }
  } catch(e) {
    console.log("Get refund order failure: ", e.message)
    toast({ type: 'error', message: 'Lấy đơn hoàn hàng mới thất bại !'})
    yield put(Creators.getRefundOrdersFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmPaymentProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/refund-orders/payment/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận thanh toán thành công !'})
      yield put(Creators.confirmRefundPaymentSuccess(result.data))
    }
  } catch(e) {
    console.log("Get refund order failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận thanh toán thất bại !'})
    yield put(Creators.confirmRefundPaymentFailure())
  } finally {
    NProgress.done()
  }
}

export function* cancelRefundOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.get(`/refund-orders/cancel/${payload._id}`)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Hủy đơn hàng thành công !'})
      yield put(Creators.cancelRefundOrderSuccess(result.data))
    }
  } catch(e) {
    console.log("Cancel order failure: ", e.message)
    toast({ type: 'error', message: 'Hủy đơn hàng thất bại !'})
    yield put(Creators.cancelRefundOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateRefundOrderStart() {
  yield takeLatest(RefundOrderTypes.CREATE_REFUND_ORDER_START, createRefundOrderProcess);
}

export function* onCreateReceiptStart() {
  yield takeLatest(RefundOrderTypes.CREATE_REFUND_RECEIPT_START, createReceiptProcess);
}

export function* onGetRefundOrdersStart() {
  yield takeLatest(RefundOrderTypes.GET_REFUND_ORDERS_START, getRefundOrdersProcess);
}

export function* onConfirmPaymentStart() {
  yield takeLatest(RefundOrderTypes.CONFIRM_REFUND_PAYMENT_START, confirmPaymentProcess);
}

export function* onCancelRefundOrderStart() {
  yield takeLatest(RefundOrderTypes.CANCEL_REFUND_ORDER_START, cancelRefundOrderProcess);
}

const refundOrderRootSagas = [
  call(onCreateRefundOrderStart),
  call(onCreateReceiptStart),
  call(onGetRefundOrdersStart),
  call(onConfirmPaymentStart),
  call(onCancelRefundOrderStart),
];

export default refundOrderRootSagas