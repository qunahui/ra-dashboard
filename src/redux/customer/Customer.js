import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addCustomerStart: ['payload'],
  addCustomerSuccess: ['payload'],
  addCustomerFailure: ['payload'],
  getCustomerStart: ['payload'],
  getCustomerSuccess: ['payload'],
  getCustomerFailure: ['payload'],
})

export const CustomerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  customers: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const addCustomerStart = state => state.merge({
  isWorking: true
})

const addCustomerSuccess = (state, { payload }) => {
  state = state.update('customers', customers => customers.concat(payload))
  return state.merge({
    isWorking: false,
  })
}

const addCustomerFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const getCustomerStart = state => state.merge({
  isWorking: true
})

const getCustomerSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  customers: payload
})

const getCustomerFailure = (state, { payload }) => state.merge({
  isWorking: false,
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_CUSTOMER_START]: addCustomerStart,
  [Types.ADD_CUSTOMER_SUCCESS]: addCustomerSuccess,
  [Types.ADD_CUSTOMER_FAILURE]: addCustomerFailure,
  [Types.GET_CUSTOMER_START]: getCustomerStart,
  [Types.GET_CUSTOMER_SUCCESS]: getCustomerSuccess,
  [Types.GET_CUSTOMER_FAILURE]: getCustomerFailure,
})
