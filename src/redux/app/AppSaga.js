import { all, call, take, put, select, takeLatest } from 'redux-saga/effects'
import { request } from '../../config/axios'
import Creators, { AppTypes } from './App'

export function* onFetchShopsStart() {
  
}

function* appRootSagas() {
  yield all([
  ])
}

export default appRootSagas;
