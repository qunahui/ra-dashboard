import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd';
import StorageStatus from './StorageStatus'
import Employee from './Employee'
import ActivityTable from 'Components/ActivityTable';
import { Select, Typography, Row, Col, Spin } from 'antd'
import toast from 'Helpers/ShowToast'
import { request } from 'Config/axios'
import AppCreators from 'Redux/app'
import Credentials from './Credentials'
import parseQueryString from 'Utils/parseQueryString'
import _ from 'lodash'

const { Option, } = Select
const { TabPane } = Tabs;

const ConfigView = props => {
  const [storages, setStorages] = useState(props?.auth?.user?.storages || [])
  const [activeKey, setActiveKey] = useState(null)
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [creds, setCreds] = useState([])

  useEffect(() => {
    if(props.history.location.search === "") {
      props.history.push({
        pathname: props.history.location.pathname,
        search: '?setting=general'
      })
      setActiveKey("general")
    } else {
      let params = parseQueryString()
      setActiveKey(params["setting"])
    }
  }, [])

  useEffect(() => {
    const { storage } = props
    if(storage) {
      const newCreds = [].concat(storage?.sendoCredentials || []).concat(storage?.lazadaCredentials || [])
      if(!_.isEqual(creds, newCreds)){
        setCreds(newCreds)
      }
    }
  }, [props])

  const handleChangeStorage = async (value) => {
    try { 
      const result = await request.get(`/users/change-default/${value}`)
      if(result.code === 200) {
        props.getStoresStart()
        forceUpdate()
      }
    } catch(e) {
      console.log(e.message)
      toast({ type: 'error', message: 'Không thể đổi kho do sự cố. Vui lòng thử lại sau!'})
    }
  }

  const onTabChange = (value) => {
    setActiveKey(value)
    props.history.push({
      pathname: props.history.location.pathname,
      search: '?setting='+value
    })
  }

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
    >
      <TabPane
        key={"general"}
        tab={"Quản lý chung"}
      >
        <Row>
          <Col span={8}>
            <Select
              placeholder={'Chọn kho'}
              style={{ width: '100%', marginBottom: 16 }}
              defaultValue={storages.find(i => i?.storage?.current === true).storage.storageId}
              onChange={handleChangeStorage}
            >
              {
                storages?.map(i => (
                  <Option value={i.storage.storageId}>{i.storage.storageName}</Option>
                  ))
                }
            </Select>
          </Col>
        </Row>
        <StorageStatus />
        <ActivityTable/>
        <Employee/>
      </TabPane>
      {/* <TabPane
        key={"credential"}
        tab={"Cấu hình từng gian hàng"}
      >
        {
          creds?.length > 0 ? <Credentials creds={creds}/> : (
            <Row justify={"center"}>
              {console.log(creds)}
              <Spin/>
            </Row>
          )
        }
      </TabPane>
    */}
    </Tabs>
  )
}

export default connect(state => ({
  auth: state.auth.toJS(),
  storage: state.app.toJS().storage
}), dispatch => ({ 
  getStoresStart: () => dispatch(AppCreators.getStoresStart())
}))(ConfigView)