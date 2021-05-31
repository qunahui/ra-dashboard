import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AppCreators from 'Redux/app'
import _ from 'lodash'
import { Table, Spin, Space, Switch, Dropdown, Menu, Button, Popconfirm, Row, Col } from 'antd';
import Icon, { DisconnectOutlined, DownOutlined, PlusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'

import LazadaIcon from '../../assets/lazada-icon.svg'
import SendoIcon from '../../assets/sendo-icon.svg'


const StorageStatus = props => {
  const history = useHistory()
  const [dataSource, setDataSource] = React.useState([])

  React.useEffect(() => {
    if(!props.app.isWorking) {
      let updatedDataSource = []
      updatedDataSource = updatedDataSource.concat(props.app.storage?.sendoCredentials || []).concat(props.app.storage?.lazadaCredentials || [])
      if(!_.isEqual(updatedDataSource, dataSource)) {
        console.log("updated data source", updatedDataSource)
        setDataSource(updatedDataSource.map(i => ({ ...i, key: i._id })))
      }

    }
  }, [props.app])

  const columns = [
    {
      title: 'Tên gian hàng',
      dataIndex: 'store_name',
      key: 'store_name',
      width: '50%',
      render: (text, record) => <>
        <Icon component={record.platform_name === 'sendo' ? SendoIcon : LazadaIcon} style={{ width: '30px', margin: '10px'}}/> {text}
      </>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (text, record) => {
        console.log(record)
        return <p>Đang kết nối</p>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      width: '25%',
      render: (text, record) => {
        const menu = <Menu>
            <Menu.Item key="manual-sync" style={{ color: blue[5] }} onClick={() => history.push(`/app/config/${record._id}`)}><InfoCircleOutlined/>Xem cấu hình</Menu.Item>
            <Menu.Item key="disconnect" style={{ color: red[5] }}>
              <Popconfirm
                title={`Xác nhận gỡ gian hàng: ${record.store_name}, điều này sẽ khiến các sản phẩm/đơn hàng liên quan bị xóa.`}
                onConfirm={() => props.disconnectStoreStart(record)}
                cancelText={"Hủy"}
              >
                <DisconnectOutlined />Gỡ kết nối
              </Popconfirm>
            </Menu.Item>
        </Menu> 
        return (
          <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Tùy chọn <DownOutlined />
            </a>
          </Dropdown>
        )
      }
    }
  ]

  return (
    <>
      <Space align="center" style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={() => history.push('/app/create')}><PlusCircleOutlined /> Kết nối gian hàng mới</Button>
      </Space>
      <Table columns={columns} dataSource={dataSource} bordered/>
    </>
  )
}

export default connect(state => ({
  app: state.app.toJS()
}), dispatch => ({
  disconnectStoreStart: (payload) => dispatch(AppCreators.disconnectStoreStart(payload))
}))(StorageStatus)