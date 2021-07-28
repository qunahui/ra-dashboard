import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AppCreators from 'Redux/app'
import _ from 'lodash'
import { Table, Typography, Button, Modal, Card, Row, Col, Input, Dropdown, Menu } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons'
import toast from 'Helpers/ShowToast'
import { cardBorder } from './styles'

import { request } from 'Config/axios'


const { Text, Title } = Typography 

const Employee = props => {
  const history = useHistory()
  const [dataSource, setDataSource] = React.useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function getAllEmployee() {
      try { 
          const result = await request('/employees')
          if(result.code === 200) { 
              setDataSource(result.data)
          }
          
      } catch (e) {
  
      }
  }
  
  React.useEffect(() => {
    getAllEmployee()
  }, [props])

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'roleAccess',
      key: 'roleAccess',
      render: (value) => (
          <Text>{`${value?.length || 0}/40 quyền hạn`}</Text>
      )
    },
    {
      title: 'Lần online cuối',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: value => <Text>{new Date(value).toLocaleTimeString()} - {new Date(value).toLocaleDateString()}</Text>
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return <Dropdown
            trigger={['click']}
            overlay={(
              <Menu>
                <Menu.Item key={'edit-employee-permission'}>Chỉnh sửa quyền hạn</Menu.Item>
                <Menu.Item key={'remove-employee'} onClick={() => handleRemoveEmployee(record)}>Xóa nhân viên</Menu.Item>
              </Menu>
            )}
          >
            {props?.user?._id !== record?.userId ? <a href={'#'} >Chỉnh sửa</a> : <></>}
          </Dropdown>
      } 
    },
  ]

  const handleRemoveEmployee = async (record) => {
    try { 
      const result = await request.delete(`/employees/${record.userId}`)
      if(result.code === 200) { 
        toast({ type: 'success', message: 'Xóa nhân viên thành công!'})
      }
    } catch (e) {
      toast({ type: 'error', message: e.message})
    }
  }

  const handleInviteEmployee = async () => {
    setLoading(true)
    try { 
        const result = await request.post('/employees/invite', {
            email,
            roleAccess: []
        })

        if(result.code === 200) { 
            toast({ type: 'success', message: 'Gửi lời mời thành công !'})
        }

        setVisible(false)
    } catch(e) {
        if(e.code !== 409) {
            toast({ type: 'error', message: e.message })
        } else {
            toast({ type: 'warning', message: e.message })
        }
    } finally {
        setLoading(false)
    }
  }

  return (
    <Card 
      title={<Title level={4} style={{ marginLeft: 8 }}>Nhân viên</Title>}
      extra={<Button type="primary" onClick={() => setVisible(true)}><PlusCircleOutlined />Thêm nhân viên</Button>}
      style={{ ...cardBorder, marginTop: 24}}
    >
      <Table columns={columns} dataSource={dataSource} bordered/>
      <Modal
        visible={visible}
        loading={loading}
        title={'Thêm nhân viên'}
        onCancel={() => setVisible(false)}
        onOk={handleInviteEmployee}
        footer={[
            <Button onClick={() => setVisible(false)}>Hủy</Button>,
            <Button type="primary" onClick={handleInviteEmployee} loading={loading}>Gửi</Button>
        ]}
      >
        <Row>
            <Col span={8}>
                Nhập email nhân viên: 
            </Col>
            <Col span={14}>
                <Input style={{ width: '100%'}} value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Col>
        </Row>
      </Modal>
    </Card>
  )
}

export default connect(state => ({
  app: state.app.toJS(),
  user: state.auth.toJS().user
}), dispatch => ({
  disconnectStoreStart: (payload) => dispatch(AppCreators.disconnectStoreStart(payload))
}))(Employee)