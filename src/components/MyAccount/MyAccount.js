import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Card, Typography, Input, Divider, Button } from 'antd'
import { connect } from 'react-redux'
import { cardBorder } from './style'
import AppCreators from 'Redux/app'
import UserCreators from 'Redux/user'
import toast from 'Helpers/ShowToast'
import './styles.scss'

const { Title, Text } = Typography

export const MyAccount = ({ user, changePasswordStart, updateUserStart }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue(user)
    }, [])

    const onFinish = (values) => {
        updateUserStart(values)
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    return (
        <>
         <Card 
            title={<Title level={4} style={{ marginLeft: 8 }}>Thông tin cá nhân</Title>}
            style={cardBorder}
         >
            <Form
                form={form} 
                name={'account-form'}
                layout={'vertical'}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={16, 16}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name={"displayName"}
                            label={"Họ và tên"}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name={"address"}
                            label={"Địa chỉ"}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name={"phone"}
                            label={"Số điện thoại"}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name={"email"}
                            label={"Email"}
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider/>
                <Row justify="end">
                    <Button type={"primary"} htmlType={"submit"}>Lưu</Button>
                </Row>
            </Form>
        </Card>
        <Divider/>
        <Card 
            title={<Title level={4} style={{ marginLeft: 8 }}>Đổi mật khẩu</Title>}
            style={cardBorder}
        >
            <Form
                // form={form}
                name={'password-form'}
                layout={'vertical'}
                onFinish={(values) => {
                    changePasswordStart({ ...values, email: user.email })
                }}
                onFinishFailed={() => {}}
            >
                <Row
                    gutter={[16, 16]}
                >

                    <Col span={24}>
                        <Form.Item
                            name={"oldPassword"}
                            label={"Nhập vào mật khẩu cũ"}
                            rules={[{ required: true, message: 'Trường nhập vào mật khẩu cũ là cần thiết'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"password"}
                            label={"Nhập vào mật khẩu mới"}
                            rules={[{ required: true, message: 'Trường nhập vào mật khẩu mới là cần thiết'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"confirm"}
                            label={"Nhập lại mật khẩu mới"}
                            rules={[{ required: true, message: 'Trường nhập lại mật khẩu là cần thiết'}, ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Nhập lại mật khẩu không trùng khớp!'));
                                },
                              }),]}
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider/>
                <Row justify="end">
                    <Button type={"primary"} htmlType={"submit"}>Lưu</Button>
                </Row>
            </Form>
        </Card>
        </>
    )
}

const mapStateToProps = ({ auth }) => ({
    user: auth.toJS()?.user
})

const mapDispatchToProps = dispatch => ({
    changePasswordStart: (payload) => dispatch(AppCreators.changePasswordStart(payload)),
    updateUserStart: (payload) => dispatch(UserCreators.updateUserStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount)
