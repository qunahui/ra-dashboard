import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { SupplierTypes } from './Supplier'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* getSupplierProcess() {
  try { 
    const result = yield request.get('/suppliers')
    if(result.code === 200) { 
      yield put(Creators.getSupplierSuccess(result.data))
    }
  } catch(e) {
    console.log("Get supplier failure, ", e.message)
  }
}

export function* addSupplierProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/suppliers', payload)
    if(result.code === 200) {
      console.log(result.data)
      toast({ type: 'success', message: 'Tạo nhà cung cấp mới thành công !'})
      yield put(Creators.addSupplierSuccess(result.data))
    }
  } catch(e) {
    if(e.code === 409) {
      toast({ type: 'error', message: 'Nhà cung cấp đã tồn tại !'})
    } else {
      toast({ type: 'error', message: 'Tạo nhà cung cấp mới thất bại !'})
    }
    yield put(Creators.addSupplierFailure())
  } finally {
    NProgress.done()
  }
}

export function* onAddSupplierStart() {
  yield takeLatest(SupplierTypes.ADD_SUPPLIER_START, addSupplierProcess);
}

export function* onGetSupplierStart() {
  yield takeLatest(SupplierTypes.GET_SUPPLIER_START, getSupplierProcess);
}

const productRootSagas = [
  call(onAddSupplierStart),
  call(onGetSupplierStart),
];

export default productRootSagas