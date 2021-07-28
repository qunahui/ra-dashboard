import { createReducer, createActions } from 'reduxsauce'
import { fromJS, Map } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addSupplierStart: ['payload'],
  addSupplierSuccess: ['payload'],
  addSupplierFailure: ['payload'],
  getSupplierStart: ['payload'],
  getSupplierSuccess: ['payload'],
  getSupplierFailure: ['payload'],
})

export const SupplierTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  suppliers: [],
  isWorking: false,
  error: null,
})

/* ------------- Reducers ------------- */
const addSupplierStart = state => state.merge({
  isWorking: true
})

const addSupplierSuccess = (state, { payload }) => {
  state = state.update('suppliers', suppliers => suppliers.concat(payload))
  return state.merge({
    isWorking: false,
  })
}

const addSupplierFailure = (state, { payload }) => state.merge({
  isWorking: false,
})

const getSupplierStart = state => state.merge({
  isWorking: true
})

const getSupplierSuccess = (state, { payload }) => state.merge({
  isWorking: false,
  suppliers: payload
})

const getSupplierFailure = (state, { payload }) => state.merge({
  isWorking: false,
})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_SUPPLIER_START]: addSupplierStart,
  [Types.ADD_SUPPLIER_SUCCESS]: addSupplierSuccess,
  [Types.ADD_SUPPLIER_FAILURE]: addSupplierFailure,
  [Types.GET_SUPPLIER_START]: getSupplierStart,
  [Types.GET_SUPPLIER_SUCCESS]: getSupplierSuccess,
  [Types.GET_SUPPLIER_FAILURE]: getSupplierFailure,
})
