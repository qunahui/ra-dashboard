import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  googleSignInStart: [],
  facebookSignInStart: [],
  emailSignInStart: ['user'],
  getUserSuccess: ['user'],
  getUserFailure: ['error'],
  signOutStart: [],
  signOutSuccess: [],
  clearError: [],
  checkUserSessionStart: [],
  checkUserSessionSuccess: [],
  checkUserSessionFailure: ['error'],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  user: {},
  isGettingUser: false,
  isLogin: false,
  error: null,
  token: null,
})

/* ------------- Reducers ------------- */
const signInStart = (state) =>
  state.merge({
    isGettingUser: true,
  })
const getUserSuccess = (state, { user }) =>
  state.merge({
    isGettingUser: false,
    isLogin: true,
    ...user,
  })
const getUserFailure = (state, { error }) =>
  state.merge({
    isGettingUser: false,
    error,
  })
const signOutSuccess = (state) => state.merge(INITIAL_STATE)
const checkUserSessionStart = state => state.merge({
  isGettingUser: true
})
const clearError = (state) =>
  state.merge({
    error: null,
  })
const checkUserSessionSuccess = (state) => state.merge({
  isLogin: true,
  isGettingUser: false
})
const checkUserSessionFailure = (state) => state.merge({
  user: {},
  isGettingUser: false,
  isLogin: false,
  token: null,
  error: 'Check user session failed'
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GOOGLE_SIGN_IN_START]: signInStart,
  [Types.FACEBOOK_SIGN_IN_START]: signInStart,
  [Types.EMAIL_SIGN_IN_START]: signInStart,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,
  [Types.SIGN_OUT_SUCCESS]: signOutSuccess,
  [Types.CLEAR_ERROR]: clearError,
  [Types.CHECK_USER_SESSION_START]: checkUserSessionStart,
  [Types.CHECK_USER_SESSION_SUCCESS]: checkUserSessionSuccess,
  [Types.CHECK_USER_SESSION_FAILURE]: checkUserSessionFailure,
})
