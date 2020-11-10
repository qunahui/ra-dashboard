import React from 'react'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import Creators from '../../redux/user'

function Alert(props) {
  const [open, setOpen] = React.useState(false) // notify

  React.useEffect(() => {
    const { error } = props.auth
    if (error) {
      console.log("New error found :", error)
      setOpen(true)
    }
  }, [props.auth])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    // setLoading(false)
    props.clearError()
  }
  return (
  <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
   <MuiAlert elevation={6} variant="filled" severity="error">
      {props.auth.error?.message}
    </MuiAlert>
  </Snackbar>
  )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
  clearError: () => dispatch(Creators.clearError())
}))(Alert)
