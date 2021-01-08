import React from 'react'
import { connect } from 'react-redux'
import { Table, Tag, Space } from 'antd';

const ConfigView = props => {
  const columns = [
    {
      title: 'Stores informations',
      dataIndex: 'store_name',
      key: 'store_name',
    },
    {
      title: 'Status',
      dataIndex: 'app_key',
      key: 'app_key',
    },
    {
      title: 'Last sync',
      dataIndex: 'id',
      key: 'id',
    },
  ]

  const dataSource = props.platformCredentials

  return <div>
    <Table columns={columns} dataSource={dataSource} />
  </div>
}

export default connect(state => ({
  platformCredentials: state.app.toJS().storage.platformCredentials
}))(ConfigView)