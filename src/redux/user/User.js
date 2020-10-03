import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getUser: ['params'],
  getUserSuccess: ['user'],
  getUserFailure: ['error'],
  setUser: ['user'],
  userLogout: [],
  clearError: [],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  user: {},
  isLogin: false,
  isGettingUser: false,
  error: null,
  token: null,
})

/* ------------- Reducers ------------- */

const getUser = (state) =>
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
const userLogout = (state) =>
  state.merge({
    user: null,
    isGettingUser: false,
    isLogin: false,
    token: null,
  })
const clearError = (state) =>
  state.merge({
    error: null,
  })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_USER]: getUser,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,
  [Types.USER_LOGOUT]: userLogout,
  [Types.CLEAR_ERROR]: clearError,
})
