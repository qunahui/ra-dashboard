import React from 'react'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import BarChartIcon from '@material-ui/icons/BarChart'
import LayersIcon from '@material-ui/icons/Layers'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles } from '@material-ui/core/styles'

import { LinkItemLink } from '../CustomLink'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(8),
  },
}));

export function MainListItems(props) {
  return (
    <div>
      <LinkItemLink icon={<DashboardIcon />} primary="Dashboard" to="/app/dashboard" />
      <LinkItemLink icon={<PeopleIcon />} primary="Customers" to="/app/customers" />
    </div>
  )
}

export function SecondaryListItems(props){
  const classes = useStyles();
  const [openSendo, setOpenSendo] = React.useState(false);
  const [openTiki, setOpenTiki] = React.useState(false);

  return (
    <div className={classes.root}>
        <ListItem button onClick={() => setOpenSendo(!openSendo)}>
          <ListItemIcon>
            <ShoppingCartIcon/>
          </ListItemIcon>
          <ListItemText primary="Sendo" />
          {openSendo ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSendo} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <LinkItemLink primary="Dashboard" to="/app/sendo/dashboard"/>
            <LinkItemLink primary="Orders" to="/app/dashboard"/>
            <LinkItemLink primary="Products" to="/app/dashboard"/>
            <LinkItemLink primary="Customers" to="/app/dashboard"/>
            <LinkItemLink primary="Reports" to="/app/dashboard"/>
          </List>
        </Collapse>
        <ListItem button onClick={() => setOpenTiki(!openTiki)}>
          <ListItemIcon>
            <ShoppingCartIcon/>
          </ListItemIcon>
          <ListItemText primary="Tiki" />
          {openTiki ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openTiki} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <LinkItemLink primary="Dashboard" to="/app/dashboard"/>
            <LinkItemLink primary="Orders" to="/app/dashboard"/>
            <LinkItemLink primary="Products" to="/app/dashboard"/>
            <LinkItemLink primary="Customers" to="/app/dashboard"/>
            <LinkItemLink primary="Reports" to="/app/dashboard"/>
          </List>
        </Collapse>
    </div>
  )
}
