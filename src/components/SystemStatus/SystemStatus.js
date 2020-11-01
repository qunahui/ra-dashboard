import React from 'react'
import { sendoRequest } from '../../config/axios'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Title from '../Title'
import lightGreen from '@material-ui/core/colors/lightGreen'

const useStyles = makeStyles((theme) =>({
  root: {
    color: lightGreen
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}))

export default function SystemStatus() {
  const classes = useStyles()
  const [status, setSystemStatus] = React.useState({
    fetching: true,
    success: false, 
  })
  React.useEffect(() => {
    sendoRequest.post('', {
      targetUrl: 'https://open.sendo.vn/login',
      data: {
        shop_key: process.env.SENDO_SHOP_KEY,
        secret_key: process.env.SENDO_SECRET_KEY
    }
    }).then(res => {
      console.log(res)
      if(res.code === 200) {
        return setSystemStatus({
          fetching: false,
          success: true
        })
      } else {
        return setSystemStatus({
          fetching: false,
          success: false
        })
      }
    }).catch(err => setSystemStatus({
      fetching: false,
      success: false
    }))
  }, [])
  return (
    <div className={classes.root}>
      <Title>System status</Title>
      { status.fetching === true ? (
        <div className={classes.content}>
          <CircularProgress/>
        </div>
      ) : status.success === true ? "Connected" : "Failed"
      }
    </div>
  )
}
