import React, { Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router-dom'
//routes
import { authRoutes as routes } from '../../_routes'
//app components
import Spinners from '../../components/Spinners'
import { Row, Col } from 'antd'

const strongShadow = { boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)' }

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
      <Row style={{ height: '100vh'}}>
        <Col span={16} style={{ backgroundImage: "url('assets/working-background-1.jpg')", backgroundSize: '100% 100%'}}/>
        <Col span={8} style={strongShadow}>
          <Suspense fallback={<Spinners pulse />}>
            <Switch>
              {renderRoutes(routes)}
              <Redirect to="/404" />
            </Switch>
          </Suspense>
        </Col>
      </Row>
    )
}
AuthLayout.propTypes = {}

const mapStateToProps = (state) => ({
  isLogin: state.auth.toJS().isLogin
})

export default connect(mapStateToProps, { push })(AuthLayout)
