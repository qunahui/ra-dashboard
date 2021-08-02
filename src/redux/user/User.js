import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  googleSignInStart: [],
  facebookSignInStart: [],
  emailSignInStart: ['payload'],
  signInSuccess: ['payload'],
  signInFailure: ['payload'],
  signUpStart: ['payload'],
  signUpSuccess: ['payload'],
  signUpFailure: ['payload'],
  signOutStart: [],
  signOutSuccess: [],
  clearError: [],
  setError: ['error'],
  checkUserSessionStart: [],
  checkUserSessionSuccess: ['mongoAuth'],
  setTheme: ['theme'],
  reset: [],
  getWhoAmIStart: [],
  getWhoAmISuccess: ['payload'],
  getWhoAmIFailure: ['payload'],
  updateUserStart: ['payload'],
  updateUserSuccess: ['payload'],
  updateUserFailure: ['payload'],
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
const updateUserStart = state => state.merge({
  isWorking: true,
})

const updateUserSuccess = (state, { payload }) => {
  state = state.update('user', user => ({ ...user, ...payload }))

  return state.merge({
    isWorking: false,
  })
}

const updateUserFailure = state => state.merge({
  isWorking: false,
})

const signInStart = (state) =>
  state.merge({
    isGettingUser: true,
  })
const signUpFailure = (state, { error }) => state.merge({
  isGettingUser: false,
  error
})
const signInSuccess = (state, { payload }) =>
  state.merge({
    isGettingUser: false,
    isLogin: true,
    ...payload,
  })
const signUpSuccess = (state, { payload: {user} }) =>
  state.merge({
    isGettingUser: false,
    isLogin: true,
    user,
  })
const signInFailure = (state, { payload: { error }}) => {
  return state.merge({
    ...INITIAL_STATE,
    error: error,
  })
}
const signOutSuccess = (state) => INITIAL_STATE
const checkUserSessionStart = state => state.merge({
  isGettingUser: true,
  isLogin: false,
})
const checkUserSessionSuccess = (state) => state.mergeDeep({
  isGettingUser: false,
  isLogin: true,
})
const clearError = (state) =>
  state.merge({
    error: null,
  })
const setError = (state, { error }) =>
  state.merge({
    error
  })
const setTheme = (state, {theme}) => state.mergeDeep({
  user: {
    theme
  }
})

const getWhoAmIStart = (state) => state.merge({
  isGettingUser: true
})

const getWhoAmISuccess = (state, { payload: { user } }) => state.merge({
  isGettingUser: false,
  user 
})

const getWhoAmIFailure = (state) => state.merge({
  isGettingUser: false
})

const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_USER_START]: updateUserStart,
  [Types.UPDATE_USER_SUCCESS]: updateUserSuccess,
  [Types.UPDATE_USER_FAILURE]: updateUserFailure,
  [Types.GOOGLE_SIGN_IN_START]: signInStart,
  [Types.FACEBOOK_SIGN_IN_START]: signInStart,
  [Types.EMAIL_SIGN_IN_START]: signInStart,
  [Types.SIGN_UP_SUCCESS]: signUpSuccess,
  [Types.SIGN_UP_FAILURE]: signUpFailure,
  [Types.SIGN_IN_SUCCESS]: signInSuccess,
  [Types.SIGN_IN_FAILURE]: signInFailure,
  [Types.SIGN_OUT_SUCCESS]: signOutSuccess,
  [Types.CLEAR_ERROR]: clearError,
  [Types.SET_ERROR]: setError,
  [Types.CHECK_USER_SESSION_START]: checkUserSessionStart,
  [Types.CHECK_USER_SESSION_SUCCESS]: checkUserSessionSuccess,
  [Types.SET_THEME]: setTheme,
  [Types.RESET]: reset,
  [Types.GET_WHO_AM_I_START]: getWhoAmIStart,
  [Types.GET_WHO_AM_I_SUCCESS]: getWhoAmISuccess,
  [Types.GET_WHO_AM_I_FAILURE]: getWhoAmIFailure,
})
