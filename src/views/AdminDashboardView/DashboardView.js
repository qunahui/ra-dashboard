import React, { useEffect } from 'react'
import { Admin, Resource, ListGuesser } from 'react-admin'

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
import Chart from '../../components/Chart'
import Deposits from '../../components/Deposits'
import Orders from '../../components/Orders'
import { getCurrentUser } from '../../utils/firebase'

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
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '20px',
  },
  fixedHeight: {
    height: 240,
  },
}))

export default function DashboardView() {
  const classes = useStyles()
  
  return (
    <Admin authProvider>
      
    </Admin>  
  )
}
