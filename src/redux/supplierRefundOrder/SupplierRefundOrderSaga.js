import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { SupplierRefundOrderTypes } from './SupplierRefundOrder'
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
    const result = yield request.post(`/supplier-refund-orders/receipt/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Nhập kho thành công !'})
      console.log(result.data)
      yield put(Creators.createSupplierRefundReceiptSuccess(result.data))
    }
  } catch(e) {
    console.log("Create refund order failure: ", e.message)
    toast({ type: 'error', message: 'Nhập kho thất bại !'})
    yield put(Creators.createSupplierRefundReceiptFailure())
  } finally {
    NProgress.done()
  }
}

export function* createSupplierRefundOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/supplier-refund-orders', payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo đơn hoàn hàng mới thành công !'})
      console.log(result.data)
      yield put(Creators.createSupplierRefundOrderSuccess(result.data))
      yield put(push(`/app/products/supplier_refund_orders/${result.data._id}`))
    }
  } catch(e) {
    console.log("Create refund order failure: ", e.message)
    toast({ type: 'error', message: 'Tạo đơn hoàn hàng mới thất bại !'})
    yield put(Creators.createSupplierRefundOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* getSupplierRefundOrdersProcess() {
  NProgress.start()
  try { 
    const result = yield request.get('/supplier-refund-orders')
    console.log(result)
    if(result.code === 200) {
      yield put(Creators.getSupplierRefundOrdersSuccess(result.data))
    }
  } catch(e) {
    console.log("Get refund order failure: ", e.message)
    toast({ type: 'error', message: 'Lấy đơn hoàn hàng mới thất bại !'})
    yield put(Creators.getSupplierRefundOrdersFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmPaymentProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/supplier-refund-orders/payment/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận thanh toán thành công !'})
      yield put(Creators.confirmSupplierRefundPaymentSuccess(result.data))
    }
  } catch(e) {
    console.log("Get refund order failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận thanh toán thất bại !'})
    yield put(Creators.confirmSupplierRefundPaymentFailure())
  } finally {
    NProgress.done()
  }
}

export function* cancelSupplierRefundOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.get(`/supplier-refund-orders/cancel/${payload._id}`)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Hủy đơn hàng thành công !'})
      yield put(Creators.cancelSupplierRefundOrderSuccess(result.data))
    }
  } catch(e) {
    console.log("Cancel order failure: ", e.message)
    toast({ type: 'error', message: 'Hủy đơn hàng thất bại !'})
    yield put(Creators.cancelSupplierRefundOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateSupplierRefundOrderStart() {
  yield takeLatest(SupplierRefundOrderTypes.CREATE_SUPPLIER_REFUND_ORDER_START, createSupplierRefundOrderProcess);
}

export function* onCreateReceiptStart() {
  yield takeLatest(SupplierRefundOrderTypes.CREATE_SUPPLIER_REFUND_RECEIPT_START, createReceiptProcess);
}

export function* onGetSupplierRefundOrdersStart() {
  yield takeLatest(SupplierRefundOrderTypes.GET_SUPPLIER_REFUND_ORDERS_START, getSupplierRefundOrdersProcess);
}

export function* onConfirmPaymentStart() {
  yield takeLatest(SupplierRefundOrderTypes.CONFIRM_SUPPLIER_REFUND_PAYMENT_START, confirmPaymentProcess);
}

export function* onCancelSupplierRefundOrderStart() {
  yield takeLatest(SupplierRefundOrderTypes.CANCEL_SUPPLIER_REFUND_ORDER_START, cancelSupplierRefundOrderProcess);
}

const supplierRefundOrderRootSagas = [
  call(onCreateSupplierRefundOrderStart),
  call(onCreateReceiptStart),
  call(onGetSupplierRefundOrdersStart),
  call(onConfirmPaymentStart),
  call(onCancelSupplierRefundOrderStart),
];

export default supplierRefundOrderRootSagas