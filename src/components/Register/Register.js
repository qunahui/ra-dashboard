import React, { useState } from 'react'
import {connect} from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useForm } from 'react-hook-form'
import Title from '../Title'

import Creators from '../../redux/user'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Register = (props) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, errors, watch } = useForm()

  const onSubmit = (data) => {
    setLoading(true)
    console.log("data: ", data)
    const { email, displayName, password } = data
    props.signUpStart({ email, displayName, password })
  }

  React.useEffect(() => {
    if(props.auth.error?.message) {
      setLoading(false)
    }
  },[props.auth.error])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Title>Your infomations</Title> <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="dname"
                name="displayName"
                variant="outlined"
                fullWidth
                id="displayName"
                label="Display Name (3-16)"
                autoFocus
                inputRef={register({
                  required: 'Display name is required',
                  minLength: {
                    value: 3,
                    message: 'Display name must be longer than 3',
                  },
                  maxLength: {
                    value: 16,
                    message: 'Display name must be fewer than 16',
                  },
                  pattern: {
                    value: /^[a-zA-Z]+( [a-zA-Z]+)*$/i,
                    message: 'Display name only contain texts and white space between',
                  },
                })}
                error={!!errors.displayName}
                helperText={errors.displayName?.message}
              />
            </Grid>
          </Grid>
          <br />
          <Title>Login details</Title> <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={register({
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={register({
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be longer than 6',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="confirmPassword"
                label="Confirm password"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
                inputRef={register({
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value !== watch('password')
                      ? 'Confirm password must be match with password field'
                      : null,
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            { loading && <CircularProgress/> }Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
  signUpStart: (payload) => dispatch(Creators.signUpStart(payload))
}))(Register);