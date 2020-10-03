import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
//routes
import { authRoutes as routes } from '../../_routes'
//app components
import Spinners from '../../components/Spinners'

export class AuthLayout extends Component {
  renderRoutes = (routes = {}, userRole = '') =>
    routes.map(({ key, component: Component, componentProps, path, name, exact, rolesAccess }) => {
      return Component && rolesAccess.includes(userRole) ? (
        <Route
          key={key || path}
          path={path}
          exact={exact}
          name={name}
          render={(props) => <Component {...props} {...componentProps} />}
        />
      ) : null
    })

  render() {
    console.log('Rendering auth layout......')
    return (
      <div className="auth-layout">
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
AuthLayout.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLayout)
