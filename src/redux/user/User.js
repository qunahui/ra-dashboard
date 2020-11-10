import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  googleSignInStart: [],
  facebookSignInStart: [],
  getUserSuccess: ['user'],
  getUserFailure: ['error'],
  signOutStart: [],
  signOutSuccess: [],
  clearError: [],
  setError: ['error'],
  checkUserSessionStart: [],
  checkUserSessionSuccess: [],
  checkUserSessionFailure: ['error'],
  signInSendoStart: [],
  signInSendoSuccess: ['payload'],
  signInSendoFailure: ['error'],
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
  isGettingSendoKey: false,
  sendoToken: undefined,
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
const setError = (state, { error }) =>
  state.merge({
    error
  })
const checkUserSessionSuccess = (state) => state.merge({
  isLogin: true,
  isGettingUser: false
})
const checkUserSessionFailure = (state, {error}) => state.merge({
  user: {},
  isGettingUser: false,
  isLogin: false,
  token: null,
  error
})
const signInSendoStart = (state) => state.merge({
  isGettingSendoKey: true
})
const signInSendoSuccess = (state, { payload : { sendoToken } }) => state.merge({
    sendoToken,
    isGettingSendoKey: false
})
const signInSendoFailure = (state, {error}) => state.merge({
  error,
  isGettingSendoKey: false
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GOOGLE_SIGN_IN_START]: signInStart,
  [Types.FACEBOOK_SIGN_IN_START]: signInStart,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,
  [Types.SIGN_IN_SENDO_START]: signInSendoStart,
  [Types.SIGN_IN_SENDO_SUCCESS]: signInSendoSuccess,
  [Types.SIGN_IN_SENDO_FAILURE]: signInSendoFailure,
  [Types.SIGN_OUT_SUCCESS]: signOutSuccess,
  [Types.CLEAR_ERROR]: clearError,
  [Types.SET_ERROR]: setError,
  [Types.CHECK_USER_SESSION_START]: checkUserSessionStart,
  [Types.CHECK_USER_SESSION_SUCCESS]: checkUserSessionSuccess,
  [Types.CHECK_USER_SESSION_FAILURE]: checkUserSessionFailure,
})
