import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
// Material-UI
import Snackbar from '@material-ui/core/Snackbar'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
// import { useForm } from 'react-hook-form'

//axios
//app components
import GoogleIcon from '../../assets/google.svg'
import FacebookIcon from '../../assets/facebook.svg'
import Alert from '../Alert'
import Creators from '../../redux/user'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginBottom: "15px",
    fontWeight: "400",
    fontSize: "16px",
  },
  googleIcon: {
    height: "32px",
    float: "left",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  }
}))

function SignIn(props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = React.useState(false) // notify
  const classes = useStyles()

  useEffect(() => {
    console.log("Auth state changed....")
    const { error } = props.auth
    if (error) {
      setOpen(true)
    }
  }, [props.auth])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    setLoading(false)
    props.clearError()
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
      </div>
      <Container fixed>
      <Button
            type="button"
            fullWidth
            variant="outlined"
            className={classes.button}
            disabled={loading}
            onClick={props.googleSignInStart}
          >
            <img src={GoogleIcon} className={classes.googleIcon}/>&nbsp;Sign in with Google
          </Button>
        <Button
            type="button"
            fullWidth
            variant="outlined"
            className={classes.button}
            disabled={loading}
            onClick={props.facebookSignInStart}
          >
            <img src={FacebookIcon} className={classes.googleIcon}/>&nbsp;Sign in with Facebook
          </Button>
      </Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {props.auth.error?.message}
        </Alert>
      </Snackbar>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default connect(
  (state) => ({
    auth: state.auth.toJS(),
  }),
  (dispatch) => ({
    facebookSignInStart: () => dispatch(Creators.facebookSignInStart()),
    googleSignInStart: () => dispatch(Creators.googleSignInStart()),
    clearError: () => dispatch(Creators.clearError()),
  }),
)(withRouter(SignIn))

