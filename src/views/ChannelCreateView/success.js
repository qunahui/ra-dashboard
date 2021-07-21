import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Row, Col, Typography, Button, message} from 'antd'
import { blue } from '@ant-design/colors'

const CreateSuccessView = props => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '300px'}}>
      <Col span={16} justify="center">
        <Row justify="center">
          <Typography.Title level={2} copyable={false} style={{ color: blue[4]}}>Kết nối thành công! Đang khởi tạo dữ liệu và phân tích.</Typography.Title>
          <Typography.Text type="secondary" copyable={false}>Shop của bạn đã được kết nối. Vui lòng đợi dữ liệu được đồng bộ hóa hoặc kết nối nhiều cửa hàng hơn để quản lý toàn diện và phân tích cụ thể hơn.</Typography.Text>
        </Row>
        <br/>
        <Row justify="center">
          <Button onClick={() => props.push('/app/dashboard')} style={{ marginRight: '10px'}}>Quay về trang chính</Button>
          <Button type="primary" onClick={() => props.push('/app/create')}>Kết nối thêm!</Button>
        </Row>
      </Col>
    </Row>
  )
}  

export default connect(undefined, ({ push }))(CreateSuccessView)