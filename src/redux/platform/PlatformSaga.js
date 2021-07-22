import { all, call, put, select, take, fork, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { PlatformTypes } from './Platform'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'
import qs from 'qs'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* getSendoProductProcess(storeIds) {
  try {
    if(storeIds.length === 0) {
      return []
    }
    const result = yield request.get('/sendo/products', {
      params: {
        storeIds: [...storeIds]
      }, 
      paramsSerializer: params => qs.stringify(params)
    })
    if(result.code === 200) {
      // yield put(Creators.getSendoProductSuccess())
      return result.data;
    }
  } catch(e) {
    toast({ type: 'error', message: 'Lấy danh sách sản phẩm Sendo thất bại! '})
    console.log(e.message)
    return [];
  } 
}

export function* getLazadaProductProcess(storeIds) {
  try {
    if(storeIds.length === 0) {
      return []
    }
    const result = yield request.get('/lazada/products?storeIds=', {
      params: {
        storeIds: [...storeIds]
      }, 
      paramsSerializer: params => qs.stringify(params)
    })

    if(result.code === 200) {
      // yield put(Creators.getLazadaProductSuccess())
      return result.data;
    }

    return [];
  } catch(e) {
    toast({ type: 'error', message: 'Lấy danh sách sản phẩm Lazada thất bại! '})
    console.log(e.message)
    return [];
  }
}

export function* getPlatformProductProccess({ payload }) {
  try {
    const sendoProducts = yield* getSendoProductProcess(payload.sendoStoreIds)
    const lazadaProducts = yield* getLazadaProductProcess(payload.lazadaStoreIds)
  
    const finalProducts = [...sendoProducts, ...lazadaProducts]

    yield put(Creators.getPlatformProductSuccess(finalProducts));
  } catch(e) {
    toast({ type: 'error', message: e.message })
  }
}

export function* linkDataProcess({ payload }) {
  NProgress.start()
  try {
    const response = yield request.post('/variants/link/', payload)

    if(response.code === 200) {
      toast({ type: 'success', message: `Liên kết sản phẩm ${payload.platformVariant.name} thành công !`})
      yield put(Creators.linkDataSuccess(response.data))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    yield put(Creators.linkDataFailure())
  } finally {
    NProgress.done()
  }
}

export function* unlinkDataProcess({ payload }) {
  NProgress.start()
  try {
    const response = yield request.post('/variants/unlink/', payload)

    if(response.code === 200) {
      toast({ type: 'success', message: `Hủy liên kết sản phẩm ${payload.platformVariant.name} thành công !`})
      yield put(Creators.linkDataSuccess(response.data))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message})
    yield put(Creators.linkDataFailure())
  } finally {
    NProgress.done()
  }
}

export function* onLinkDataStart() {
  yield takeLatest(PlatformTypes.LINK_DATA_START, linkDataProcess)
}

export function* onUnlinkDataStart() {
  yield takeLatest(PlatformTypes.UNLINK_DATA_START, unlinkDataProcess)
}

export function* onGetPlatformProductStart() {
  yield takeLatest(PlatformTypes.GET_PLATFORM_PRODUCT_START, getPlatformProductProccess)
}

const productRootSagas = [
  call(onGetPlatformProductStart),
  call(onLinkDataStart),
  call(onUnlinkDataStart),
];

export default productRootSagas