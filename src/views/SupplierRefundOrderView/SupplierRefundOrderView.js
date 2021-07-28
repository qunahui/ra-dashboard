import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import SupplierRefundOrderCreators from 'Redux/supplierRefundOrder'
import AllSupplierRefundOrderTab from './AllSupplierRefundOrderTab'
import './SupplierRefundOrderView.styles.scss'
import FilterPanel from './FilterPanel'

const { Text, Title } = Typography
const { TabPane } = Tabs


const INITIAL_FILTER =  {
  orderStatus: 'Tất cả',
  code: '',
  supplierName: '',
  supplierPhone: '',
  dateFrom: new Date(new Date().setDate(new Date().getDate() - 14)),
  dateTo: new Date(),
}


export const RefundOrderView = (props) => {
  const [activeKey, setActiveKey] = useState("Tất cả")
  useEffect(() => {
    props.getSupplierRefundOrdersStart()
  }, [])

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn hoàn hàng NCC</Title>
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
                <Button type="primary" key="Tạo đơn hoàn hàng" onClick={() => history.push('/app/products/supplier_refund_orders/create')}>Tạo đơn hoàn hàng</Button>,
              ]}
              onChange={(e) => {
                setActiveKey(e)
                props.getSupplierRefundOrdersStart({ orderStatus: e })
              }}
            >
              <TabPane tab={"Tất cả"} key={"Tất cả"}/>
              <TabPane tab={"Đặt hàng và duyệt"} key={"Đặt hàng và duyệt"} />
              <TabPane tab={"Xuất kho"} key={"Xuất kho"} />
              <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
              <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
              <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
            </Tabs>
            <FilterPanel handleFilterSubmit={(values) => {
              props.getSupplierRefundOrdersStart(values)
            }}/>
            <AllSupplierRefundOrderTab refundOrders={props?.refundOrders}/>
          </Col>
        </Row>

    </>
  )
}

const mapStateToProps = (state) => ({
  refundOrders: state.supplierRefundOrder.toJS()?.refundOrders
})

const mapDispatchToProps = dispatch => ({
  getSupplierRefundOrdersStart: (payload) => dispatch(SupplierRefundOrderCreators.getSupplierRefundOrdersStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundOrderView)
