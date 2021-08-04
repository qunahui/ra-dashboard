import { all, call, take, put, select, takeLatest } from 'redux-saga/effects'
import { request } from '../../config/axios'
import Creators, { AppTypes } from './App'
import PlatformCreators from 'Redux/platform'
import UserCreators from 'Redux/user'
import { push } from 'connected-react-router'
import { toast } from 'react-toastify'
import customToast from '../../components/Helpers/ShowToast'
import NProgress from 'nprogress'

export const getAllStoreIds = (state) => {
  const { storage } = state.app.toJS()
  let sendoStoreIds = storage.sendoCredentials.map(i => i.store_id);
  let lazadaStoreIds = storage.lazadaCredentials.map(i => i.store_id);

  return { 
    sendoStoreIds,
    lazadaStoreIds
  }
}

export function* getStoresProcess() {
  try { 
    const result = yield request.get('/api/storage')
    if(result.code === 200) {
      yield put(Creators.getStoresSuccess(result.data))
    }
  } catch(e) {
    if(e.code === 401) {
      toast({ type: 'error', message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại! '})
      yield put(UserCreators.signOutStart())
    }
    // yield put(Creators.getStoresFailure(e))
  }
}

export function* connectLazadaProcess({ payload: { query }}) {
  try {
    const result = yield request.get('/api/lazada/authorize' + query)
    if(result.code === 200) {
      yield put(Creators.connectLazadaSuccess(result.data))
      yield put(Creators.getStoresStart())
      customToast({ 
        type: 'success', 
        message: 'Kết nối thành công gian hàng ' + result.data.store_name,
        opts: {
          onClose: () => push('/app/create/lazada/finish', result.data)
        }
      })
      yield put(push('/app/create/lazada/finish', result.data))
    }
  } catch(e) {
    toast.dismiss()
    push('/app/create')
    console.log(e.message)
    customToast({ type: 'error', message: 'Có gì đó sai sai'})
    yield put(Creators.connectLazadaFailure())
  }
}

export function* connectSendoProcess({ payload }) {
  try {
    const result = yield request.post('/api/sendo/authorize', payload)
    if(result.code === 200) {
      customToast({ 
        type: 'success', 
        message: 'Kết nối thành công gian hàng ' + result.data.store_name,
        opts: {
          // onClose: () => push('/app/create/lazada/finish', result.data)
        }
      })
      yield put(Creators.connectSendoSuccess(result.data))
      yield put(Creators.getStoresStart())
      yield put(push('/app/create/success', { name: result.data.store_name }))
    }
  } catch(e) {
    toast.dismiss()
    push('/app/create')
    customToast({ type: 'error', message: 'Có gì đó sai sai'})
    yield put(Creators.connectSendoFailure())
  }
}

export function* disconnectStoreProcess({ payload }) {
  NProgress.start()
  try {
    const result = yield request.post('/api/storage/disconnect', payload)
    if(result.code === 200) {
      toast({ type: 'success', message: 'Gỡ kết nối gian hàng thành công !'})      
      yield put(Creators.disconnectStoreSuccess(result.data))
      NProgress.set(0.5)
    }
  } catch(e) {
    toast({ type: 'error', message: 'Có gì đó sai sai'})
    yield put(Creators.disconnectStoreFailure())
  } finally {
    NProgress.done()
  }
}

export function* syncDataProcess({ payload }) {
  NProgress.start()
  let result = {}
  try {
    if(payload.platform_name === "sendo") {
      // customToast({ type: 'success', message: 'SENDO'})
      result = yield request.post('/sendo/products/sync', {payload})
    }
    if(payload.platform_name === 'lazada') {
      // customToast({ type: 'success', message: 'LAZADA'})
      result = yield request.post('/lazada/products/sync', {payload})
    }

    if(result.code === 200) {
      customToast({ type: 'success', message: 'Đồng bộ thành công!'})
      yield put(Creators.getStoresStart())
      NProgress.set(0.8)
      yield put(Creators.syncDataSuccess())
    }
  } catch(e) {
    customToast({ type: 'error', message: e.message })
    yield put(Creators.syncDataFailure({
      message: e.message,
      expiredCre: payload
    }))
  } finally {
    NProgress.done()
  }
}

export function* getPlatformProductAfterSyncProcess() {
  const allStoreIds = yield select(getAllStoreIds)
  console.log("All store ids: ", allStoreIds)
  yield put(PlatformCreators.getPlatformProductStart(allStoreIds))
}

export function* refreshAllTokenProcess() {
  try {
    const response = yield request.get('/api/storage/refresh-all')

    if(response.code === 200) {
      yield put(Creators.refreshAllTokenSuccess(response.data))
    }

  } catch(e) {
    console.log(e.message)
    yield put(Creators.refreshAllTokenFailure())
  }
}

export function* createMultiPlatformProductProcess({ payload }) {
  NProgress.start()
  try {
    const response = yield request.post('/products/create-multi-platform', payload)

    if(response.code === 200) {
      toast({ type: 'success', message: 'Đăng bán sản phẩm thành công !'})
      yield put(Creators.createMultiPlatformProductSuccess())
      yield put(push('/app/products'))
    }

  } catch(e) {
    toast({ type: 'error', message: e.message })
    yield put(Creators.createMultiPlatformProductFailure())
  } finally {
    NProgress.done()
  }
}

export function* autoLinkDataProcess({ payload }) {
  NProgress.start()
  try { 
    const response = yield request.post('/variants/auto-link', payload)
  
    if(response.code === 200) {
      yield put(Creators.autoLinkDataSuccess(response.data))
    }
  } catch(e) {
    toast({ type: 'error', message: e.message })
    yield put(Creators.autoLinkDataFailure())
  } finally {
    NProgress.done()
  }
}

export function* changePasswordProcess({ payload }) {
  try {
    const response = yield request.post('/users/update-password', payload)
    if(response.code === 200) {
      customToast({ type: 'success', message: 'Đổi mật khẩu thành công!' })
    }
  } catch(e) {
    customToast({ type: 'error', message: e.message })
  }
}

export function* syncOrderProcess() {
  NProgress.start()
  try {
    const response = yield request.get('/orders/fetch')
    if(response.code === 200) {
      customToast({ type: 'success', message: 'Cập nhật đơn hàng thành công!' })
    }
  } catch(e) {
    customToast({ type: 'error', message: e.message })
  } finally {
    NProgress.done()
  }
}

export function* onGetStoresStart() {
  yield takeLatest(AppTypes.GET_STORES_START, getStoresProcess)
}

export function* onConnectLazadaStart() {
  yield takeLatest(AppTypes.CONNECT_LAZADA_START, connectLazadaProcess)
}

export function* onConnectSendoStart() {
  yield takeLatest(AppTypes.CONNECT_SENDO_START, connectSendoProcess)
}

export function* onDisconnectStoreStart() {
  yield takeLatest(AppTypes.DISCONNECT_STORE_START, disconnectStoreProcess)
}

export function* onSyncDataStart() {
  yield takeLatest(AppTypes.SYNC_DATA_START, syncDataProcess)
}

export function* getPlatformProductAfterSuccessfullySync() {
  yield takeLatest(AppTypes.SYNC_DATA_SUCCESS, getPlatformProductAfterSyncProcess)
}

export function* onRefreshAllTokenStart() {
  yield takeLatest(AppTypes.REFRESH_ALL_TOKEN_START, refreshAllTokenProcess)
}

export function* onCreateMultiPlatformProductStart() {
  yield takeLatest(AppTypes.CREATE_MULTI_PLATFORM_PRODUCT_START, createMultiPlatformProductProcess)
}

export function* onAutoLinkDataStart() {
  yield takeLatest(AppTypes.AUTO_LINK_DATA_START, autoLinkDataProcess)
}

export function* onChangePasswordStart() {
  yield takeLatest(AppTypes.CHANGE_PASSWORD_START, changePasswordProcess)
}

export function* onSyncOrderStart() {
  yield takeLatest(AppTypes.SYNC_ORDER_START, syncOrderProcess)
}

const appRootSagas = [
  call(onGetStoresStart),
  call(onConnectLazadaStart),
  call(onConnectSendoStart),
  call(onDisconnectStoreStart),
  call(onSyncDataStart),
  call(onRefreshAllTokenStart),
  call(getPlatformProductAfterSuccessfullySync),
  call(onCreateMultiPlatformProductStart),
  call(onAutoLinkDataStart),
  call(onChangePasswordStart),
  call(onSyncOrderStart),
]

export default appRootSagas