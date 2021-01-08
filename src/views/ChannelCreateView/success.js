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
          <Typography.Title level={2} copyable={false} style={{ color: blue[4]}}>Shop connection is successful! Initiating data sync and analytics.</Typography.Title>
          <Typography.Text type="secondary" copyable={false}>Your shop is connected and named as <Typography.Text style={{ color: blue[4]}}>{props.location.state.store_name && props.location.state.store_name}</Typography.Text> in PowerSell. Please wait for data to be synced, or connect more shops for holistic management and insightful analytics from the beginning.</Typography.Text>
        </Row>
        <br/>
        <Row justify="center">
          <Button onClick={() => props.push('/app/dashboard')} style={{ marginRight: '10px'}}>Go to dashboard</Button>
          <Button type="primary" onClick={() => props.push('/app/create')}>Connect more!</Button>
        </Row>
      </Col>
    </Row>
  )
}  

export default connect(undefined, ({ push }))(CreateSuccessView)