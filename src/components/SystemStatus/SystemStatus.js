import React from 'react'
import {request} from '../../config/axios'
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
  const [status, setStatus] = React.useState(false);
  React.useEffect(() => {
    request.post('https://open.sendo.vn/login', JSON.stringify({
      shop_key: "25d5bdee6f8a41ada2a362c9579df9c2",
      secret_key: "3de7a9a2e5aa483db23a1cce5d4da45d",
    })).then(res => console.log(res)).catch(err => console.log(err))
  }, [])
  return (
    <div className={classes.root}>
      <Title>System status</Title>
      { !status ? (
        <div className={classes.content}>
          <CircularProgress/>
        </div>
      ) : (
        <div>Ok</div>
      )}
    </div>
  )
}
