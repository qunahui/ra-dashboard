import { all, call, put, fork, delay, select, takeLatest } from 'redux-saga/effects'
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

// function* createUserToken(email) {

// }
export const getToken = (state) => state.auth.toJS().token

export function* getSnapshotFromUserAuth(userAuth) {
  try {
    const userRef = yield call(
      createUserProfileDocument,
      userAuth
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
    // get user snapshot data
    const userSnapshotData = yield getSnapshotFromUserAuth(user);
    userSnapshotData.uid = uid;
    delete userSnapshotData.email
    console.log(userSnapshotData)
    // create token from mongo
    const result = yield request.post('/users/sign-in', {uid}).then(res => res)
    if(result.code === 200) {
      yield put(Creators.getUserSuccess({user: userSnapshotData, token: result.data.token }));
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
      // get user snapshot data
      const userSnapshotData = yield getSnapshotFromUserAuth(user);
      userSnapshotData.uid = uid;
      // create token from mongo
      const result = yield request.post('/users/sign-in', {uid}).then(res => res)
      if(result.code === 200) {
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
    const token = yield select(getToken);
    setToken(token);
    console.log("Token setted: ", token)
    const mongoAuth = yield call(request.get,'/users/me');

    if (!userAuth || mongoAuth.code !== 200) {
      signOut();
      yield put(Creators.checkUserSessionFailure())
      return;
    }
    yield put(Creators.checkUserSessionSuccess())
  } catch (error) {
    
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

export function* onCheckUserSessionSucess() {
yield takeLatest(UserTypes.CHECK_USER_SESSION_SUCCESS, function*() {
  console.log("on check user session end.")
});
}

function* userRootSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onFacebookSignInStart),
    call(onLogoutStart), 
    call(onCheckUserSession),
    call(onCheckUserSessionSucess),
    // call(onEmailSignInStart), 
    // call(onSignUpStart), 
    // call(onSignUpSuccess)
  ])
}

export default userRootSagas


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

