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

const INITIAL_FILTER =  {
  dateFrom: new Date(new Date(new Date().setDate(new Date().getDate() - 14)).setHours(0,0,0,0)),
  dateTo: new Date(new Date().setHours(23,59,59,999)),
  orderStatus: 'Chờ xác nhận',
  orderId: '',
  customerName: '',
  customerPhone: '',
}

export const OrderView = (props) => {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState("Đặt hàng")
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )

  useEffect(() => {
    props.getOrdersStart(filter)
  }, [])

  useEffect(() => {
    const { orders, isWorking } = props.order
    if(!_.isEqual(orders, orderList) && !isWorking) {
      setOrderList(orders)
    }
  }, [props.order])

  const history = useHistory()
  return (
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
          onTabClick={key => {
            setFilter({ orderStatus: key })
            setActiveKey(key)
          }}
        >
          <TabPane tab={"Tất cả"} key={"Tất cả"}/>
          <TabPane tab={"Đặt hàng"} key={"Đặt hàng"} />
          <TabPane tab={"Duyệt"} key={"Duyệt"} />
          <TabPane tab={"Đóng gói"} key={"Đóng gói"} />
          <TabPane tab={"Xuất kho/Đang giao hàng"} key={"Xuất kho/Đang giao hàng"}/>
          <TabPane tab={"Đã giao hàng"} key={"Đã giao hàng"}/>
          <TabPane tab={"Hoàn thành"} key={"Hoàn thành"}/>
          <TabPane tab={"Đã hủy"} key={"Đã hủy"}/>
          <TabPane tab={"Đang hoàn trả"} key={"Đang hoàn trả"}/>
          <TabPane tab={"Đã hoàn trả"} key={"Đã hoàn trả"}/>
        </Tabs>
        <FilterPanel 
          filter={filter}
        />
        <AllOrderTable orders={orderList} loading={loading}/>
      </Col>
    </Row>
  )
}

const mapStateToProps = (state) => ({
  order: state.order.toJS()
})

const mapDispatchToProps = dispatch => ({
  getOrdersStart: (filter) => dispatch(OrderCreators.getOrdersStart(filter))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderView)
