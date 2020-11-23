import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signInSendoStart: [],
  signInSendoSuccess: ['payload'],
  signInSendoFailure: ['error'],
})

export const AppTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  sendoToken: null,
  isGettingSendoToken: false,
  isSendoRegistered: false,
  lazadaToken: null,
  isGettingLazadaToken: false,
  isLazadaRegistered: false,
})

/* ------------- Reducers ------------- */
const signInSendoStart = (state) => state.merge({
  isGettingSendoToken: true
})

const signInSendoSuccess = (state, { payload: { sendoToken }}) => state.merge({
  sendoToken, 
  isGettingSendoToken: false,
  isSendoRegistered: true,
})

const signInSendoFailure = (state, { error }) => {
  if(error.code === 400) {
    return state.merge({
      isGettingSendoToken: false,
      isSendoRegistered: false
    })
  } 

  return state.merge({
    isGettingSendoToken: false
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN_SENDO_START] : signInSendoStart,
  [Types.SIGN_IN_SENDO_SUCCESS] : signInSendoSuccess,
  [Types.SIGN_IN_SENDO_FAILURE] : signInSendoFailure,
})
