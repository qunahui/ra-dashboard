import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//app components
const Register = React.lazy(() => import('../../components/Register'))

const LoginView = (props) => {
  return <Register />
}

LoginView.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)
