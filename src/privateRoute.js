import React, { Component,useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'


import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

function PrivateRoute({ component: Component, push, auth,...rest }) {
  const [open, setOpen] = React.useState(false);
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
          </Dialog>
          </div>
        )
      }
    />
  </>
  
}

export default connect(state => ({
  auth: state.auth.toJS(),
}), { push })(PrivateRoute)
