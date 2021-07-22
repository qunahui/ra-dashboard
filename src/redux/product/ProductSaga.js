import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { ProductTypes } from './Product'
import PlatformCreators, { PlatformTypes } from 'Redux/platform/Platform'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

export const getAllStoreIds = (state) => {
  const { storage } = state.app.toJS()
  let sendoStoreIds = storage.sendoCredentials.map(i => i.store_id);
  let lazadaStoreIds = storage.lazadaCredentials.map(i => i.store_id);

  return { 
    sendoStoreIds,
    lazadaStoreIds
  }
}

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
      if(window.location.pathname === '/app/products/create') {
        yield put(push('/app/products'))
      }
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.createProductFailure())
  } finally {
    NProgress.done()
  }
} 

export function* createProductFromPlatformProcess({ payload }) {
  yield createProductProcess({ payload })
  const allStoreIds = yield select(getAllStoreIds)
  yield put(PlatformCreators.getPlatformProductStart(allStoreIds))
}

export function* createVariantProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.post('/variants', payload)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Tạo biến thể thành công !'})
      yield put(Creators.createVariantSuccess(result.data))
      NProgress.set(0.8)
      yield put(push('/app/product/' + payload.productId))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.createVariantFailure())
  } finally {
    NProgress.done()
  }
} 

export function* updateProductProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.patch(`/products/${payload._id}`, payload)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Cập nhật sản phẩm thành công !'})
      yield put(Creators.updateVariantSuccess(result.data))
      NProgress.set(0.8)
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.updateVariantFailure())
  } finally {
    NProgress.done()
  }
} 

export function* updateVariantProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.patch(`variants/${payload._id}`, payload)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Cập nhật biến thể thành công !'})
      yield put(Creators.updateProductSuccess(result.data))
      NProgress.set(0.8)
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.updateProductFailure())
  } finally {
    NProgress.done()
  }
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

export function* deleteVariantProcess({ payload }){
  NProgress.start()
  try {
    const result = yield request.delete(`/variants/${payload._id}`)
    NProgress.set(0.5)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Xóa biến thể thành công !'})
      yield put(Creators.deleteVariantSuccess(result.data))
      NProgress.set(0.8)
      yield put(push(`/app/product/${payload.productId}`))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    console.log(e)
    yield put(Creators.deleteVariantFailure())
  } finally {
    NProgress.done()
  }
} 
  
export function* getProductsProcess({ payload }) {
  NProgress.start()
  try {
    const result = yield request.get('/products', { params: {
      name: payload?.name || '',
      type: payload?.type || 'all'
    } })
    NProgress.set(0.5)
    if(result.code === 200) {
      yield put(Creators.getProductsSuccess(result.data))
      NProgress.set(0.8)
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    yield put(Creators.getProductsFailure())
  } finally {
    NProgress.done()
  }
}

export function* getProductByIdProcess({ payload }) {
  try {
    const result = yield request.get(`/products/${payload}`)
    if(result.code === 200) {
      yield put(Creators.getProductByIdSuccess(result.data))
    }
  }
  catch(e) {
    toast({ type: 'error', message: e.message})
    yield put(Creators.getProductByIdFailure(e.message))
  } 
}

export function* getVariantsProcess({ payload }) {
  NProgress.start()
  try {
    const result = yield request.get('/variants', { params: {
      name: payload?.name || '',
      type: payload?.type || 'all'
    } })
    NProgress.set(0.5)
    if(result.code === 200) {
      yield put(Creators.getVariantsSuccess(result.data))
      NProgress.set(0.8)
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    yield put(Creators.getVariantsFailure())
  } finally {
    NProgress.done()
  }
}

export function* onCreateProductStart() {
  yield takeLatest(ProductTypes.CREATE_PRODUCT_START, createProductProcess);
}

export function* onCreateProductFromPlatformStart() {
  yield takeLatest(ProductTypes.CREATE_PRODUCT_FROM_PLATFORM_START, createProductFromPlatformProcess);
}

export function* onCreateVariantStart() {
  yield takeLatest(ProductTypes.CREATE_VARIANT_START, createVariantProcess);
}

export function* onGetProductsStart() {
  yield takeLatest(ProductTypes.GET_PRODUCTS_START, getProductsProcess);
}

export function* onUpdateProductStart() {
  yield takeLatest(ProductTypes.UPDATE_PRODUCT_START, updateProductProcess);
}

export function* onUpdateVariantStart() {
  yield takeLatest(ProductTypes.UPDATE_VARIANT_START, updateVariantProcess);
}

export function* onDeleteVariantStart() {
  yield takeLatest(ProductTypes.DELETE_VARIANT_START, deleteVariantProcess);
}

export function* onDeleteProductStart() {
  yield takeLatest(ProductTypes.DELETE_PRODUCT_START, deleteProductProcess);
}

export function* onGetProductByIdStart() {
  yield takeLatest(ProductTypes.GET_PRODUCT_BY_ID_START, getProductByIdProcess)
}

export function* onGetVariantsStart() {
  yield takeLatest(ProductTypes.GET_VARIANTS_START, getVariantsProcess)
}

const productRootSagas = [
  call(onGetVariantsStart),
  call(onGetProductByIdStart),
  call(onCreateProductStart),
  call(onCreateProductFromPlatformStart),
  call(onCreateVariantStart),
  call(onGetProductsStart),
  call(onUpdateProductStart),
  call(onUpdateVariantStart),
  call(onDeleteProductStart),
  call(onDeleteVariantStart),
];

export default productRootSagas