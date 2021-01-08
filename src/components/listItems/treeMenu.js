import React from 'react'
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import { List } from '@material-ui/core';

export default function SecondaryListItems(props){
  const [open, setOpen] = React.useState(false);

  return (
    <div>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemIcon>
            <ShoppingCartIcon/>
          </ListItemIcon>
          <ListItemText primary="Products" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/app/sendo/">
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="All products" />
            </ListItem>
          </List>
        </Collapse>
    </div>
  )
}
