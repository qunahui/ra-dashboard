import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//app components
const Register = React.lazy(() => import('../../components/Register'))

const RegisterView = (props) => {
  console.log('rendering login view')
  return <Register />
}

RegisterView.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView)
