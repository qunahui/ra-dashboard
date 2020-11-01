import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { setToken } from '../../config/axios'
import { UserTypes } from './App'

export const getToken = (state) => state.auth.toJS().token

export function* setAppToken() {
  const token = yield select(getToken);
  setToken(token);
}

export function* onAppStartup() {
  yield takeLatest(UserTypes.APP_ONLOAD, setAppToken);
}


function* appRootSagas() {
  yield all([
    call(onAppStartup)
  ])
}

export default appRootSagas


// export function* signInWithEmail({ user: { email, password }}) {
//   try {
//     const { user } = yield auth.signInWithEmailAndPassword(email, password);
//     yield getSnapshotFromUserAuth(user);
//   } catch (error) {
//     yield put(Creators.getUserFailure(error));
//   }
// }


// export function* signUp({ user: { email, password } }) {
//   try {
//     yield auth.createUserWithEmailAndPassword(email, password);
//     const userSnapshotData = yield getSnapshotFromUserAuth(user)
//     // yield request.post('/users/sign-up', )
//   } catch (error) {
//     yield put(Creators.signUpFailure(error));
//   }
// }

// export function* signInAfterSignUp({ user }) {
//   yield getSnapshotFromUserAuth(user);
// }


// export function* onEmailSignInStart() {
//   yield takeLatest(UserTypes.EMAIL_SIGN_IN_START, signInWithEmail);
// }

// export function* onSignUpStart() {
//   yield takeLatest(UserTypes.SIGN_UP_START, signUp);
// }

// export function* onSignUpSuccess() {
//   yield takeLatest(UserTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
// }

