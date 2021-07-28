import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import RefundOrderCreators from 'Redux/refundOrder'
import AllRefundOrderTab from './AllRefundOrderTab'
import './RefundOrderView.styles.scss'
import FilterPanel from './FilterPanel'


const { Text, Title } = Typography
const { TabPane } = Tabs

export const RefundOrderView = (props) => {
  useEffect(() => {
    props.getRefundOrdersStart()
  }, [])

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn hoàn hàng</Title>
          <Divider/>  
        </Col>
      </Row>
      <Row
        style={{ 
          backgroundColor: '#fff',
          padding: '8px 24px',
          border: '1px solid #ccc',
          borderRadius: 5
        }}
      >
        <Col span={24}>
          <Tabs 
            defaultActiveKey="tất cả" 
            destroyInactiveTabPane={true} 
            tabBarExtraContent={[
              <Button type="primary" key="Tạo đơn hoàn hàng" onClick={() => history.push('/app/orders/refund/create')}>Tạo đơn hoàn hàng</Button>,
            ]}
          >
            <TabPane tab="Tất cả" key="tất cả"/>
            <TabPane tab="Đã duyệt" key="Đã duyệt"/>
            <TabPane tab="Đã nhập kho" key="Đang giao dịch"/>
            <TabPane tab="Hoàn thành" key="Hoàn thành"/>
          </Tabs>
          <FilterPanel/>
          <AllRefundOrderTab refundOrders={props?.refundOrders}/>
        </Col>
      </Row>
    </>
  )
}

const mapStateToProps = (state) => ({
  refundOrders: state.refundOrder.toJS()?.refundOrders
})

const mapDispatchToProps = dispatch => ({
  getRefundOrdersStart: () => dispatch(RefundOrderCreators.getRefundOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundOrderView)
