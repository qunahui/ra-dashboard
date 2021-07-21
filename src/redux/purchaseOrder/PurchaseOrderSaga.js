import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { PurchaseOrderTypes } from './PurchaseOrder'
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
    const result = yield request.post(`/purchase-orders/receipt/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Nhập kho thành công !'})
      console.log(result.data)
      yield put(Creators.createPurchaseReceiptSuccess(result.data))
    }
  } catch(e) {
    console.log("Create purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Nhập kho thất bại !'})
    yield put(Creators.createPurchaseReceiptFailure())
  } finally {
    NProgress.done()
  }
}

export function* createPurchaseOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/purchase-orders', payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo đơn nhập hàng mới thành công !'})
      console.log(result.data)
      yield put(Creators.createPurchaseOrderSuccess(result.data))
      yield put(push(`/app/products/purchase_orders/${result.data._id}`))
    }
  } catch(e) {
    console.log("Create purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Tạo đơn nhập hàng mới thất bại !'})
    yield put(Creators.createPurchaseOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* getPurchaseOrdersProcess() {
  NProgress.start()
  try { 
    const result = yield request.get('/purchase-orders')
    console.log(result)
    if(result.code === 200) {
      yield put(Creators.getPurchaseOrdersSuccess(result.data))
    }
  } catch(e) {
    console.log("Get purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Lấy đơn nhập hàng mới thất bại !'})
    yield put(Creators.getPurchaseOrdersFailure())
  } finally {
    NProgress.done()
  }
}

export function* confirmPaymentProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post(`/purchase-orders/payment/${payload._id}`, payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xác nhận thanh toán thành công !'})
      yield put(Creators.confirmPurchasePaymentSuccess(result.data))
    }
  } catch(e) {
    console.log("Get purchase order failure: ", e.message)
    toast({ type: 'error', message: 'Xác nhận thanh toán thất bại !'})
    yield put(Creators.confirmPurchasePaymentFailure())
  } finally {
    NProgress.done()
  }
}

export function* cancelPurchaseOrderProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.get(`/purchase-orders/cancel/${payload._id}`)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Hủy đơn hàng thành công !'})
      yield put(Creators.cancelPurchaseOrderSuccess(result.data))
    }
  } catch(e) {
    console.log("Cancel order failure: ", e.message)
    toast({ type: 'error', message: 'Hủy đơn hàng thất bại !'})
    yield put(Creators.cancelPurchaseOrderFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreatePurchaseOrderStart() {
  yield takeLatest(PurchaseOrderTypes.CREATE_PURCHASE_ORDER_START, createPurchaseOrderProcess);
}

export function* onCreateReceiptStart() {
  yield takeLatest(PurchaseOrderTypes.CREATE_PURCHASE_RECEIPT_START, createReceiptProcess);
}

export function* onGetPurchaseOrdersStart() {
  yield takeLatest(PurchaseOrderTypes.GET_PURCHASE_ORDERS_START, getPurchaseOrdersProcess);
}

export function* onConfirmPaymentStart() {
  yield takeLatest(PurchaseOrderTypes.CONFIRM_PURCHASE_PAYMENT_START, confirmPaymentProcess);
}

export function* onCancelPurchaseOrderStart() {
  yield takeLatest(PurchaseOrderTypes.CANCEL_PURCHASE_ORDER_START, cancelPurchaseOrderProcess);
}

const purchaseOrderRootSagas = [
  call(onCreatePurchaseOrderStart),
  call(onCreateReceiptStart),
  call(onGetPurchaseOrdersStart),
  call(onConfirmPaymentStart),
  call(onCancelPurchaseOrderStart),
];

export default purchaseOrderRootSagas