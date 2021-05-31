import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Typography, Button, Table, Tabs, Form, Input, Cascader } from 'antd'
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
  return (
    <>
      <Row>
        <Title level={3} type="secondary">Quản lý sản phẩm</Title>
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
            defaultActiveKey="tất cả" 
            destroyInactiveTabPane={true} 
            tabBarExtraContent={[
              <Button type="primary" key="Tạo sản phẩm" onClick={() => history.push('/app/products/create')}>Tạo sản phẩm</Button>,
            ]}
          >
            <TabPane tab="Tất cả" key="tất cả">
              <AllProductTab />
            </TabPane>
            <TabPane tab="Đang chờ duyệt" key="Đang chờ duyệt">
              {/* <LinkedSuccessProductTab/> */}
            </TabPane>
            <TabPane tab="Hết hàng" key="Hết hàng">
              {/* <LinkedFailProductTab/> */}
            </TabPane>
            <TabPane tab="Đã tắt kích hoạt" key="Đã tắt kích hoạt">
              {/* <LinkedFailProductTab/> */}
            </TabPane>
            <TabPane tab="Đã xóa" key="Đã xóa">
              {/* <LinkedFailProductTab/> */}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  )
}

export default ProductView;