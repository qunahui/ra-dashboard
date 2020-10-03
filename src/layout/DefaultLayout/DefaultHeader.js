import React, { Component } from 'react'
import { createStructuredSelector } from 'reselect'
import { Typography } from 'antd'
import { connect } from 'react-redux'

import { VIETNAMESE_CODE, ENGLISH_CODE } from '../../utils/constants'

import './DefaultHeader.scss'

const { Text } = Typography

/* eslint-disable react/prefer-stateless-function */
class DefaultHeader extends Component {
  state = {}

  render() {
    return <></>
  }
}

DefaultHeader.propTypes = {}

DefaultHeader.defaultProps = {}

const mapStateToProps = createStructuredSelector({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader)
