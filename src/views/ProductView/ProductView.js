import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Typography, Button, Divider, Tabs, Form, Input, Cascader } from 'antd'
//
import AllProductTab from './AllProductTab'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'

const { Title } = Typography
const { TabPane } = Tabs

const actionButtons = [
]

const onFinish = values => {
  alert(values)
}

const ProductView = (props) => {
  const history = useHistory();
  const [activeKey, setActiveKey] = useState("active")

  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Quản lý sản phẩm</Title>
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
              <Button type="primary" key="Tạo sản phẩm" onClick={() => history.push('/app/products/create')}>Tạo sản phẩm</Button>,
            ]}
            onChange={(value) => setActiveKey(value)}
          >
            <TabPane tab="Tất cả" key="all"/>
            <TabPane tab="Đang giao dịch" key="active"/>
            <TabPane tab="Đã tắt kích hoạt" key="inactive"/>
          </Tabs>
          <AllProductTab type={activeKey}/>
        </Col>
      </Row>
    </>
  )
}

export default ProductView;