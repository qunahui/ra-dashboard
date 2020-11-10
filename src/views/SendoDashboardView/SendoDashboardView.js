import React, { useEffect } from 'react'
import { connect } from 'react-redux'

//material ui
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

// import MenuIcon from '@material-ui/icons/Menu'

//App components
import Creators from '../../redux/user'
import SystemStatus from '../../components/SystemStatus'

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
    padding: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '20px',
  },
  fixedHeight: {
 
  },
}))

function SendoDashboardView(props) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(true);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  React.useEffect(() => {
    if(!props.auth.isGettingUser){
      props.signInSendoStart()
    }
  }, [props.auth.isGettingUser])
  
  React.useEffect(() => {
    if(!props.auth.isGettingUser && !props.auth.isGettingSendoKey) {
      setLoading(false);
    }
  }, [props.auth.isGettingUser, props.auth.isGettingSendoKey])

  return (
    <div>
      <Grid container spacing={1}>
        {/* System status */}
        <Grid item xs={3}>
          <Paper className={fixedHeightPaper}>
            <SystemStatus loading={loading}/>
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </div>
  )
}

export default connect(state => ({
  auth: state.auth.toJS()
}), dispatch => ({
  signInSendoStart: () => dispatch(Creators.signInSendoStart())
}))(SendoDashboardView)