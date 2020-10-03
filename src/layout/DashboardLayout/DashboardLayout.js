import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, useRoutes } from 'react-router-dom'
//routes
import navigation from '../../_navs'
import { routes } from '../../_routes'
//app components
import Spinners from '../../components/Spinners'
import PrivateRoute from '../../privateRoute'

export class DashboardLayout extends Component {
  renderRoutes = (routes = {}, userRole = '') =>
    routes.map((route) =>
      Component && route.rolesAccess.includes(userRole) ? (
        <PrivateRoute key={route.key || route.path} {...route} />
      ) : null,
    )

  render() {
    const { warning, user } = this.props
    console.log('Rendering layout......')

    return (
      <div className="layout">
        <Suspense fallback={<Spinners pulse />}>
          <Switch>
            {this.renderRoutes(routes)}
            <Redirect to="/404" />
          </Switch>
        </Suspense>
        <Suspense fallback={<Spinners pulse />}></Suspense>
      </div>
    )
  }
}

DashboardLayout.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)
