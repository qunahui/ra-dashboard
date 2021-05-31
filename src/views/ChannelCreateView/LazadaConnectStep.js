import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Row} from 'antd'
import Spinner from '../../assets/spinner.svg'
import { toast } from 'react-toastify'
import AppCreators from '../../redux/app'

const LazadaConnectStep = props => {
  const query = props.location.search

  useEffect(() => {
    toast('🏪Đang xử lý gian hàng.....', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
      
    if(query) {
      props.connectLazadaStart({ query })
    }
  }, [])

  return (
    <>
      <Row justify="center" align="middle" style={{ height: '80vh'}}>
        <Spinner style={{ width: 100, height: 100}}/>
      </Row>
    </>
  )
}  

export default connect(undefined, dispatch => ({ 
  connectLazadaStart: (query) => dispatch(AppCreators.connectLazadaStart(query))
}))(LazadaConnectStep)