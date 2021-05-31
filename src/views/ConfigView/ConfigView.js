import React from 'react'
import { connect } from 'react-redux'
import { Table, Tag, Space } from 'antd';
import StorageStatus from './StorageStatus'
import ActivityTable from 'Components/ActivityTable';

const ConfigView = props => {
  return (
    <>
      <StorageStatus />
      <ActivityTable/>
    </>
  )
}

export default connect(state => ({
}))(ConfigView)