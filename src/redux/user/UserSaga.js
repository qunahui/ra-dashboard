import { all, call, put, takeLatest } from 'redux-saga/effects'
import { request } from '../../config/axios'
import Creators, { UserTypes } from './User'

function* userRootSagas() {
  yield all([yield takeLatest(UserTypes.GET_USER, getUser)])
}

const fetchUser = (params) =>
  request
    .post('/users/sign-in', params)
    .then((res) => res)
    .catch((err) => err)

function* getUser({ params }) {
  const result = yield call(fetchUser, params)
  console.log(result)
  if (result.code === 401) {
    yield put(Creators.getUserFailure(result))
  } else {
    yield put(Creators.getUserSuccess(result))
  }
}

export default userRootSagas
