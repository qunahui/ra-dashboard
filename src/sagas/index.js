import { all, call } from 'redux-saga/effects'
import { AppSaga } from '../redux/app'
import { UserSaga } from '../redux/user'

export default function* root() {
  yield all([call(UserSaga),call(AppSaga)])
}
