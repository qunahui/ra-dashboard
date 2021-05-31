import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { LazadaProductTypes } from './LazadaProduct'
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
  // console.log(payload)
  try {
    const result = yield request.get('http://localhost:5000/lazada/products?storeIds=', {
      params: {
        storeIds: [...payload.storeIds]
      }, 
      paramsSerializer: params => qs.stringify(params)
    })
    if(result.code === 200) {
      yield put(Creators.getLazadaProductsSuccess(result.data))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.getLazadaProductsFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateLazadaProductStart() {
  yield takeLatest(LazadaProductTypes.CREATE_LAZADA_PRODUCT_START, createProductProcess);
}

export function* onGetLazadaProductsStart() {
  yield takeLatest(LazadaProductTypes.GET_LAZADA_PRODUCTS_START, getProductsProcess);
}

export function* onUpdateLazadaProductStart() {
  yield takeLatest(LazadaProductTypes.UPDATE_LAZADA_PRODUCT_START, updateProductProcess);
}

export function* onDeleteLazadaProductStart() {
  yield takeLatest(LazadaProductTypes.DELETE_LAZADA_PRODUCT_START, deleteProductProcess);
}

const productRootSagas = [
  // call(onCreateLazadaProductStart),
  call(onGetLazadaProductsStart),
  // call(onUpdateLazadaProductStart),
  // call(onDeleteLazadaProductStart),
];

export default productRootSagas