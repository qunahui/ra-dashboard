import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import PurchaseOrderCreators from 'Redux/purchaseOrder'
import AllPurchaseOrderTable from 'Components/AllPurchaseOrderTable'
import './PurchaseOrderView.styles.scss'
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


export const PurchaseOrderView = (props) => {
  const [activeKey, setActiveKey] = useState('Tất cả')
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )

  useEffect(() => {
    props.getPurchaseOrdersStart()
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
                  props.getPurchaseOrdersStart({ orderStatus: e })
                }}
              >
                <TabPane tab={"Tất cả"} key={"Tất cả"}/>
                <TabPane tab={"Đặt hàng và duyệt"} key={"Đặt hàng và duyệt"} />
                <TabPane tab={"Nhập kho"} key={"Nhập kho"} />
                <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
                <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
                <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
              </Tabs>
              <FilterPanel handleFilterSubmit={(values) => {
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
