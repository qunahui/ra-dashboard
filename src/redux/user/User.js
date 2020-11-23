import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

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
  checkUserSessionSuccess: ['user'],
  checkUserSessionFailure: ['error'],
  setTheme: ['theme']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  user: {},
  isGettingUser: false,
  isLogin: false,
  error: null,
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
  isGettingUser: true,
  isLogin: false,
})
const clearError = (state) =>
  state.merge({
    error: null,
  })
const setError = (state, { error }) =>
  state.merge({
    error
  })
const checkUserSessionSuccess = (state, { user }) => state.merge({
  isLogin: true,
  isGettingUser: false,
  ...user
})
const checkUserSessionFailure = (state, {error}) => state.merge({
  user: {},
  isGettingUser: false,
  isLogin: false,
  error
})
const setTheme = (state, {theme}) => state.mergeDeep({
  user: {
    theme
  }
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GOOGLE_SIGN_IN_START]: signInStart,
  [Types.FACEBOOK_SIGN_IN_START]: signInStart,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,
  [Types.SIGN_OUT_SUCCESS]: signOutSuccess,
  [Types.CLEAR_ERROR]: clearError,
  [Types.SET_ERROR]: setError,
  [Types.CHECK_USER_SESSION_START]: checkUserSessionStart,
  [Types.CHECK_USER_SESSION_SUCCESS]: checkUserSessionSuccess,
  [Types.CHECK_USER_SESSION_FAILURE]: checkUserSessionFailure,
  [Types.SET_THEME]: setTheme,
})
