import React from 'react'
import { request, sendoRequest } from '../../config/axios'
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Title from '../Title'
import lightGreen from '@material-ui/core/colors/lightGreen'
import { connect } from 'react-redux'
import Creators from '../../redux/user'
import FormLabel from '@material-ui/core/FormLabel'
import { Button, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) =>({
  root: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  successText: {
    color: '#8bc34a'
  },
  failText: {
    color: '#f44336'
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

function SystemStatus(props) {
  const { register, handleSubmit, watch, errors } = useForm()
  const classes = useStyles()
  const [status, setSystemStatus] = React.useState({
    success: false,
    reason: ''
  })

  const onSubmit = async (data) => {
    const result = await request.patch('/users/update', {
      sendoCredentials: data
    })

    props.signInSendoStart();
  }

  React.useEffect(() => {
    // // try login sendo
    if(!props.auth.isGettingSendoKey) {
      if(props.auth.sendoToken) {
        console.log("Done, sendo token setted")
        setSystemStatus({
          success: true,
          reason: ''
        })
      } else {
        console.log("Done, sendo token not setted")
        setSystemStatus({
          success: false,
          reason: props.auth.error?.message
        })
      }
    }
  }, [props.auth.isGettingSendoKey])

  return (
    <div className={clsx(props.loading ? classes.content : classes.root)}>
      { props.loading === true ? (
        <div className={classes.content}>
          <CircularProgress/>
        </div>
      ) : 
      <div>
          { (!status.success || !props.auth.sendoToken) ?
            <>
              <Title>Connect to SendoAPI</Title>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField 
                  className={classes.textField}
                  label="Shop key"
                  name="shop_key"
                  variant="outlined"
                  InputLabelProps={{
                  shrink: true,
                  }}
                  inputRef={register({ required: true })}
                />
                <TextField 
                  className={classes.textField}
                  label="Secret key"
                  name="secret_key"
                  variant="outlined"
                  InputLabelProps={{
                  shrink: true,
                  }} 
                  style={{ marginRight: 10}}
                  inputRef={register({ required: true })}
                />
                <Button variant="outlined" size="large" type="submit">Connect</Button>
              </form>
            </> : 
            <>
                <Title>System Status</Title>
                <Typography>Status: <span className={clsx(status.success ? classes.successText : failText)}>{status.success ? "Connected" : "Failed"}</span></Typography> <br/>
                <Button variant="outlined" size="small" onClick={() => setSystemStatus({ success: false, reason: 'Change shop credentials'})}>Change shop Credentials</Button>
            </>
          }
      </div>
      }
    </div>
  )
}

export default connect(state => ({
  auth: state.auth.toJS(),
}), dispatch => ({
  signInSendoStart: () => dispatch(Creators.signInSendoStart())
}))(SystemStatus)