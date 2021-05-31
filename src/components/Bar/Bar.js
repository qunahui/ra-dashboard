import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

const Bar = (props) => {
  console.log('Rendering component.....')
  return (
    <div>
      <button
        onClick={() => {
          props.logout()
        }}
      >
        logout
      </button>
    </div>
  )
}

Bar.propTypes = {
  // name: PropTypes.string,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Bar)
