import React from 'react'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router'

import Creators from '../../redux/user'

function Alert(props) {
  const [open, setOpen] = React.useState(false) // notify

  React.useEffect(() => {
    const { error } = props.auth
    try {
      if(error) {
        setOpen(true)
      }
    } catch(e) {
      console.log("New error found :", e)
    }
  }, [props.auth])

  const handleClose = () => {
    setOpen(false)
    // props.push('/login')
    // setLoading(false)
    props.clearError()
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.auth?.error}</DialogTitle>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
  clearError: () => dispatch(Creators.clearError()),
  push: (location) => dispatch(push(location))
}))(Alert)

            // <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
  //  <MuiAlert elevation={6} variant="filled" severity="error">
  //     {props.auth.error?.message}
  //   </MuiAlert>
  // </Snackbar>