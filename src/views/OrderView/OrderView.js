import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import OrderCreators from 'Redux/order'
import AllOrderTable from 'Components/AllOrderTable'
import './OrderView.styles.scss'
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

export const OrderView = (props) => {
  const [activeKey, setActiveKey] = useState("Tất cả")

  useEffect(() => {
    props.getOrdersStart(INITIAL_FILTER)
  }, [])


  const history = useHistory()
  return (
    <>
    <Row justify={"center"}>
      <Col span={16}>
        <Title level={3}>Đơn xuất hàng</Title>
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
            <Button type="primary" key="Tạo đơn hàng" onClick={() => history.push('/app/orders/create')}>Tạo đơn hàng</Button>,
          ]}
          onChange={(e) => {
            setActiveKey(e)
            props.getOrdersStart({ ...INITIAL_FILTER, orderStatus: e })
          }}
        >
          <TabPane tab={"Tất cả"} key={"Tất cả"}/>
          <TabPane tab={"Đã duyệt"} key={"Duyệt"} />
          <TabPane tab={"Đóng gói"} key={"Đóng gói"} />
          <TabPane tab={"Xuất kho/Đang giao hàng"} key={"Xuất kho/Đang giao hàng"}/>
          <TabPane tab={"Đã giao hàng"} key={"Đã giao hàng"}/>
          <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
          <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
          <TabPane tab={"Đang hoàn trả"} key={"Đang hoàn trả"}/>
          <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
        </Tabs>
        <FilterPanel 
          defaultFilter={INITIAL_FILTER}
          handleFilterSubmit={(values) => {
            props.getOrdersStart(values)
          }}
        />
        <AllOrderTable orders={props?.orders}/>
      </Col>
    </Row>
    </>
  )
}

const mapStateToProps = (state) => ({
  orders: state.order.toJS()?.orders
})

const mapDispatchToProps = dispatch => ({
  getOrdersStart: (filter) => dispatch(OrderCreators.getOrdersStart(filter))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderView)
