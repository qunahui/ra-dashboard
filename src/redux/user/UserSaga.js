import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import { request, setToken } from '../../config/axios'
import Creators, { UserTypes } from './User'
import { push } from 'connected-react-router'

import {
  auth,
  googleProvider,
  facebookProvider,
  createUserProfileDocument,
  getCurrentUser,
} from '../../utils/firebase';

export const getToken = (state) => state.auth.toJS().token

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
    yield put(Creators.getUserFailure(error));
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
    delete userSnapshotData.email
    // create token from mongo
      yield put(Creators.getUserSuccess({user: userSnapshotData }));
    }
  } catch (error) {
    console.log(error)
    yield put(Creators.getUserFailure(error));
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
        yield put(Creators.getUserSuccess({user: userSnapshotData, token: result.data.token }));
      }
    } catch (error) {
      yield put(Creators.getUserFailure(error));
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
    const userAuthSnapshot = yield getSnapshotFromUserAuth(userAuth)
    const token = userAuthSnapshot.token;
    setToken(token);
    console.log("Token setted: ", token)

    const mongoAuth = yield call(request.get,'/users/me');
    if (!userAuth || mongoAuth.code !== 200) {
      throw new Error("User session expired !")
    }
    yield put(Creators.checkUserSessionSuccess({ user: mongoAuth.data.user }))

  } catch (error) {
    console.log("Run into this instead")
  } 
}

export function* onGoogleSignInStart() {
  yield takeLatest(UserTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onFacebookSignInStart() {
  yield takeLatest(UserTypes.FACEBOOK_SIGN_IN_START, signInWithFacebook);
}

export function* onLogoutStart() {
  yield takeLatest(UserTypes.SIGN_OUT_START, signOut)
}

export function* onCheckUserSession() {
  yield takeLatest(UserTypes.CHECK_USER_SESSION_START, isUserAuthenticated);
}

export function* onSetTheme() {
  const action = yield take(UserTypes.SET_THEME)
  console.log("Action: ",action)
}

function* userRootSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onFacebookSignInStart),
    call(onCheckUserSession),
    call(onLogoutStart), 
    call(onSetTheme),
  ])
}

export default userRootSagas;