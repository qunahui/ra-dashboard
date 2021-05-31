import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import SupplierRefundOrderCreators from 'Redux/supplierRefundOrder'
import AllSupplierRefundOrderTab from './AllSupplierRefundOrderTab'
import './SupplierRefundOrderView.styles.scss'


const { Text, Title } = Typography
const { TabPane } = Tabs

export const RefundOrderView = (props) => {
  const [refundOrderList, setRefundOrderList] = useState([])

  useEffect(() => {
    props.getSupplierRefundOrdersStart()
  }, [])

  useEffect(() => {
    const { refundOrders, isWorking } = props.supplierRefundOrder
    if(!_.isEqual(refundOrders, refundOrderList) && !isWorking) {
      setRefundOrderList(refundOrders)
    }
  }, [props.supplierRefundOrder])

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn hoàn hàng NCC</Title>
          <Divider/>  
        </Col>
      </Row>
      {
        refundOrderList.length > 0 ? (
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
                  <Button type="primary" key="Tạo đơn hoàn hàng" onClick={() => history.push('/app/supplier_refund_orders/create')}>Tạo đơn hoàn hàng</Button>,
                ]}
              >
                <TabPane tab="Tất cả" key="tất cả">
                  <AllSupplierRefundOrderTab refundOrders={refundOrderList}/>
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
              <Text>Cửa hàng của bạn chưa có đơn hoàn hàng nhà cung cấp nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => history.push('/app/supplier_refund_orders/create')}
              >Tạo đơn hoàn hàng đầu tiên</Button>
            </Col>
          </Row>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  supplierRefundOrder: state.supplierRefundOrder.toJS()
})

const mapDispatchToProps = dispatch => ({
  getSupplierRefundOrdersStart: () => dispatch(SupplierRefundOrderCreators.getSupplierRefundOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundOrderView)
