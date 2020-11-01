import React, { Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router-dom'
//routes
import { authRoutes as routes } from '../../_routes'
//app components
import Spinners from '../../components/Spinners'

const AuthLayout = (props) => {
  const renderRoutes = (routes = {}, userRole = '') =>
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
  useEffect(() => {
    const { isLogin } = props
    if(isLogin) {
      props.push('/app/dashboard')
    }
  }, [props.isLogin])

  return (
      <div className="auth-layout">
        <Suspense fallback={<Spinners pulse />}>
          <Switch>
            {renderRoutes(routes)}
            <Redirect to="/404" />
          </Switch>
        </Suspense>
        <Suspense fallback={<Spinners pulse />}></Suspense>
      </div>
    )
}
AuthLayout.propTypes = {}

const mapStateToProps = (state) => ({
  isLogin: state.auth.toJS().isLogin
})

export default connect(mapStateToProps, { push })(AuthLayout)
