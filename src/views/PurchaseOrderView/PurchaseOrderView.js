import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import PurchaseOrderCreators from 'Redux/purchaseOrder'
import AllPurchaseOrderTable from 'Components/AllPurchaseOrderTable'
import './PurchaseOrderView.styles.scss'
import FilterPanel from './FilterPanel'
import moment from 'moment'


const { Text, Title } = Typography
const { TabPane } = Tabs

const d = new Date()

const INITIAL_FILTER =  {
  orderStatus: 'Tất cả',
  code: '',
  supplierName: '',
  supplierPhone: '',
  dateFrom:  new Date(new Date(d.setDate(d.getDate()- 14)).setHours(0, 0, 0, 0)),
  dateTo: new Date(new Date().setHours(23, 59, 59, 59)),
}

export const PurchaseOrderView = (props) => {
  const [activeKey, setActiveKey] = useState('Tất cả')

  useEffect(() => {
    props.getPurchaseOrdersStart(INITIAL_FILTER)
  }, [])

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn nhập hàng</Title>
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
                  <Button type="primary" key="Tạo đơn đặt hàng" onClick={() => history.push('/app/products/purchase_orders/create')}>Tạo đơn đặt hàng</Button>,
                ]}
                onChange={(e) => {
                  setActiveKey(e)
                  props.getPurchaseOrdersStart({ ...INITIAL_FILTER, orderStatus: e })
                }}
              >
                <TabPane tab={"Tất cả"} key={"Tất cả"}/>
                <TabPane tab={"Đặt hàng và duyệt"} key={"Đặt hàng và duyệt"} />
                <TabPane tab={"Nhập kho"} key={"Nhập kho"} />
                <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
                <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
                <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
              </Tabs>
              <FilterPanel defaultFilter={INITIAL_FILTER} handleFilterSubmit={(values) => {
                props.getPurchaseOrdersStart(values)
              }}/>
              <AllPurchaseOrderTable purchaseOrders={props?.purchaseOrders}/>
            </Col>
          </Row>
    </>
  )
}

const mapStateToProps = (state) => ({
  purchaseOrders: state.purchaseOrder.toJS()?.purchaseOrders
})

const mapDispatchToProps = dispatch => ({
  getPurchaseOrdersStart: (payload) => dispatch(PurchaseOrderCreators.getPurchaseOrdersStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderView)
