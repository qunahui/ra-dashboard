import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Space, Row, Col, Input, Modal, Button, Typography, Collapse } from 'antd'
import { ConsoleSqlOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Creators from 'Redux/customer'
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

const AddCustomerForm = (props) => {  
  //<---------------------------------------form handler -------------------------------------------->
  const [open, setOpen] = useState([]);
  const [loading, setLoading] = useState(false)
  const [isCusExist, setCusExist] = useState(false)
  const [formState, setFormState] = useState({
    name: 'Customer 1',
    email: 'cus@gmail.com',
    phone: '0987654321',
    group: 'cgroup 1',
    address: 'address random ' + Math.random()
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
      const response = await request.get(`/customer/check/${value}`)
      if(response.code === 200) {
        setCusExist(false)
      }
    } catch(e) {
      if(e.code === 409) {
        return setCusExist(true)
      }
    }
  }

  const handleFormSubmit = () => {
    setLoading(true)
    setOpen([])
    const submitState = formState
    props.addCustomerStart(submitState)
    setFormState(initialValues)
  }

  useEffect(() => {
    const { isWorking } = props;
    if(!isWorking) {
      setLoading(false)
    }
  }, [props.isWorking])
  //<---------------------------------------form handler -------------------------------------------->
  
  //<--------------------------------------- add new customer modal handler -------------------------------------------->
  //<--------------------------------------- add new customer modal handler -------------------------------------------->

  return (
    <>
        <Collapse activeKey={open} onChange={key => setOpen(key)} ghost >
          <Panel header={"Thêm khách hàng"} key="1" style={{ background: 'white'}} collapsible={false}>
            <Row gutter={[16,16]}>
              <Col span={12}>
                <Space size={"middle"} direction={"vertical"} style={{ width: "100%"}}>
                  <div>
                    <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Tên khách hàng: </Text>
                    <Input size={"large"} name="name" onChange={handleChange} value={formState.name}/>
                  </div>
                  <div>
                    <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Số điện thoại: </Text>
                    <Input size={"large"} name="phone" onChange={handleChange} value={formState.phone}/>
                  </div>
                </Space>
              </Col>
              <Col span={12}>
                <Space size={"middle"} direction={"vertical"} style={{ width: "100%"}}>
                  <div>
                    <Row justify="space-between">
                      <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Email: </Text>
                      {
                        isCusExist && (
                          <Text type="danger">Khách hàng đã tồn tại !</Text>
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
              <Button loading={loading} disabled={isCusExist} onClick={handleFormSubmit} type="primary"><PlusCircleOutlined/>Thêm khách hàng</Button>
            </Row>
          </Panel>
        </Collapse>
    </>
  )
}

export default connect(state => ({
  isWorking: state.customer.toJS().isWorking
}), dispatch => ({
  addCustomerStart: (payload) => dispatch(Creators.addCustomerStart(payload))
}))(AddCustomerForm)