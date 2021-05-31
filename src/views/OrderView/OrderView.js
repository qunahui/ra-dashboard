import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Button, Tabs } from 'antd'
import OrderCreators from 'Redux/order'
import AllOrderTable from 'Components/AllOrderTable'
import './OrderView.styles.scss'


const { Text, Title } = Typography
const { TabPane } = Tabs

export const OrderView = (props) => {
  const [orderList, setOrderList] = useState([])

  useEffect(() => {
    props.getOrdersStart()
  }, [])

  useEffect(() => {
    const { orders, isWorking } = props.order
    if(!_.isEqual(orders, orderList) && !isWorking) {
      setOrderList(orders)
    }
  }, [props.order])

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn hàng</Title>
          <Divider/>  
        </Col>
      </Row>
      {
        orderList.length > 0 ? (
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
                  <Button type="primary" key="Tạo đơn hàng" onClick={() => history.push('/app/orders/create')}>Tạo đơn hàng</Button>,
                ]}
              >
                <TabPane tab="Tất cả" key="tất cả">
                  <AllOrderTable orders={orderList}/>
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
              <Text>Cửa hàng của bạn chưa có đơn hàng nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => history.push('/app/orders/create')}
              >Tạo đơn hàng đầu tiên</Button>
            </Col>
          </Row>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  order: state.order.toJS()
})

const mapDispatchToProps = dispatch => ({
  getOrdersStart: () => dispatch(OrderCreators.getOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderView)
