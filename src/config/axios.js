import axios from 'axios'
import * as constants from '../utils/constants'

const isProduction = process.env.NODE_ENV === 'production'
const request = axios.create()

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
request.defaults.timeout = 60000
if (isProduction) {
  request.defaults.baseURL = constants.PROD_SERVER_URL
} else {
  request.defaults.baseURL = constants.DEV_SERVER_URL
}

console.log('base URL: ', request.defaults.baseURL)

request.interceptors.response.use(
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
)

const setToken = (token) => {
  request.defaults.headers.common.Authorization = token
}

export { request, setToken }