import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Typography, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors' 
import NProgress from 'nprogress'

import Creators from '../../redux/user'

const SignIn = (props) => {
  const history = useHistory()
  const onFinish = async values => {
    NProgress.configure({ trickle: false })
    NProgress.start()
    props.emailSignInStart(values)
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
  };

  return (
    <Row type="flex" justify="center" style={{ minHeight: '100vh' }}>
      <Col span={16} justify="center" align="middle" style={{ padding: '16px 24px', minHeight: '640px', borderRadius: '30px', marginTop: '64px' }}>
        <Avatar size={48} icon={<UserOutlined />} justify="center" style={{ color: '#fff', backgroundColor: blue[6] }} />
        <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Đăng nhập</Typography>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" style={{ padding: '18.5px 14px' }} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" style={{ padding: '18.5px 14px' }} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Button onClick={() => history.push('/register')} size="large" style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
            Đăng ký
        </Button>
      </Col>
    </Row>
  );
};


export default connect(state => ({
  auth: state.auth.toJS(),
}), dispatch => ({
  reset: () => dispatch(Creators.reset()),
  emailSignInStart: (payload) => dispatch(Creators.emailSignInStart(payload)),
  // facebookSignInStart: () => dispatch(Creators.facebookSignInStart()),
  googleSignInStart: () => dispatch(Creators.googleSignInStart()),
}))(withRouter(SignIn));
