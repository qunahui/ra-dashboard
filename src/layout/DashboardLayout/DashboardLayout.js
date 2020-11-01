import React, { Component, Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, useRoutes } from 'react-router-dom'
//routes
import navigation from '../../_navs'
import { routes } from '../../_routes'
//material ui
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import clsx from 'clsx'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles' 
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
// import LinearProgress from '@material-ui/core/LinearProgress';

//app components
import AppbarMenu from '../../components/AppbarMenu'
import Spinners from '../../components/Spinners'
import PrivateRoute from '../../privateRoute'
import { MainListItems, SecondaryListItems } from '../../components/listItems'
import Creators from '../../redux/user'

//
const drawerWidth = 240
export const light = {
  palette: {
    type: 'light',
  },
}
export const dark = {
  palette: {
  type: 'dark',
  },
}
//

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '20px',
  },
}))

const DashboardLayout = (props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const [theme, setTheme] = React.useState(true)
  const appliedTheme = createMuiTheme(theme ? light : dark)

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={route.key || route.path} {...route} />
      ) : null,
    )

  const { warning, user } = props
  console.log('Rendering layout......')

  useEffect(() => {
    props.checkUserSessionStart()
  }, [])

  return (
    <ThemeProvider theme={appliedTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={() => setTheme(!theme)}>
              {!theme ? <Brightness7Icon/> : <Brightness4Icon/>}
            </IconButton>
            <AppbarMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List onClick={handleDrawerOpen}><MainListItems/></List>
          <Divider />
          <List onClick={handleDrawerOpen}><SecondaryListItems /></List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Suspense fallback={<Spinners pulse />}>
              <Switch>
                {renderRoutes(routes)}
                <Redirect to="/404" />
              </Switch>
            </Suspense>
            <Suspense fallback={<Spinners pulse />}></Suspense>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  )
}

DashboardLayout.propTypes = {}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  checkUserSessionStart: () => dispatch(Creators.checkUserSessionStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
