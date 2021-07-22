import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Link, useHistory } from 'react-router-dom' 
import { Row, Col, Typography, Divider, Button, Table, Tabs, Modal, Form, Input, AutoComplete } from 'antd'
import SupplierCreators from 'Redux/supplier'
import { request } from 'Config/axios'
import AddSupplierForm from 'Components/AddSupplierForm'
import NProgress from 'nprogress'
import toast from 'Helpers/ShowToast'

const { Title, Text } = Typography
const { TabPane } = Tabs

export const SupplierView = (props) => {
  const [supplierList, setSupplierList] = useState([])
  const history = useHistory()
  const [show, setShow] = useState(false)
  const [form] = Form.useForm()
  const [activeKey, setActiveKey] = useState('all')
  const [groups, setGroups] = useState([])

  async function fetchAllGroup() {
    try {
      const result = await request.get('/suppliers/group')
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

  const handleSupplierSubmit = async (values) => {
    NProgress.start()
    try { 
      const result = await request.post('/suppliers', values)
      if(result.code === 200) {
        toast({ type: 'success', message: 'Tạo nhà cung cấp mới thành công !'})
        handleHide()
        form.resetFields()    
        props.getSupplierStart()
        fetchAllGroup()
      }
    } catch(e) {
      if(e.code === 409) {
        toast({ type: 'error', message: 'Nhà cung cấp đã tồn tại !'})
      } else {
        toast({ type: 'error', message: 'Tạo nhà cung cấp mới thất bại !'})
      }
    } finally {
      NProgress.done()
    }
  }

  const columns = [
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/app/products/suppliers/${record._id}`}>{text}</Link>
    },
    {
      title: 'Nhóm nhà cung cấp',
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
  ]

  useEffect(() => {
    props.getSupplierStart()
  }, [])

  useEffect(() => {
    const { isWorking, suppliers } = props.supplier
    if(!isWorking && suppliers?.length > 0 && !_.isEqual(suppliers, supplierList)) {
      setSupplierList(suppliers.map(sup => ({
        ...sup,
        key: sup._id
      })) || [])
    }
  }, [props.supplier])

  const onRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedOrderRowKeys(selectedRowKeys)
  }

  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Quản lý nhà cung cấp</Title>
          <Divider/>  
        </Col>
      </Row>
      {
        supplierList.length > 0 ? (
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
                    Tạo nhà cung cấp
                  </Button>
                ]}
                onChange={(value) => setActiveKey(value)}
              >
                <TabPane tab="Tất cả" key="all"/>
              </Tabs>
            </Col>
            <Col span={24}>
              <Table 
                dataSource={supplierList} 
                columns={columns} 
                bordered
              />
            </Col>
          </Row>
        ) : (
          <Row justify={"center"}>
            <Col span={16} className={"front-text"}>
              <Text>Cửa hàng của bạn chưa có nhà cung cấp nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => setShow(true)}
              >Tạo nhà cung cấp đầu tiên</Button>
            </Col>
          </Row>
        )
      }
       <Modal
          title={"Tạo mới nhà cung cấp"}
          visible={show}
          width={700}
          onCancel={() => setShow(false)}
          footer={[
            <Button onClick={handleHide}>Cancel</Button>,
            <Button type="primary" htmlType="submit" form={"supplier-form"}>OK</Button>
          ]}
        >
          <Form
            layout={'vertical'}
            name="supplier-form"
            form={form}
            onFinishFailed={(e) => console.log(e)}
            onFinish={handleSupplierSubmit}
          > 
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={"Tên nhà cung cấp"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={"Email nhà cung cấp"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={"Số điện thoại nhà cung cấp"}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="group"
                  label={"Nhóm nhà cung cấp"}
                >
                <AutoComplete options={groups.map(i => ({ value: i }))}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label={"Địa chỉ nhà cung cấp"}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  supplier: state.supplier.toJS()
})

const mapDispatchToProps = dispatch => ({
  getSupplierStart: () => dispatch(SupplierCreators.getSupplierStart()),
  addSupplierStart: (payload) => dispatch(SupplierCreators.addSupplierStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierView)
