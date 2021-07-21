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

const { Text, Title } = Typography

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
          <Typography.Title level={2} copyable={false} style={{ color: blue[5]}}>Kết nối gian hàng mới</Typography.Title>
        </Row>
        <Col span={24} justify="center" style={{ backgroundColor: '#fff', padding: '20px', boxShadow: '0 .125rem .25rem rgba(0,28,68,.075)'}}>
          <Row>
            <Title level={4}>Nền tảng: SENDO</Title>
          </Row>
          <Row>
            <Text><b>Step 1: </b>Truy cập đường dẫn <a target="_blank" href="https://ban.sendo.vn/cau-hinh/api">https://ban.sendo.vn/cau-hinh/api</a>, chọn nút "Kết nối API".</Text>
          </Row> <br/>
          <Row>
            <Text><b>Step 2: </b>Nhập đường dẫn sau vào ô "Đường dẫn nhận dữ liệu": <a href="https://mms-track.netlify.app">https://mms-track.netlify.app</a>.</Text>
          </Row> <br/>
          <Row>
            <Text><b>Step 3: </b>Chọn tất cả 4 hành động nhận dữ liệu và bấm nút Lưu:</Text> <br/>
          </Row> <br/>
          <Row>
            <ul>
              <li style={{textAlign: "start"}}>Tạo đơn hàng</li>
              <li style={{textAlign: "start"}}>Tạo sản phẩm</li>
            </ul>
            <ul>
              <li style={{textAlign: "start"}}>Cập nhật đơn hàng</li>
              <li style={{textAlign: "start"}}>Cập nhật sản pahamr</li>
            </ul>
          </Row> <br/>
          <Row>
            <Text>Cuối cùng, bạn cần điền <b>Mã shop</b> và <b>Mã bảo mật</b> vào 2 ô bên dưới.</Text>
          </Row>
          <Divider/>
          <Row justify="center" style={{ marginTop: '40px'}}>
            <Col span={24}>
              <Form
                layout={"vertical"}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item name="app_key" label="Mã shop" rules={[{ required: true, message: 'This field is required!' }]}>
                  <Input size="large"/>
                </Form.Item>
                <Form.Item name="app_secret" label="Mã bảo mật" rules={[{ required: true, message: 'This field is required!' }]}>
                  <Input size="large"/>
                </Form.Item>
                <Form.Item>
                  <Button loading={loading} htmlType="submit" type="primary" size="large" style={{ fontSize: '24px', height: '50px'}} icon={<CheckCircleOutlined/>} block>Kết nối</Button>
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