import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Input, Button, Row, Col, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { green, blue } from '@ant-design/colors' 
import { request } from 'Config/axios'
import toast from 'Helpers/ShowToast'

export const ChangePassword = (props) => {
    const history = useHistory()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pass, setPass] = useState('')
    const [retype, setRetype] = useState('')

    const handleChangePass = async () => {
        setLoading(true)
        setSuccess(false)
        try {
           if(pass !== retype) {
                return toast({ type: 'error', message: 'Mật khẩu và nhập lại mật khẩu không trùng khớp !' })
           }
           const token = window.location.search.split('?token=')?.[1]
           if(!token) {
                return toast({ type: 'error', message: 'Token không hợp lệ!' })
           }

           const result = await request.patch('/users/change-password', {
               password: pass,
               token 
           })

           if(result.code === 200) {
               return history.push('/login')
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
                    <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Đổi lại mật khẩu</Typography>
                    <Input type={"password"} size="large" value={pass} onChange={(e) => setPass(e.target.value)} style={{ padding: '18.5px 14px', marginBottom: 16 }} placeholder="Mật khẩu" />
                    <Input type={"password"} size="large" value={retype} onChange={(e) => setRetype(e.target.value)} style={{ padding: '18.5px 14px' }} placeholder="Nhập lại mật khẩu" />
                    <Button loading={loading} type="primary" onClick={handleChangePass} size="large" style={{ marginTop: 16, borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
                        Đặt lại mật khẩu
                    </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
