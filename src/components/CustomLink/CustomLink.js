import React from 'react'
import { Link } from 'react-router-dom'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'

export function LinkItemLink(props) {
  const { primary, icon, to } = props

  const CustomLink = React.useMemo(
    () => React.forwardRef((linkProps, ref) => <Link ref={ref} to={to} {...linkProps} />),
    [to],
  )

  return (
    <ListItem button component={CustomLink}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  )
}