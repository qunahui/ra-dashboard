import { all } from 'redux-saga/effects'
import { UserSaga } from '../redux/user'
import { AppSaga } from '../redux/app'
export default function* root() {
  yield all([UserSaga()])
}
