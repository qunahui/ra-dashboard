import { all } from 'redux-saga/effects'
import { UserSaga } from '../redux/user'
export default function* root() {
  yield all([UserSaga()])
}
