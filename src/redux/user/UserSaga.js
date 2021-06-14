import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { UserTypes } from './User'
import AppCreators from '../app'
import { push } from 'connected-react-router'
import NProgress from 'nprogress'
import toast from '../../components/Helpers/ShowToast'

// import {
//   auth,
//   googleProvider,
//   facebookProvider,
//   createUserProfileDocument,
//   getCurrentUser,
// } from '../../utils/firebase';

export const getToken = (state) => {
  return state.auth.toJS().token
}

export function* signUp({ payload }) {
  try {
    const result = yield request.post('/users/sign-up', payload)
    console.log(result)
    if(result.code === 201) {
      toast({ type: 'success', message: 'Đăng ký thành công !'})
      yield put(Creators.emailSignInStart(payload));
    }
  } catch (error) {
    console.log(error)
    // yield put(Creators.signUpFailure({error: new Error(error.message)}));
    toast({ type: 'error', message: 'Đăng ký thất bại. Vui lòng thử lại sau!'})
    NProgress.done()
  }
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const result = yield request.post('/users/sign-in', { email, password })
    console.log(result)
    if(result.code === 200) {
      // get user snapshot data
      NProgress.set(0.8)
      yield put(Creators.signInSuccess({ ...result.data }));
    }
  } catch (error) {
    // yield put(Creators.signInFailure({ error }));
    toast({ type: 'error', message: error.message})
  } finally {
    NProgress.done()
  }
}

export function* signOut() {
  try {
      yield request.get('/users/sign-out')
  } catch (error) {
    console.log(error)
  } finally {
    yield put(Creators.signOutSuccess())
    yield put(push('/login'))
    toast({ type: 'success', message: 'Đăng xuất thành công'})
  }
}

export function* getWhoAmIProcess() {
  try {
    const result = yield request.get('/users/me')

    if(result.code === 200) {
      yield put(Creators.getWhoAmISuccess(result.data))
    } 
  } catch(e) {
    yield put(Creators.getWhoAmIFailure())
  }
}

// export function* isUserAuthenticated() {
//   try {
//     const userAuth = yield getCurrentUser();
//     if(!userAuth) {
//       throw new Error("User session expired")
//     }
//     const userSnapshotData = yield getSnapshotFromUserAuth(userAuth);
//     const token = userSnapshotData.token
//     setToken("Bearer " + token);
//     console.log("Token setted:", token)
//     yield put(Creators.checkUserSessionSuccess())
//   } catch (error) {
//     yield put(Creators.signInFailure({error: error.message}))
//     yield put(push('/login'))
//   } 
// }

export function* setPlatformCredentials({ payload: { user }}) {
  console.log("Take platform credentials from user: ", user)
  yield put(AppCreators.setPlatformCredentials( { platformCredentials: user.platformCredentials && user.platformCredentials}))
}

export function* onSignUpStart() {
  yield takeLatest(UserTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserTypes.SIGN_UP_START, signUp);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignInSuccess() {
  yield takeLatest(UserTypes.SIGN_IN_SUCCESS, () => toast({ type: 'success', message: 'Đăng nhập thành công'}));
}

export function* onLogoutStart() {
  yield takeLatest(UserTypes.SIGN_OUT_START, signOut)
}

export function* onGetWhoAmI() {
  yield takeLatest(UserTypes.GET_WHO_AM_I_START, getWhoAmIProcess)
}

// export function* onCheckUserSession() {
//   yield takeLatest(UserTypes.CHECK_USER_SESSION_START, isUserAuthenticated);
// }

// function* userRootSagas() {
//   sagas = [
//     call(onGoogleSignInStart),
//     call(onFacebookSignInStart),
//     call(onEmailSignInStart),
//     call(onCheckUserSession),
//     call(onLogoutStart), 
//     call(onSetTheme),
//     call(onSignUpStart),
//     call(onSignUpSuccess),
//   ]
//   yield all(sagas)
//   return sagas
// }

const userRootSagas = [
  call(onEmailSignInStart),
  call(onSignInSuccess),
  // call(onCheckUserSession),
  call(onLogoutStart), 
  call(onSignUpStart),
  call(onGetWhoAmI),
];

export default userRootSagas