import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Link, useHistory } from 'react-router-dom' 
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import { Row, Col, Typography, Divider, Button, Table, Tabs, Modal, Form, Input, AutoComplete, Popconfirm } from 'antd'
import CustomerCreators from 'Redux/customer'
import { request } from 'Config/axios'
import NProgress from 'nprogress'
import toast from 'Helpers/ShowToast'

const { Title, Text } = Typography
const { TabPane } = Tabs

const INITIAL_FILTER =  {
  search: ''
}

const FilterPanel = ({ onFilter }) => {
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )

  const handleFilterSubmit = () => {
    onFilter({ search: filter?.search })
  }
  
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 8 }} justify="end">
      <Col span={8}><Input value={filter?.search} onChange={e => setFilter({ search: e.target.value })} placeholder={"Tìm kiếm theo tên, nhóm, số điện thoại hoặc email"} allowClear/></Col>
      <Col span={2}>
        <Button type={'primary'} style={{ width: '100%'}} onClick={handleFilterSubmit}>Tìm kiếm</Button>
      </Col>
    </Row>
  )
}

export const CustomerView = (props) => {
  const [customerList, setCustomerList] = useState([])
  const history = useHistory()
  const [show, setShow] = useState(false)
  const [form] = Form.useForm()
  const [activeKey, setActiveKey] = useState('all')
  const [groups, setGroups] = useState([])

  async function fetchAllGroup() {
    try {
      const result = await request.get('/customers/group')
      if(result.code === 200) {
        setGroups(result?.data)
      }
    } catch(e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    fetchAllGroup()
  }, [])

  const handleShow = () => {
    setShow(true)
  }

  const handleHide = () => {
    setShow(false)
  }

  const handleCustomerSubmit = async (values) => {
    NProgress.start()
    try { 
      if(values?.isEdit) {
        const result = await request.patch(`/customers/${values?._id}`, values)
        if(result.code === 200) {
          toast({ type: 'success', message: 'Cập nhật khách hàng mới thành công !'})
          handleHide()
          form.resetFields()    
          props.getCustomerStart()
          fetchAllGroup()
        }
      } else {
        const result = await request.post('/customers', values)
        if(result.code === 200) {
          toast({ type: 'success', message: 'Tạo khách hàng mới thành công !'})
          handleHide()
          form.resetFields()    
          props.getCustomerStart()
          fetchAllGroup()
        }
      }
    } catch(e) {
      if(e.code === 409) {
        toast({ type: 'error', message: 'khách hàng đã tồn tại !'})
      } else {
        toast({ type: 'error', message: 'Tạo khách hàng mới thất bại !'})
      }
    } finally {
      NProgress.done()
    }
  }

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nhóm khách hàng',
      dataIndex: 'group',
      key: 'group',
      render: (text) => {
        let renderText = text;
        switch(text) {
          case 'Normal': 
            renderText = 'Khác'
            break;
        }

        return <Text>{renderText}</Text>
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 100,
      key: 'action',
      render: (_, record) => (
        <Row justify="space-around" style={{ fontSize: 16}}>
          <EditOutlined style={{ color: blue[5], cursor: 'pointer' }} onClick={() => {
            form.setFieldsValue({ ...record, isEdit: true })
            setShow(true)
          }}/>
          {/* <Popconfirm
            placement={'topRight'}
            title={"Bạn có chắc chắn muốn xóa khách hàng này ?"}
            onConfirm={() => {}}
          >
            <DeleteOutlined style={{ color: red[5], cursor: 'pointer' }}/>
          </Popconfirm> */}
        </Row>
      )
    },
  ]

  useEffect(() => {
    props.getCustomerStart()
  }, [])

  useEffect(() => {
    const { isWorking, customers } = props.customer
    if(!isWorking && customers?.length > 0 && !_.isEqual(customers, customerList)) {
      setCustomerList(customers.map(sup => ({
        ...sup,
        key: sup._id
      })) || [])
    }
  }, [props.customer])

  const onRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedOrderRowKeys(selectedRowKeys)
  }

  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Quản lý khách hàng</Title>
          <Divider/>  
        </Col>
      </Row>
        <Row 
            justify={"end"}
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
                  <Button 
                    type={"primary"} 
                    onClick={() => setShow(true)}
                  >
                    Tạo khách hàng
                  </Button>
                ]}
                onChange={(value) => setActiveKey(value)}
              >
                <TabPane tab="Tất cả" key="all"/>
              </Tabs>
            </Col>
            <Col span={24}>
              <FilterPanel
                onFilter={(filter) => props.getCustomerStart(filter)}
              />
              <Table 
                dataSource={props?.customer?.customers.map(i => ({ ...i, key: i._id }))} 
                columns={columns} 
                bordered
              />
            </Col>
          </Row>
        <Modal
          title={!form.getFieldValue('isEdit') ? "Tạo mới khách hàng" : "Chỉnh sửa khách hàng"}
          visible={show}
          width={700}
          onCancel={() => {
            setShow(false)
            form.resetFields()
          }}
          footer={[
            <Button onClick={handleHide}>Cancel</Button>,
            <Button type="primary" htmlType="submit" form={"customer-form"}>OK</Button>
          ]}
        >
          <Form
            layout={'vertical'}
            name="customer-form"
            form={form}
            onFinishFailed={(e) => console.log(e)}
            onFinish={handleCustomerSubmit}
          > 
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={"Tên khách hàng"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={"Email khách hàng"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={"Số điện thoại khách hàng"}
                >
                  <Input disabled={!!form.getFieldValue('isEdit')}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="group"
                  label={"Nhóm khách hàng"}
                >
                <AutoComplete options={groups.map(i => ({ value: i }))}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label={"Địa chỉ khách hàng"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Form.Item name="isEdit" noStyle/>
              <Form.Item name="_id" noStyle/>
            </Row>
          </Form>
        </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  customer: state.customer.toJS()
})

const mapDispatchToProps = dispatch => ({
  getCustomerStart: (payload) => dispatch(CustomerCreators.getCustomerStart(payload)),
  addCustomerStart: (payload) => dispatch(CustomerCreators.addCustomerStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomerView)
