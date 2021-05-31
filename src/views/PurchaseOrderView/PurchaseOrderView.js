import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import PurchaseOrderCreators from 'Redux/purchaseOrder'
import AllPurchaseOrderTable from 'Components/AllPurchaseOrderTable'
import './PurchaseOrderView.styles.scss'


const { Text, Title } = Typography
const { TabPane } = Tabs

export const PurchaseOrderView = (props) => {
  const [purchaseOrderList, setPurchaseOrderList] = useState([])

  useEffect(() => {
    props.getPurchaseOrdersStart()
  }, [])

  useEffect(() => {
    const { purchaseOrders, isWorking } = props.purchaseOrder
    if(!_.isEqual(purchaseOrders, purchaseOrderList) && !isWorking) {
      setPurchaseOrderList(purchaseOrders)
    }
  }, [props.purchaseOrder])

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
        purchaseOrderList.length > 0 ? (
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
                  <Button type="primary" key="Tạo đơn đặt hàng" onClick={() => history.push('/app/purchase_orders/create')}>Tạo đơn đặt hàng</Button>,
                ]}
              >
                <TabPane tab="Tất cả" key="tất cả">
                  <AllPurchaseOrderTable purchaseOrders={purchaseOrderList}/>
                </TabPane>
                <TabPane tab="Đang giao dịch" key="Đang giao dịch">
                  {/* <LinkedFailProductTab/> */}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        ) : (
          <Row justify={"center"}>
            <Col span={16} className={"front-text"}>
              <Text>Cửa hàng của bạn chưa có đơn nhập hàng nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => history.push('/app/purchase_orders/create')}
              >Tạo đơn nhập hàng đầu tiên</Button>
            </Col>
          </Row>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  purchaseOrder: state.purchaseOrder.toJS()
})

const mapDispatchToProps = dispatch => ({
  getPurchaseOrdersStart: () => dispatch(PurchaseOrderCreators.getPurchaseOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderView)
