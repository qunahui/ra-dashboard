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

export const MarketplaceOrderView = (props) => {
  const INITIAL_FILTER =  {
    dateFrom: new Date(new Date(new Date().setDate(new Date().getDate() - 14)).setHours(0,0,0,0)),
    dateTo: new Date(new Date().setHours(23,59,59,999)),
    orderStatus: 'Chờ xác nhận',
    orderId: '',
    customerName: '',
    customerPhone: '',
  }
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState("Chờ xác nhận")
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
    fetchMarketplaceOrders(filter)
  }, [])

  async function fetchMarketplaceOrders(filter) {
    setLoading(true)
    const submitFilter = { ... filter }
    submitFilter.dateFrom = isNaN(parseFloat(submitFilter.dateFrom)) ? new Date(submitFilter.dateFrom).getTime() : submitFilter.dateFrom
    submitFilter.dateTo = isNaN(parseFloat(submitFilter.dateTo)) ? new Date(submitFilter.dateTo).getTime() : submitFilter.dateTo

    try { 
      const response = await request.get('/orders/marketplace', {
        params: {
          ...submitFilter,
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
                ]}
                onTabClick={key => {
                  setFilter({ orderStatus: key })
                  fetchMarketplaceOrders({ ...filter, orderStatus: key })
                  setActiveKey(key)
                }}
              >
                <TabPane tab="Chờ xác nhận" key="Chờ xác nhận"/>
                <TabPane tab="Đang xử lý" key="Đang xử lý"/>
                <TabPane tab="Đang giao hàng" key="Đang giao hàng"/>
                <TabPane tab="Đã giao hàng" key="Đã giao hàng"/>
                <TabPane tab="Đã hủy" key="Đã hủy"/>
                <TabPane tab="Gặp sự cố" key="Gặp sự cố"/>
                <TabPane tab="Đang hoàn trả" key="Đang hoàn trả"/>
                <TabPane tab="Đã hoàn trả" key="Đã hoàn trả"/>
                <TabPane tab="Mất hàng" key="Mất hàng"/>
              </Tabs>
              <FilterPanel 
                filter={filter}
                handleFilterSubmit={(values) => {
                  setActiveKey(values.orderStatus)
                  setFilter({ 
                      ...values,
                      dateFrom: values.dateFrom ? new Date(new Date(values.dateFrom).setHours(0,0,0,0)) : filter.dateFrom,
                      dateTo: values.dateTo ? new Date(new Date(values.dateTo).setHours(23,59,59,999)) : filter.dateTo,
                    })
                    fetchMarketplaceOrders(values)
                  }}
              />
              <AllMarketplaceOrderTable orders={orderList} loading={loading}/>
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
