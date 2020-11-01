import React, { Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import Spinners from './components/Spinners'
import { Switch, Route,withRouter } from 'react-router-dom'
import Creators from './redux/app'

// app components
const Page404 = React.lazy(() => import('./views/Page404'))
const AuthLayout = React.lazy(() => import('./layout/AuthLayout'))
const DashboardLayout = React.lazy(() => import('./layout/DashboardLayout'))

const App = (props) => {  
  return (
    <Suspense fallback={<Spinners pulse />}>
      <Switch>
        <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
        <Route path="/app" name="Default" render={(props) => <DashboardLayout {...props} />} />
        <Route path="/" name="Auth" render={(props) => <AuthLayout {...props} />} />
      </Switch>
    </Suspense>
  )
}

export default connect(null, dispatch => ({
  appOnload: () => dispatch(Creators.appOnload())
}))(App);
