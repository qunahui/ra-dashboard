import React, { useState, useEffect } from 'react'
import { Table, Typography } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'

import SendoCategoryPicker from 'Components/SendoCategoryPicker'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'

import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'
import SystemIcon from 'Assets/system.svg'

const { Text } = Typography

export const CateMappingTable = (props) => {
  //<------------------------------------------------------- category handler --------------------------------------------------------->
  const { credentials } = props
  const [defaultCategory, setDefaultCategory] = useState(props.defaultCategory || { name: '', value: 0 })
  const [sendoCategory, setSendoCategory] = useState(props.sendoCategory || { name: '', value: 0 })
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    if(!_.isEqual(credentials.map(i => ({ key: i.store_name, ...i })), dataSource)) {
      setDataSource(credentials.map(i => ({ key: i.store_name, ...i })))
    }
  }, [credentials])

  useEffect(() => {
    if(!_.isEqual(defaultCategory, props.defaultCategory)) {
      setDefaultCategory(props.defaultCategory)
    }
  }, [props.defaultCategory])

  useEffect(() => {
    if(!_.isEqual(sendoCategory, props.sendoCategory)) {
      setSendoCategory(props.sendoCategory)
    }
  }, [props.sendoCategory])

  const categoryColumns = [
    {
      title: 'Kênh bán',
      dataIndex: 'channel',
      key: 'channel',
      width: 300,
      render: (value, record) => {
        const icon = record.platform_name === 'sendo' ? <SendoIcon/> : record.platform_name === 'lazada' ? <LazadaIcon/> : <SystemIcon/>
        return (
          <>
            {icon} &nbsp; {record.platform_name.toUpperCase()}
          </> 
        )
      }
    },
    {
      title: 'Ngành hàng',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (value, record) => {
        const component = record.platform_name === 'sendo' 
          ? <SendoCategoryPicker
              handleSelect={handleSendoSelect}
              renderState={sendoCategory}
            /> 
          : <LazadaCategoryPicker
              handleSelect={handleLazadaSelect}
              renderState={defaultCategory}
            />
        return (
          <>
            {component}
          </>
        )
      }
    }
  ]

  const handleSendoSelect = (selected) => {
    props.handleSendoSelect(selected)
  }

  const handleLazadaSelect = (selected) => {
    props.handleLazadaSelect(selected)
  }

  //<------------------------------------------------------- category handler --------------------------------------------------------->

  return (
    <Table
      columns={categoryColumns}
      dataSource={dataSource}
      pagination={{ position: [] }}
    />
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CateMappingTable)
