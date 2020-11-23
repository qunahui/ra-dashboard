import React, { Component,useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import UserCreators from './redux/user'
import AppCreators from './redux/app'

function PrivateRoute({ component: Component, push, auth, app, checkUserSessionStart, signInSendoStart,...rest }) {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    checkUserSessionStart()
  },[])

  useEffect(() => {
    if(auth.isLogin){
      if(auth.user.isSendoAvailable) {
        signInSendoStart()
      }
    }
  }, [auth.isLogin])

  useEffect(() =>{
    if(auth.error) {
      setOpen(true)
    }
  }
  ,[auth])


  return <>
    <Route
      {...rest}
      render={(props) =>
        auth.isLogin === true ? (
          <Component {...props} />
        ) : (
          // <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          <div>
            { auth.error ? 
              <Dialog
                open={open}
                onClose={() => push('/login')}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
              <DialogTitle id="alert-dialog-title">{"User session expired !"}</DialogTitle>
              <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={() => push('/login')} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog> :
              <LinearProgress/>
            }
          </div>
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
  checkUserSessionStart: () => dispatch(UserCreators.checkUserSessionStart()),
  signInSendoStart: () => dispatch(AppCreators.signInSendoStart())
}))(PrivateRoute)
