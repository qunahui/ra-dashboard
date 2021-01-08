import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { request } from '../../config/axios'

//ant ui
import { Row, Col, Image, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
// import MenuIcon from '@material-ui/icons/Menu'


function DashboardView(props) {

  useEffect(() => {

  }, [])

  return (
    <>
      {
        (!!props.storage.platformCredentials &&props.storage.platformCredentials.length === 0) ? 
          <>
            <Row justify="center">
              <Col span={16}>
                <Image src="../../assets/multitasking.png"/>
              </Col>
            </Row>
            <Row justify="center">
              <Button onClick={() => props.push('/app/create')} type="primary" size="large" icon={<RightOutlined />}>
                CONNECT NEW SHOP
              </Button>
            </Row>
          </>
        : <>You connected</>
      }
    </>
  )
}
export default connect(state => ({
  auth: state.auth.toJS(),
  storage: state.app.toJS().storage
}), dispatch => ({
  push: (path, state = undefined) => dispatch(push(path, state))
}))(DashboardView)