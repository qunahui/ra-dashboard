import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Typography, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors' 
import toast from 'Helpers/ShowToast'
import NProgress from 'nprogress'

import Creators from '../../redux/user'

const Register = (props) => {
  const history = useHistory()
  const onFinish = async values => {
    NProgress.configure({ trickle: false})
    NProgress.start()
    props.signUpStart(values)
  };
  
  React.useEffect(() => {
    if(props.auth.error?.message) {
      setLoading(false)
    }
  },[props.auth.error])

  useEffect(() => {
    if (props.isLogin) {
      props.history.push('/')
    }
  }, [props.isLogin])

  const onFinishFailed = errorInfo => {
    // toast({ type: 'error', message: 'Mật khẩu không khớp. Vui lòng kiểm tra lại' })
  };

  return (
    <div gutter={[16, 16]}>
      <Row justify="center" style={{ borderRadius: '30px', marginTop: '16px' }}>
        <Col xs={24} style={{textAlign: 'center'}}>
          <Avatar size={48} icon={<UserOutlined />} justify="center" style={{ color: '#fff', backgroundColor: blue[6] }} />
        </Col>
        <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Đăng ký</Typography>
      </Row>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout={"vertical"}
      >
        <Row justify="center" gutter={16} style={{ margin: '0 16px' }}>
        <Col xs={24} lg={12}>
          <Form.Item
            name="displayName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Nhập vào họ và tên" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập vào phone" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={24}>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Nhập vào địa chỉ" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={24}>
          <Form.Item
            name="storageName"
            label="Tên kho hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên kho hàng!' }]}
          >
            <Input placeholder="Nhập vào tên kho hàng" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={24}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input placeholder="Nhập vào email" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="retype"
            label="Nhập lại mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu và nhập lại mật khẩu không trùng khớp!'))
              },
            }),
          ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>
        </Col>
        <Col xs={16} lg={16} style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ marginBottom: 8, borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
            Đăng ký
          </Button>
          <Button onClick={() => history.push('/login')} style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
            Đã có tài khoản ? 
          </Button>
        </Col>
        </Row>
      </Form>
    </div>
  );
};


export default connect(state => ({
  auth: state.auth.toJS(),
}), dispatch => ({
  signUpStart: (values) => dispatch(Creators.signUpStart(values))
}))(withRouter(Register));
