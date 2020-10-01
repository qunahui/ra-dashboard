import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import BarActions, { reducer } from './BarRedux'
import saga from './BarSaga'
import { Button } from 'antd'

class Bar extends Component {
  render() {
    return <div></div>
  }
}

Bar.propTypes = {
  // name: PropTypes.string,
}

const mapStateToProps = (state) => ({
  name: state.bar.toJS(),
})

const mapDispatchToProps = (dispatch) => ({})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Bar)
