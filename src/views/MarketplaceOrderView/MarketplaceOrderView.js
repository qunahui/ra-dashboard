import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Button, Tabs, Input, Select } from 'antd'
import AllMarketplaceOrderTable from 'Components/AllMarketplaceOrderTable'
import FilterPanel from 'Components/FilterPanel'
import './MarketplaceOrderView.styles.scss'
import { request } from 'Config/axios'
import toast from 'Components/Helpers/ShowToast'
import qs from 'qs'

const { Text, Title } = Typography
const { TabPane } = Tabs
const { Option } = Select

export const MarketplaceOrderView = (props) => {
  const INITIAL_FILTER =  {
    dateFrom: new Date().setDate(new Date().getDate() - 14),
    orderStatus: 'Chờ xác nhận'
  }
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )
  useEffect(() => {
    // props.getOrdersStart()
  }, [])

  // useEffect(() => {
  //   const { orders, isWorking } = props.order
  //   if(!_.isEqual(orders, orderList) && !isWorking) {
  //     setOrderList(orders)
  //   }
  // }, [props.order])

  
  useEffect(() => {
    fetchMarketplaceOrders()
  }, [])

  async function fetchMarketplaceOrders() {
    setLoading(true)
    try { 
      const response = await request.get('/orders/marketplace', {
        params: {
          ...filter
        },
        paramsSerializer: params => {
          return qs.stringify(params)
        } 
      })

      if(response.code === 200) {
        console.log(response)
        setOrderList(response.data)
        setLoading(false)
      }

    } catch(e) {
      toast({ type: 'error', message: e.message })
    }
  }

  const history = useHistory()
  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Đơn hàng từ sàn TMĐT</Title>
          <Divider/>  
        </Col>
      </Row>
      {
       true ? (
          <Row
            style={{ 
              backgroundColor: '#fafafa',
              padding: '8px 24px',
              border: '1px solid #ccc',
              borderRadius: 5
            }}
          >
            <Col span={24}>
              <Tabs 
                defaultActiveKey="Chờ xác nhận" 
                destroyInactiveTabPane={true} 
                tabBarExtraContent={[
                  <Button type="primary" key="Tạo đơn hàng" onClick={() => history.push('/app/orders/create')}>Tạo đơn hàng</Button>,
                ]}
              >
                <TabPane tab="Chờ xác nhận" key="Chờ xác nhận">
                  <FilterPanel filter={filter} onChange={(newFilter) => setFilter({ ...newFilter })}/>
                  <AllMarketplaceOrderTable orders={orderList} loading={loading}/>
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
  // order: state.order.toJS()
})

const mapDispatchToProps = dispatch => ({
  // getOrdersStart: () => dispatch(OrderCreators.getOrdersStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceOrderView)
