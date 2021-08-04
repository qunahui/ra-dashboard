import React, { useEffect, useState, useReducer } from 'react'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import AppCreators from 'Redux/app'
import ProductCreators from 'Redux/product'

import { Row, Col, Typography, Button, Table, Tabs, Form, Tag, Input, Divider, Modal, Checkbox, Select } from 'antd'
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

const INITIAL_FILTER =  {
  name: ''
}

function tagRender(props) {
  const { label, value, platform, closable, onClose } = props;

  const onPreventMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const colorPicker = (value) => {
    switch(value.platform_name) {
      case 'lazada':
        return 'purple'
      case 'sendo':
        return 'blue'
    } 
  }

  return (
    <Tag
      color={colorPicker(JSON.parse(value))}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {JSON.parse(value).platform_name === 'sendo' ? <SendoIcon/> : <LazadaIcon/> } {label}
    </Tag>
  );
}

const FilterPanel = ({ onFilter, platformCredentials }) => {
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )
  const [selectedCreds, setSelectedCreds] = useState(platformCredentials?.map(i => JSON.stringify(i)) || [])

  const handleFilterSubmit = () => {
    onFilter({ name: filter?.name, selectedCreds: selectedCreds?.map(i => JSON.parse(i)) })
  }
  
  return (
    <Row gutter={[8, 16]} style={{ marginBottom: 8 }}>
      <div style={{ display: 'grid', placeItems: 'center', marginLeft: 8 }}>
        Gian hàng: &nbsp;
      </div>
      <div style={{ display: 'grid', placeItems: 'center', marginLeft: 8 }}>
        <Select
            value={selectedCreds}
            tagRender={tagRender}
            mode={'multiple'}
            onChange={values => setSelectedCreds(values)}
            style={{ width: 400 }}
          >
            {
              platformCredentials?.map((i, idx) => (
                <Option key={idx} value={JSON.stringify(i)}>{i.store_name}</Option>
              ))
            }
          </Select>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', margin: '0 16px' }}>
        Tìm kiếm theo tên: 
      </div>
      <div>
        <Input value={filter?.name} style={{ width: 300, marginRight: 8 }} onChange={e => setFilter({ name: e.target.value })} placeholder={"Tìm kiếm theo tên"} allowClear/>
      </div>
      <Col>
        <Button type={'primary'} onClick={handleFilterSubmit}>Tìm kiếm</Button>
      </Col>
    </Row>
  )
}

const MarketplaceProductView = (props) => {
  const [syncModalVisible, setSyncModalVisible] = React.useState(false)
  const [syncButtonLoading, setSyncButtonLoading] = React.useState(false)
  const [linkModalVisible, setLinkModalVisible] = React.useState(false)
  const [platformCredentials, setPlatformCredentials] = React.useState([])
  const [linkableVariants, setLinkableVariants] = React.useState([])
  const [searchCreds, setSearchCreds] = React.useState([])

  //<----------------------------------------------- sync modal handler ---------------------------------->
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
    props.autoLinkDataStart({ variants: linkableVariants })
    setLinkModalVisible(false)
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
        setSearchCreds(allCredentials)
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
          {
            platformCredentials?.length > 0 && <FilterPanel onFilter={({ selectedCreds }) => setSearchCreds(selectedCreds) } platformCredentials={platformCredentials}/>
          }
          <AllProductTab credentials={searchCreds} onTransformProductsCreated={handleSetLinkableVariants}/>
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
                Quay lại
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