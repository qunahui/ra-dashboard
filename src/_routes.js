import React from 'react'
// import messages from './containers/DefaultLayout/messages'

const Bar = React.lazy(() => import('./components/Bar'))

const routes = [
  {
    path: '/',
    // name: '',
    component: Bar,
    rolesAccess: [''],
  },
]

export default routes
