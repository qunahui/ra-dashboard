import React, { Component,useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'

import UserCreators from './redux/user'
import AppCreators from './redux/app'
import { message, Progress } from 'antd'

function PrivateRoute({ component: Component, push, auth, app, checkUserSessionStart,...rest }) {
  const [open, setOpen] = React.useState(false);

  return <>
    <Route
      {...rest}
      render={(props) =>
        auth.isLogin === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          // <Progress
          //   strokeColor={{
          //     from: '#108ee9',
          //     to: '#87d068',
          //   }}
          //   percent={100}
          //   showInfo={false} 
          // />
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
  app: state.app.toJS()
}), dispatch => ({ 
  push,
}))(PrivateRoute)
