import React, { useState, useEffect } from 'react'
import { request } from '../../config/axios'
import { connect } from 'react-redux' 
import { push } from 'connected-react-router' 
import AppCreators from '../../redux/app'

import { Row, Col, Typography, Button, Divider, Form, Input, message } from 'antd'
import CustomToast from '../../components/Helpers/ShowToast'
import toast from 'react-toastify'
import { blue, purple } from '@ant-design/colors'
import Icon, {CheckCircleOutlined} from '@ant-design/icons'

const SendoAuth = (props) => {
  const { isWorking } = props.app
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(isWorking)
  }, [isWorking])

  const onFinish = async values => {
    setLoading(true)
    props.connectSendoStart(values)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Row justify="center" align="middle" style={{ minHeight: '300px'}}>
      <Col span={16} justify="center">
        <Row justify="center">
          <Typography.Title level={2} copyable={false} style={{ color: blue[5]}}>Connect a new sales channel</Typography.Title>
        </Row>
        <Col span={24} justify="center" style={{ backgroundColor: '#fff', padding: '20px', boxShadow: '0 .125rem .25rem rgba(0,28,68,.075)'}}>
          <Row>
            Platform: <b>Sendo</b>
          </Row>
          <Row>
            <Typography><b>Step 1: </b>Visit the link <a target="_blank" href="https://ban.sendo.vn/cau-hinh/api">https://ban.sendo.vn/cau-hinh/api</a>, then select "Connect API".</Typography>
          </Row> <br/>
          <Row>
            <Typography><b>Step 2: </b>Enter the following link in the box "Get data path": <a href="https://api.link">https://api.link</a>.</Typography>
          </Row> <br/>
          <Row>
            <Typography><b>Step 3: </b>Select all 4 actions and click Save:</Typography> <br/>
          </Row> <br/>
          <Row>
            <ul>
              <li style={{textAlign: "start"}}>Create orders</li>
              <li style={{textAlign: "start"}}>Create products</li>
            </ul>
            <ul>
              <li style={{textAlign: "start"}}>Update orders</li>
              <li style={{textAlign: "start"}}>Update products</li>
            </ul>
          </Row> <br/>
          <Row>
            <Typography>Finally, you need to fill <b>Shop code</b> and <b>Secret code</b> in the two boxes below.</Typography>
          </Row>
          <Divider/>
          <Row justify="center" style={{ marginTop: '40px'}}>
            <Col span={24}>
              <Form
                layout={"vertical"}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item name="app_key" label="Shop code" rules={[{ required: true, message: 'This field is required!' }]}>
                  <Input size="large"/>
                </Form.Item>
                <Form.Item name="app_secret" label="Secret code" rules={[{ required: true, message: 'This field is required!' }]}>
                  <Input size="large"/>
                </Form.Item>
                <Form.Item>
                  <Button loading={loading} htmlType="submit" type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Connect</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Col>
    </Row>
  )
}

export default connect(state => ({
  app: state.app.toJS()
}), dispatch => ({
  push: (path, state) => dispatch(push(path, state)),
  connectSendoStart: (payload) => dispatch(AppCreators.connectSendoStart(payload)),
  addPlatformCredentials: (payload) => dispatch(AppCreators.addPlatformCredentials(payload))
}))(SendoAuth)