import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { UserTypes } from './User'
import AppCreators from '../app'
import { push } from 'connected-react-router'

import {
  auth,
  googleProvider,
  facebookProvider,
  createUserProfileDocument,
  getCurrentUser,
} from '../../utils/firebase';

export const getToken = (state) => {
  return state.auth.toJS().user.token
}

export function* getSnapshotFromUserAuth(userAuth, additionData) {
  try {
    const userRef = yield call(
      createUserProfileDocument,
      userAuth,
      additionData
    );

    const userSnapshot = yield userRef.get();
    return userSnapshot.data()
  } catch (error) {
    yield put(Creators.signInFailure({error: error.message}));
  }
}

export function* signUp({ payload: { displayName, email, password}}) {
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const { uid } = user;
    const result = yield request.post('/users/sign-up', {uid}).then(res => res)
    if(result.code === 201) {
      // get user snapshot data
      const userSnapshotData = yield getSnapshotFromUserAuth(user, { ...result.data });
      userSnapshotData.uid = uid;
      delete userSnapshotData.email
      // create token from mongo
      yield put(Creators.signUpSuccess({user: userSnapshotData }));
    }
  } catch (error) {
    console.log(error)
    yield put(Creators.signUpFailure({error: new Error(error.message)}));
  }
}

export function* signInAfterSignUp({ payload : { user }}) {
  const userSnapshot = yield getSnapshotFromUserAuth(user);
  console.log(userSnapshot)
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    const { uid } = user;    
    const result = yield request.post('/users/sign-in', {uid}).then(res => res)
    console.log("Data: ",result)
    if(result.code === 200) {
    // get user snapshot data
    const userSnapshotData = yield getSnapshotFromUserAuth(user, { token: result.data.token });
    console.log("Incoming user", {
      ...userSnapshotData,
      ...result.data.user
    })
    yield put(Creators.signInSuccess({user: { ...userSnapshotData,...result.data.user } }));
    }
  } catch (error) {
    console.log(error)
    yield put(Creators.signInFailure({ error: error.message }));
  }
}

export function* signInWithGoogle() {
  try {
    // log in with pop up
    const { user } = yield auth.signInWithPopup(googleProvider);
    const { uid } = user;
    const result = yield request.post('/users/sign-in', {uid}).then(res => res)
    if(result.code === 200) {
    // get user snapshot data
    const userSnapshotData = yield getSnapshotFromUserAuth(user, { token: result.data.token });
    userSnapshotData.uid = uid;
    // create token from mongo
      yield put(Creators.signInSuccess({user: userSnapshotData }));
    }
  } catch (error) {
    console.log(error)
    yield put(Creators.signInFailure({ error: error.message }));
  }
}

export function* signInWithFacebook() {
    try {
      // log in with pop up
      const { user } = yield auth.signInWithPopup(facebookProvider);
      const { uid } = user;
      const result = yield request.post('/users/sign-in', {uid}).then(res => res).catch(err => err)
      // get user snapshot data
      if(result.code === 200) {
      const userSnapshotData = yield getSnapshotFromUserAuth(user);
      userSnapshotData.uid = uid;
      // create token from mongo
        yield put(Creators.signInSuccess({user: userSnapshotData, token: result.data.token }));
      }
    } catch (error) {
      yield put(Creators.signInFailure({ error: error.message }));
    }
}

export function* signOut() {
  try {
      yield auth.signOut()
      yield call(request.post,'/users/sign-out');
  } catch (error) {
    console.log(error)
  } finally {
    yield put(Creators.signOutSuccess())
    yield put(push('/login'))
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if(!userAuth) {
      throw new Error("User session expired")
    }
    const userSnapshotData = yield getSnapshotFromUserAuth(userAuth);
    const token = userSnapshotData.token
    setToken("Bearer " + token);
    console.log("Token setted:", token)
    yield put(Creators.checkUserSessionSuccess())
  } catch (error) {
    yield put(Creators.signInFailure({error: error.message}))
    yield put(push('/login'))
  } 
}

export function* setPlatformCredentials({ payload: { user }}) {
  console.log("Take platform credentials from user: ", user)
  yield put(AppCreators.setPlatformCredentials( { platformCredentials: user.platformCredentials && user.platformCredentials}))
}

export function* onSignUpStart() {
  yield takeLatest(UserTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onGoogleSignInStart() {
  yield takeLatest(UserTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onFacebookSignInStart() {
  yield takeLatest(UserTypes.FACEBOOK_SIGN_IN_START, signInWithFacebook);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onLogoutStart() {
  yield takeLatest(UserTypes.SIGN_OUT_START, signOut)
}

export function* onCheckUserSession() {
  yield takeLatest(UserTypes.CHECK_USER_SESSION_START, isUserAuthenticated);
}

// export function* onCheckUserSessionSuccess() {
//   yield takeLatest(UserTypes.CHECK_USER_SESSION_SUCCESS, setPlatformCredentials)
// }

export function* onSetTheme() {
  const action = yield take(UserTypes.SET_THEME)
  console.log("Action: ",action)
}

function* userRootSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onFacebookSignInStart),
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onLogoutStart), 
    call(onSetTheme),
    call(onSignUpStart),
    call(onSignUpSuccess),
  ])
}

export default userRootSagas;