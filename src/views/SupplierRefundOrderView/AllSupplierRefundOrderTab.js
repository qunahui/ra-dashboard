import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Typography, Table, Tag } from 'antd'
import { connect } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { amountFormatter } from 'Utils/inputFormatter'

const { Text } = Typography

export const AllRefundOrderTab = (props) => {
  const history = useHistory()
  const [dataSource, setDataSource] = useState(props.refundOrders || [])
  const [selectedOrderRowKeys, setSelectedOrderRowKeys] = useState([])
  
  useEffect(() => {
    if(!_.isEqual(dataSource, props.refundOrders)) {
      setDataSource(props.refundOrders)
    }
  }, [props.refundOrders])

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => <Link to={`/app/products/supplier_refund_orders/${record._id}`}>{value}</Link>
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'department',
      key: 'department',
      render: (value) => <Text>Chi nhánh mặc định</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (value) => {
        let color = 'blue'
        switch(value) {
          case 'Đang giao dịch':
            color = 'gold'
            break
          case 'Đã hủy':
            color = 'red'
            break
          case 'Hoàn thành':
            color = 'green'
            break
        }
        return <Tag color={color}>{value}</Tag>
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (value) => {
        let color = 'blue'
        switch(value) {
          case 'Thanh toán một phần':
            color = 'gold'
            break
          case 'Chưa thanh toán':
            color = 'blue'
            break
          case 'Đã thanh toán':
            color = 'green'
            break
        }
        return <Tag color={color}>{value}</Tag>
      }
    },
    {
      title: 'Xuất kho',
      dataIndex: 'outstockStatus',
      key: 'outstockStatus',
      render: (value) => {
        let renderText = ''; 
        let color = 'blue';
        if(value === true) {
          renderText = 'Đã xuất hàng'
          color = 'green'
        } else if(value === false) {
          renderText = 'Chờ xuất hàng'
          color = 'blue'
        }
        return <Tag color={color}>{renderText}</Tag>
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: value => amountFormatter(value)
    }
  ]

  const onRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedOrderRowKeys(selectedRowKeys)
  }

  return (
    <Table 
      rowSelection={{
        onChange: onRowSelection,
      }}
      dataSource={dataSource.map(i => ({ key: i._id, ...i}))} 
      columns={columns} 
    />
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AllRefundOrderTab)
