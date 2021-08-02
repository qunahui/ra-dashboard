import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AppCreators from 'Redux/app'
import _ from 'lodash'
import timeDiff from 'Utils/timeDiff'
import { Table, Space, Typography, Dropdown, Menu, Button, Popconfirm, Row, Col, Card } from 'antd';
import Icon, { DisconnectOutlined, DownOutlined, PlusCircleOutlined, RollbackOutlined, LoginOutlined } from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import { cardBorder } from './styles'

import LazadaIcon from '../../assets/lazada-icon.svg'
import SendoIcon from '../../assets/sendo-icon.svg'

const { Text, Title } = Typography 

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
        return timeDiff(new Date(record.expires), new Date()).secondsDifference >= 0 ? <Text style={{ color: '#7cb305'}}>Đang kết nối</Text> : <Text style={{ color: '#f5222d'}}>Đã hết hạn</Text>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      width: '25%',
      render: (text, record) => {
        const menu = <Menu>
            {
              record.platform_name === 'lazada' && <Menu.Item key="reconnect"><a  style={{ color: blue[5] }} href={`https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${window.location.origin}/app/create/lazada&country=vn&client_id=101074&state=`}><RollbackOutlined />Kết nối lại</a></Menu.Item>
            }
            {
              record.platform_name === 'sendo' && <Menu.Item key="manual-sync" style={{ color: blue[5] }} 
                  onClick={() => props.syncDataStart(record)}><RollbackOutlined />
                Kết nối lại
              </Menu.Item>
            }
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
    <Card 
      title={<Title level={4} style={{ marginLeft: 8 }}>Các gian hàng đã kết nối</Title>}
      extra={<Button type="primary" onClick={() => history.push('/app/create')}><PlusCircleOutlined /> Kết nối gian hàng mới</Button>}
      style={cardBorder}
    >
      <Table columns={columns} dataSource={dataSource} bordered/>
    </Card>
  )
}

export default connect(state => ({
  app: state.app.toJS(),
}), dispatch => ({
  disconnectStoreStart: (payload) => dispatch(AppCreators.disconnectStoreStart(payload)),
  syncDataStart: (payload) => dispatch(AppCreators.syncDataStart(payload)),
}))(StorageStatus)