import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Input, Button, Row, Col, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { green, blue } from '@ant-design/colors' 
import { request } from 'Config/axios'
import toast from 'Helpers/ShowToast'

export const ForgotPassword = (props) => {
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleForgot = async () => {
        setLoading(true)
        setSuccess(false)
        try {
            const result = await request.get(`/users/reset-password?email=${email}`)
            if(result.code === 200) {
                setSuccess(true)
            }
        } catch(e) {
            toast({ type: 'error', message: e.message })
        } finally {
            setLoading(false)
        }
    }

    return ( 
        <div>
            <Row type="flex" justify="center" style={{ minHeight: '100vh' }}>
                <Col span={16} justify="center" align="middle" style={{ padding: '16px 24px', minHeight: '640px', borderRadius: '30px', marginTop: '64px' }}>
                    <Avatar size={48} icon={<UserOutlined />} justify="center" style={{ color: '#fff', backgroundColor: blue[6] }} />
                    <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Quên mật khẩu</Typography>
                    <Input size="large" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '18.5px 14px' }} placeholder="Email" />
                    <Button loading={loading} type="primary" onClick={handleForgot} size="large" style={{ marginTop: 16, borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
                        Gửi mail
                    </Button>
                    {success && (
                        <div style={{ marginTop: 16 }}>
                            <Typography.Text strong style={{ color: green[4], fontSize: 16 }}>Vui lòng kiểm tra mail để đổi lại mật khẩu !</Typography.Text>
                        </div>
                    )}
                    <Link to={"/login"} ><div style={{ marginTop: 24 }}>Quay lại</div></Link>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
