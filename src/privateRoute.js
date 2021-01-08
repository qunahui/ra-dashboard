import React, { Component,useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'

import LinearProgress from '@material-ui/core/LinearProgress';

import UserCreators from './redux/user'
import AppCreators from './redux/app'
import { message } from 'antd'

function PrivateRoute({ component: Component, push, auth, app, checkUserSessionStart,...rest }) {
  const [open, setOpen] = React.useState(false);

  return <>
    <Route
      {...rest}
      render={(props) =>
        auth.isLogin === true ? (
          <Component {...props} />
        ) : (
          // <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          <LinearProgress/>
          // {/* <div>
          //   { auth.error ? 
          //  :
          //     <LinearProgress/>
          //   }
          // </div> */}
        )
      }
    />
  </>
  
}

export default connect(state => ({
  auth: state.auth.toJS(),
  // app: state.app.toJS()
}), dispatch => ({ 
  push,
}))(PrivateRoute)
