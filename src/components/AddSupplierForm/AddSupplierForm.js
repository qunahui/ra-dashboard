import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Space, Row, Col, Input, Modal, Button, Typography, Collapse } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import Creators from 'Redux/supplier'
import { request } from 'Config/axios'

const { Text } = Typography
const { Panel } = Collapse

const initialValues = {
  name: '',
  email: '',
  phone: '',
  group: '',
  address: 'address random ' + Math.random(),
}

const AddSupplierForm = (props) => {  
  //<---------------------------------------form handler -------------------------------------------->
  const [open, setOpen] = useState([]);
  const [loading, setLoading] = useState(false)
  const [isSupExist, setSupExist] = useState(false)
  const [formState, setFormState] = useState({
    name: 'Supplier 1',
    email: 'sup@gmail.com',
    phone: '0987654321',
    group: 'group 1',
    address: '1234567890'
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState({ ...formState, [name]: value })
    // console.log()
  }

  const handleEmailChange = async (e) => {
    const { name, value } = e.target
    setFormState({ ...formState, [name]: value })
    try {
      const response = await request.get(`/supplier/check/${value}`)
      if(response.code === 200) {
        setSupExist(false)
      }
    } catch(e) {
      if(e.code === 409) {
        return setSupExist(true)
      }
    }
  }

  const handleFormSubmit = () => {
    setLoading(true)
    setOpen([])
    const submitState = formState
    props.addSupplierStart(submitState)
    setFormState(initialValues)
  }

  useEffect(() => {
    const { isWorking } = props;
    if(!isWorking) {
      setLoading(false)
    }
  }, [props.isWorking])
  //<---------------------------------------form handler -------------------------------------------->
  
  //<--------------------------------------- add new supplier modal handler -------------------------------------------->
  //<--------------------------------------- add new supplier modal handler -------------------------------------------->

  return (
    <>
      <Collapse activeKey={open} onChange={key => setOpen(key)} ghost >
        <Panel header={"Thêm nhà cung cấp"} key="1" style={{ background: 'white'}} collapsible={false}>
          <Row gutter={[16,16]}>
              <Col span={12}>
                <Space size={"middle"} direction={"vertical"}  style={{ width: "100%"}}>
                  <div>
                    <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Tên nhà cung cấp: </Text>
                    <Input size={"large"} name="name" onChange={handleChange} value={formState.name}/>
                  </div>
                  <div>
                    <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Số điện thoại: </Text>
                    <Input size={"large"} name="phone" onChange={handleChange} value={formState.phone}/>
                  </div>
                </Space>
              </Col>
              <Col span={12}>
                <Space size={"middle"} direction={"vertical"}  style={{ width: "100%"}}>
                  <div>
                    <Row justify="space-between">
                      <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Email: </Text>
                      {
                        isSupExist && (
                          <Text type="danger">Nhà cung cấp đã tồn tại !</Text>
                        )
                      }
                    </Row>
                    <Input size={"large"} name="email" onChange={(e) => handleEmailChange(e)} value={formState.email}/>
                  </div>
                  <div>
                    <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Nhóm nhà cung cấp: </Text>
                    <Input size={"large"} name="group" onChange={handleChange} value={formState.group}/>
                  </div>
                </Space>
              </Col>
              <Col span={24}>
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Địa chỉ: </Text>
                  <Input size={"large"} name="address" onChange={handleChange} value={formState.address}/>
                </div>
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 8 }}>
              <Button loading={loading} disabled={isSupExist} onClick={handleFormSubmit} type="primary"><PlusCircleOutlined/>Thêm nhà cung cấp</Button>
            </Row>
          </Panel>
      </Collapse>
    </>
  )
}

export default connect(state => ({
  isWorking: state.supplier.toJS().isWorking
}), dispatch => ({
  addSupplierStart: (payload) => dispatch(Creators.addSupplierStart(payload))
}))(AddSupplierForm)