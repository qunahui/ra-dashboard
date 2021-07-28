import React, { useState, useEffect } from 'react'
import { Typography, Table, Tag } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { amountFormatter } from 'Utils/inputFormatter'

const { Text } = Typography

export const AllPurchaseOrderTable = (props) => {
  const [dataSource, setDataSource] = useState(props.purchaseOrders || [])
  const [selectedOrderRowKeys, setSelectedOrderRowKeys] = useState([])
  
  useEffect(() => {
    if(!_.isEqual(dataSource, props.purchaseOrders)) {
      setDataSource(props.purchaseOrders)
    }
  }, [props.purchaseOrders])
  
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => <Link to={`/app/products/purchase_orders/${record._id}`}>{value}</Link>
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
          case 'Đã hoàn trả': 
            color = 'cyan'
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
      title: 'Nhập kho',
      dataIndex: 'instockStatus',
      key: 'instockStatus',
      render: (value) => {
        let renderText = ''; 
        let color = 'blue';
        if(value === true) {
          renderText = 'Đã nhập hàng'
          color = 'green'
        } else if(value === false) {
          renderText = 'Chờ nhập hàng'
          color = 'blue'
        }
        return <Tag color={color}>{renderText}</Tag>
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: value => value ? amountFormatter(value) : 0
    }
  ]

  const selectRow = (record) => {
    let selectedRowKeys = [...selectedOrderRowKeys];
    if(!props.selectType || props.selectType === 'checkbox') {
      if (selectedRowKeys.indexOf(record.key) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
      } else {
        selectedRowKeys.push(record.key);
      }
    } else if(props.selectType === 'radio') { 
      selectedRowKeys = [record.key]
    }

    setSelectedOrderRowKeys([...selectedRowKeys]);
  }

  const onRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedOrderRowKeys(selectedRowKeys)
    props.onSelect && props.onSelect(selectedRows)
  }

  return (
    <Table 
      rowSelection={{
        onChange: onRowSelection,
        type: props.selectType ? props.selectType : "checkbox",
        selectedRowKeys: selectedOrderRowKeys,
      }}
      dataSource={dataSource?.map(i => ({ key: i._id, ...i })).filter(i => {
        if(props.filterBySupplier) {
          if (i.supplierEmail === props.filterBySupplier.email && i.instockStatus === true && i.orderStatus !== 'Đã hoàn trả') {
            return i
          }
        } else if(props.refundFilter) {
            if(i.instockStatus === true && i.orderStatus !== 'Đã hoàn trả') {
              return i
            }
        } else {
          return i
        }
      })}
      columns={columns} 
    />
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPurchaseOrderTable)
