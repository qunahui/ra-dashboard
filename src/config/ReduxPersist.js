import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import { createTransform } from 'redux-persist'
import { fromJS, Map } from 'immutable';
// import omit from 'lodash/omit'

// let authBlackListTransform = createTransform(
//   (inboundState, key) => {
//     return fromJS(omit(inboundState.toJS(), ['isLogin']));
//   },
//   (outboundState, key) => {
//     return outboundState;
//   },
//   {whitelist: ['auth']}
// )

const REDUX_PERSIST = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [immutableTransform()],
}

export default REDUX_PERSIST
