import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import PurchaseOrderCreators from 'Redux/purchaseOrder'
import AllPurchaseOrderTable from 'Components/AllPurchaseOrderTable'
import './PurchaseOrderView.styles.scss'
import FilterPanel from './FilterPanel'


const { Text, Title } = Typography
const { TabPane } = Tabs

export const PurchaseOrderView = (props) => {

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
      {
        props.purchaseOrders?.length > 0 ? (
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
                  <Button type="primary" key="Tạo đơn đặt hàng" onClick={() => history.push('/app/products/purchase_orders/create')}>Tạo đơn đặt hàng</Button>,
                ]}
              >
                <TabPane tab={"Tất cả"} key={"Tất cả"}/>
                <TabPane tab={"Đặt hàng"} key={"Đặt hàng"} />
                <TabPane tab={"Duyệt"} key={"Duyệt"} />
                <TabPane tab={"Xuất kho/Đang giao hàng"} key={"Xuất kho/Đang giao hàng"}/>
                <TabPane tab={"Đã giao hàng"} key={"Đã giao hàng"}/>
                <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
                <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
                <TabPane tab={"Đang hoàn trả"} key={"Đang hoàn trả"}/>
                <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
              </Tabs>
              <AllPurchaseOrderTable purchaseOrders={props?.purchaseOrders}/>
            </Col>
          </Row>
        ) : (
          <Row justify={"center"}>
            <Col span={16} className={"front-text"}>
              <Text>Cửa hàng của bạn chưa có đơn nhập hàng nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => history.push('/app/products/purchase_orders/create')}
              >Tạo đơn nhập hàng đầu tiên</Button>
            </Col>
          </Row>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  purchaseOrders: state.purchaseOrder.toJS()?.purchaseOrders
})

const mapDispatchToProps = dispatch => ({
  getPurchaseOrdersStart: () => dispatch(PurchaseOrderCreators.getPurchaseOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderView)
