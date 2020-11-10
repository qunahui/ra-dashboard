import axios from 'axios'
import * as constants from '../utils/constants'

import { push } from 'connected-react-router'
import Creators from '../redux/user'
import store from '../store'

const isProduction = process.env.NODE_ENV === 'production'
const request = axios.create()

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

request.defaults.timeout = 60000

if (isProduction) {
  request.defaults.baseURL = constants.PROD_SERVER_URL
} else {
  request.defaults.baseURL = constants.DEV_SERVER_URL
}


request.interceptors.response.use((response) => {
  return {
    code: response.status,
    data: response.data,
  }
},
(error) => {
  if (error.response) {
    const errorSerialized = {
      code: error.response.status,
      message: error.response.data.error.message,
    }
    if(error.response.status === 401) {
      store.dispatch(push('/login'))
      store.dispatch(Creators.checkUserSessionFailure(new Error('User session expired')))
    } else if(error.response.status >= 400 && error.response.status <= 600) {
      store.dispatch(Creators.setError(errorSerialized))
    }
    return Promise.reject(errorSerialized) // eslint-disable-line
  }
  if (error.request) return Promise.reject({ message: 'No response was received. Something went wrong wih server. Please try again next time !' }) // eslint-disable-line
  return Promise.reject(error)
})



const setToken = (token) => {
  request.defaults.headers.common.Authorization = token
}


export { request, setToken }

/*
(response) => {
  return {
    code: response.status,
    data: response.data,
  }
},
(error) => {
  if (error.response) {
    return Promise.reject({
      code: error.response.status,
      message: error.response.data.error.message,
    }) // eslint-disable-line
  }
  if (error.request) return Promise.reject({ message: 'No response was received. Something went wrong wih server. Please try again next time !' }) // eslint-disable-line
  return Promise.reject(error)
},
*/