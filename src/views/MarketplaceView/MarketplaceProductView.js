import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import AppCreators from 'Redux/app'
import ProductCreators from 'Redux/product'

import { Row, Col, Typography, Button, Table, Tabs, Form, Input, Divider, Modal, Checkbox, Select } from 'antd'
//
import AllProductTab from './AllProductTab'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'
import Icon from '@ant-design/icons'
import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select
const CheckboxGroup = Checkbox.Group

const MarketplaceProductView = (props) => {
  const [syncModalVisible, setSyncModalVisible] = React.useState(false)
  const [syncButtonLoading, setSyncButtonLoading] = React.useState(false)
  const [linkModalVisible, setLinkModalVisible] = React.useState(false)
  const [platformCredentials, setPlatformCredentials] = React.useState([])
  const [linkableVariants, setLinkableVariants] = React.useState([])

  //<----------------------------------------------- sync modal handler ---------------------------------->
  // const [checkedList, setCheckedList] = useState([])
  const [chosenCre, setChosenCre] = useState(null)

  const onChange = cre => {
    setChosenCre(cre);
  };


  useEffect(() => {
    const { isWorking } = props.app
    if(!isWorking) {
      setSyncButtonLoading(false)
      setSyncModalVisible(false)
    }
  }, [props.app])
  //<----------------------------------------------- sync modal handler ---------------------------------->

  //<----------------------------------------------- sync datas handler ---------------------------------->
  const handleSyncData = () => {
    setSyncButtonLoading(true)
    const fullCredential = platformCredentials.find(i => i.store_id === chosenCre)
    props.syncDataStart(fullCredential)
  }
  //<----------------------------------------------- sync datas handler ---------------------------------->
  
  //<----------------------------------------------- auto link handler ---------------------------------->
  const handleLinkData = () => {
    props.autoLinkDataStart(props.platform?.products)
  }
  //<----------------------------------------------- auto link handler ---------------------------------->
  
  //<----------------------------------------------- laz refresh token expired handler ---------------------------------->
  const [showRedirectModal, setShowRedirectModal] = useState(false)
  const [expiredCre, setExpiredCre] = useState(null)
  useEffect(() => {
    const { error } = props.app
    if(error) {
      if(error.message === 'Refresh token đã hết hạn !') {
        setShowRedirectModal(true)
        setExpiredCre(error.expiredCre.store_name)
      }
    }
  }, [props.app])
  //<----------------------------------------------- laz refresh toke expired handler ---------------------------------->

  useEffect(() => {
    const { app } = props;
    if(!app.isWorking) {
      const { storage } = props.app;
      let allCredentials = []
      if(storage?.sendoCredentials?.length > 0) {
        allCredentials = allCredentials.concat(storage.sendoCredentials)
      }
      if(storage?.lazadaCredentials?.length > 0) {
        allCredentials = allCredentials.concat(storage.lazadaCredentials)
      }

      if(!_.isEqual(allCredentials, platformCredentials)) {
        setPlatformCredentials(allCredentials)
      }
    }
  }, [props.app])

  //<----------------------------------------------- linkable variants handler ---------------------------------->
  const handleSetLinkableVariants = (transformProducts) => {
    let arr = []
    transformProducts.some(i => {
      if(i.platform === 'sendo') {
        if(i?.isChildren === true && !i?.linkedId) {
          arr.push(i)
          return;
        } else if(!!i.children) {
          arr = arr.concat(i?.children?.filter(i => !i?.linkedId) || [])
        }
      } else if(i.platform === 'lazada') {
        arr = arr.concat(i?.children?.filter(i => !i?.linkedId) || [])
      }
    }) 
    console.log(arr)
    setLinkableVariants(arr)
  }
  //<----------------------------------------------- linkable variants handler ---------------------------------->

  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Quản lý sản phẩm TMĐT</Title>
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
            defaultActiveKey="tất cả" 
            destroyInactiveTabPane={true} 
            tabBarExtraContent={[
              <Button 
                key={"quick-sync"}
                style={{ marginRight: 10 }}
                onClick={() => setLinkModalVisible(true)}
              >Liên kết nhanh</Button>,
              <Button 
                key={"update-data"} 
                type="primary" 
                key="Tạo sản phẩm"
                onClick={() => setSyncModalVisible(true)}
            >Cập nhật dữ liệu</Button>,
            ]}
          >
            <TabPane tab="Tất cả" key="tất cả">
            </TabPane>
            <TabPane tab="Đang chờ duyệt" key="Đang chờ duyệt"/>
            <TabPane tab="Hết hàng" key="Hết hàng"/>
            <TabPane tab="Đã tắt kích hoạt" key="Đã tắt kích hoạt"/>
            <TabPane tab="Đã xóa" key="Đã xóa"/>
          </Tabs>
          <AllProductTab credentials={platformCredentials} onTransformProductsCreated={handleSetLinkableVariants}/>
          <Modal
            title="Cập nhật dữ liệu sản phẩm từ gian hàng"
            visible={syncModalVisible}
            closable={false}
            onOk={handleSyncData}
            onCancel={() => {
              setChosenCre(null)
              setSyncModalVisible(false)
              setSyncButtonLoading(false)
            }}
            width={600}
            footer={[
              <Button 
                type="primary"
                key="manual-sync"
                onClick={handleSyncData}
                disabled={!chosenCre}
                loading={syncButtonLoading}
              >
                Cập nhật
              </Button>
            ]}
          >
            <div style={{ padding: '20px 30px'}}>
              <Select allowClear value={chosenCre} size={"large"} style={{ width: '100%'}} placeholder={"Chọn gian hàng"} onChange={onChange}>
                  {
                    platformCredentials.length > 0 && platformCredentials.map(i => (
                      <Option key={i._id} value={i.store_id}>
                        <Text>{i.platform_name === 'sendo' ? <SendoIcon/> : <LazadaIcon/>} {i.store_name}</Text>
                      </Option>
                    ))
                  }
              </Select>
            </div>
          </Modal>
          <Modal
            title="Chọn gian hàng để liên kết"
            visible={linkModalVisible}
            closable={false}
            onOk={handleLinkData}
            onCancel={() => {
              setLinkModalVisible(false)
            }}
            width={600}
            footer={[
              <Button 
                key="cancel-manual-sync"
                onClick={() => setLinkModalVisible(false)}
                disabled={false}
              >
                Liên kết
              </Button>,
              <Button 
                type="primary"
                key="manual-sync"
                onClick={handleLinkData}
                disabled={false}
              >
                Liên kết
              </Button>,
            ]}
          >
            <div >
              {/* <CheckboxGroup onChange={onChange}>
                  {
                    platformCredentials.length > 0 && platformCredentials.map(i => (
                      <Row key={i._id}>
                        <Checkbox value={i.store_id}>{i.platform_name === 'sendo' ? <SendoIcon/> : <LazadaIcon/>} {i.store_name}</Checkbox>
                      </Row>
                    ))
                  }
              </CheckboxGroup> */}
              Xác nhận liên kết nhanh ? Các biến thể có cùng mã SKU sẽ được tự động liên kết với nhau.
            </div>
          </Modal>
          <Modal
            title="Phiên đăng nhập lazada đã hết hạn !"
            visible={showRedirectModal}
            closable={false}
            onCancel={() => {
              setShowRedirectModal(false)
            }}
            width={600}
            footer={[
              <Button 
                key="back-expired"
                disabled={false}
                onClick={() => setShowRedirectModal(false)}
                style={{ marginRight: 8}}
              >
              Quay lại
              </Button>,
              <a href={
                `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${window.location.origin}/app/create/lazada&country=vn&client_id=122845`
              }>
                <Button 
                  type="primary"
                  key="refresh-laz"
                  disabled={false}
                >
                OK
                </Button>
              </a>
            ]}
          >
            <div style={{ padding: '20px 30px'}}>
              Bạn có muốn đăng nhập lại cho phiên đăng nhập <Text strong>{expiredCre}</Text>
            </div>
          </Modal>
        </Col>
      </Row>
    </>
  )
}

export default connect(state => ({
  app: state.app.toJS(),
  platform: state.platform.toJS()
}), dispatch => ({
  syncDataStart: (payload) => dispatch(AppCreators.syncDataStart(payload)),
  autoLinkDataStart: (payload) => dispatch(AppCreators.autoLinkDataStart(payload)),
}))(MarketplaceProductView);