import { hot } from 'react-hot-loader'
import React, { Suspense, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import store from './store'
import Spinners from './components/Spinners'
import { Switch, Route, withRouter } from 'react-router-dom'

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import './styles/ant.less'
// app components
const Page404 = React.lazy(() => import('./views/Page404'))
const AuthLayout = React.lazy(() => import('./layout/AuthLayout'))
const DashboardLayout = React.lazy(() => import('./layout/DashboardLayout'))

const App = (props) => { 
  return (
    <>
      <Suspense fallback={<Spinners pulse />}>
        {/* <Button onClick={() => store.dispatch({ type: 'RESET' })}>Reset</Button> */}
        <Switch>
          <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
          <Route path="/app" name="Default" render={(props) => <DashboardLayout {...props} />} />
          <Route path="/" name="Auth" render={(props) => <AuthLayout {...props} />} />
        </Switch>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        //pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
    </>
  )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
}))(hot(module)(App));
