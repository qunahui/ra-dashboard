import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { SendoProductTypes } from './SendoProduct'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'
import qs from 'qs'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* createProductProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.post('/products', payload)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo sản phẩm thành công !'})
      yield put(Creators.createProductSuccess(result.data))
      NProgress.set(0.8)
      yield put(push('/app/products'))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.createProductFailure())
  } finally {
    NProgress.done()
  }
} 

export function* updateProductProcess({ payload }){
} 

export function* deleteProductProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.delete(`/products/${payload._id}`)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xóa sản phẩm thành công !'})
      yield put(Creators.deleteProductSuccess(result.data))
      NProgress.set(0.8)
      yield put(push('/app/products'))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.deleteProductFailure())
  } finally {
    NProgress.done()
  }
} 

export function* getProductsProcess({ payload }) {
  NProgress.start()
  try {
    const result = yield request.get('http://localhost:5000/sendo/products', {
      params: {
        storeIds: [...payload.storeIds]
      }, 
      paramsSerializer: params => qs.stringify(params)
    })
    if(result.code === 200) {
      yield put(Creators.getSendoProductsSuccess(result.data))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.getSendoProductsFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateSendoProductStart() {
  yield takeLatest(SendoProductTypes.CREATE_SENDO_PRODUCT_START, createProductProcess);
}

export function* onGetSendoProductsStart() {
  yield takeLatest(SendoProductTypes.GET_SENDO_PRODUCTS_START, getProductsProcess);
}

export function* onUpdateSendoProductStart() {
  yield takeLatest(SendoProductTypes.UPDATE_SENDO_PRODUCT_START, updateProductProcess);
}

export function* onDeleteSendoProductStart() {
  yield takeLatest(SendoProductTypes.DELETE_SENDO_PRODUCT_START, deleteProductProcess);
}

const productRootSagas = [
  // call(onCreateSendoProductStart),
  call(onGetSendoProductsStart),
  // call(onUpdateSendoProductStart),
  // call(onDeleteSendoProductStart),
];

export default productRootSagas