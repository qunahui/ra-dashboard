import React from 'react'
import { connect } from 'react-redux'

export const item = (props) => {
  return (
    <div>
      Item page
    </div>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(item)
