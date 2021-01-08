import { all, fork, takeLatest } from 'redux-saga/effects'
import { AppSaga } from '../redux/app'
import { UserSaga } from '../redux/user'

export default function* root() {
  yield all([UserSaga, AppSaga].map(fork))
}
