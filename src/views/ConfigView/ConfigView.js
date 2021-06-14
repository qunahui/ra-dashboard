import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Table, Tag, Space } from 'antd';
import StorageStatus from './StorageStatus'
import Employee from './Employee'
import ActivityTable from 'Components/ActivityTable';
import { Select, Typography, Row, Col } from 'antd'
import toast from 'Helpers/ShowToast'
import { request } from 'Config/axios'
import AppCreators from 'Redux/app'

const { Title, Text} = Typography
const { Option, } = Select

const ConfigView = props => {
  const [storages, setStorages] = useState(props?.auth?.user?.storages || [])
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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

  return (
    <>
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
    </>
  )
}

export default connect(state => ({
  auth: state.auth.toJS(),
}), dispatch => ({ 
  getStoresStart: () => dispatch(AppCreators.getStoresStart())
}))(ConfigView)