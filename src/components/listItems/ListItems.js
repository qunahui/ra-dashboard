import React from 'react'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import BarChartIcon from '@material-ui/icons/BarChart'
import LayersIcon from '@material-ui/icons/Layers'
import AssignmentIcon from '@material-ui/icons/Assignment'
import StorageIcon from '@material-ui/icons/Storage'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
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
    </div>
  )
}

export function SecondaryListItems(props){
  const classes = useStyles();
  const [openProducts, setOpenProducts] = React.useState(false);
  const [openInventory, setOpenInventory] = React.useState(false);
  const [openOrders, setOpenOrders] = React.useState(false);

  return (
    <div className={classes.root}>
        <ListItem button onClick={() => setOpenProducts(!openProducts)}>
          <ListItemIcon>
            <ShoppingCartIcon/>
          </ListItemIcon>
          <ListItemText primary="Products" />
          {openProducts ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <LinkItemLink primary="All products" to="/app/sendo/dashboard"/>
            <LinkItemLink primary="Create product" to="/app/dashboard"/>
            <LinkItemLink primary="Edit multiple products" to="/app/dashboard"/>
            <LinkItemLink primary="Create multiple products" to="/app/dashboard"/>
          </List>
        </Collapse>
        <ListItem button onClick={() => setOpenInventory(!openInventory)}>
          <ListItemIcon>
            <StorageIcon/>
          </ListItemIcon>
          <ListItemText primary="Inventory" />
          {openInventory ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openInventory} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <LinkItemLink primary="All products" to="/app/sendo/dashboard"/>
            <LinkItemLink primary="Create product" to="/app/dashboard"/>
            <LinkItemLink primary="Edit multiple products" to="/app/dashboard"/>
            <LinkItemLink primary="Create multiple products" to="/app/dashboard"/>
          </List>
        </Collapse>
        <ListItem button onClick={() => setOpenOrders(!openOrders)}>
          <ListItemIcon>
            <ShoppingBasketIcon/>
          </ListItemIcon>
          <ListItemText primary="Orders" />
          {openOrders ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openOrders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <LinkItemLink primary="All orders" to="/app/sendo/dashboard"/>
            <LinkItemLink primary="Create order" to="/app/dashboard"/>
          </List>
        </Collapse>
    </div>
  )
}
