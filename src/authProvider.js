import store from './store'
import UserCreators from './redux/user'

const authProvider = {
  // authentication
  login:  (provider) => {
    if (provider === 'google') {
      store.dispatch(UserCreators.signInGoogleStart())
    }

    if(provider === 'facebook') {
      store.dispatch(UserCreators.signInFacebookStart())
    }
  },
  checkError: error => Promise.resolve(),
  checkAuth: params => Promise.resolve(),
  logout: () => Promise.resolve(),
  getIdentity: () => Promise.resolve(),
  // authorization
  getPermissions: params => Promise.resolve(),
};

export default authProvider;