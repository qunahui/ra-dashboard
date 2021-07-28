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

const d = new Date()

const INITIAL_FILTER =  {
  orderStatus: 'Tất cả',
  code: '',
  customerName: '',
  customerPhone: '',
  dateFrom:  new Date(new Date(d.setDate(d.getDate()- 14)).setHours(0, 0, 0, 0)),
  dateTo: new Date(new Date().setHours(23, 59, 59, 59)),
}

export const RefundOrderView = (props) => {
  const [activeKey, setActiveKey] = useState("Tất cả")

  useEffect(() => {
    props.getRefundOrdersStart(INITIAL_FILTER)
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
            activeKey={activeKey}
            destroyInactiveTabPane={true} 
            tabBarExtraContent={[
              <Button type="primary" key="Tạo đơn hoàn hàng" onClick={() => history.push('/app/orders/refund/create')}>Tạo đơn hoàn hàng</Button>,
            ]}
            onChange={(e) => {
              setActiveKey(e)
              props.getRefundOrdersStart({ ...INITIAL_FILTER, orderStatus: e })
            }}
          >
            <TabPane tab="Tất cả" key="Tất cả"/>
            <TabPane tab="Đã duyệt" key="Đã duyệt"/>
            <TabPane tab="Đã nhập kho" key="Đã nhập kho"/>
            <TabPane tab="Hoàn thành" key="Hoàn thành"/>
          </Tabs>
          <FilterPanel
             defaultFilter={INITIAL_FILTER}
             handleFilterSubmit={(values) => {
              props.getRefundOrdersStart(values)
            }}
          />
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
  getRefundOrdersStart: (payload) => dispatch(RefundOrderCreators.getRefundOrdersStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundOrderView)
