import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { CustomerTypes } from './Customer'
// import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* getCustomerProcess() {
  try { 
    const result = yield request.get('/customers')
    if(result.code === 200) { 
      yield put(Creators.getCustomerSuccess(result.data))
    }
  } catch(e) {
    console.log("Get customer failure, ", e.message)
  }
}

export function* addCustomerProcess({ payload }) {
  NProgress.start()
  try { 
    const result = yield request.post('/customers', payload)
    if(result.code === 200) {
      console.log(result.data)
      toast({ type: 'success', message: 'Tạo khách hàng mới thành công !'})
      yield put(Creators.addCustomerSuccess(result.data))
    }
  } catch(e) {
    if(e.code === 409) {
      toast({ type: 'error', message: 'Khách hàng đã tồn tại !'})
    } else {
      toast({ type: 'error', message: 'Tạo khách hàng mới thất bại !'})
    }
    yield put(Creators.addCustomerFailure())
  } finally {
    NProgress.done()
  }
}

export function* onAddCustomerStart() {
  yield takeLatest(CustomerTypes.ADD_CUSTOMER_START, addCustomerProcess);
}

export function* onGetCustomerStart() {
  yield takeLatest(CustomerTypes.GET_CUSTOMER_START, getCustomerProcess);
}

const productRootSagas = [
  call(onAddCustomerStart),
  call(onGetCustomerStart),
];

export default productRootSagas