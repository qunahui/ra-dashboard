import React from 'react'
import { Row, Col, Typography, Button } from 'antd'
import { useHistory } from 'react-router-dom'

const { Title } = Typography

export const NotConnected = (props) => {
    const history = useHistory()
    return (
        <Row justify={"center"}>
            <Col span={16}>
                <img src={"/assets/multitasking.png"} style={{ width: '100%' }}/>
            </Col>
            <Col span={16} style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={3}>Bạn chưa kết nối sàn TMĐT nào. Hãy kết nối ngay để sử dụng các tính năng của hệ thống !</Title>
            </Col>
            <Col span={16} style={{ textAlign: 'center'}}>
                <Button style={{ fontSize: 32, width: '50%', height: '100%', borderRadius: 5 }} onClick={() => history.push('/app/create')} type={"primary"}>Kết nối ngay</Button>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default NotConnected
