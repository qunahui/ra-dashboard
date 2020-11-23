import { all, call, take, put, select, takeLatest } from 'redux-saga/effects'
import { request } from '../../config/axios'
import Creators, { AppTypes } from './App'

export function* signInSendo() {
  const result = yield request.post('/api/sendo/login').then(res => res).catch(err => err);
  if(result.code >= 200 && result.code <= 300) {
    yield put(Creators.signInSendoSuccess({ sendoToken: result.data.sendoToken }))
    return;
  }
  yield put(Creators.signInSendoFailure(result))
}

export function* onSignInSendoStart(){
  yield takeLatest(AppTypes.SIGN_IN_SENDO_START, signInSendo)
}

function* appRootSagas() {
  yield all([call(onSignInSendoStart)])
}

export default appRootSagas;
