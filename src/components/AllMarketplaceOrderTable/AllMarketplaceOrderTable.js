import React, { useState, useEffect } from 'react'
import { Typography, Table, Tag, Row, Col } from 'antd'
import { connect } from 'react-redux'
import _ from 'lodash'
import { useHistory, Link } from 'react-router-dom'
import { amountFormatter } from 'Utils/inputFormatter'
import SendoIcon from '../../assets/sendo-icon.svg'
import LazadaIcon from '../../assets/lazada-icon.svg'
import { ProfileOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

export const AllOrderTable = (props) => {
  const [dataSource, setDataSource] = useState(props.orders || [])
  const [selectedOrderRowKeys, setSelectedOrderRowKeys] = useState([])
  const columns = [
    {
      title: '',
      dataIndex: 'primaryAvatar',
      key: 'primaryAvatar',
      render: (value, record) => {
        return <img style={{ height: 50, width: 50 }} src={record.lineItems.find(i => !!i.avatar).avatar}/>
      }
    },
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => {
        console.log(record)
        return <Link to={`/app/market_place/orders/${record._id}`}>{value}</Link>
      }
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Sàn TMĐT',
      dataIndex: 'source',
      key: 'source',
      render: (value) => <Text>{value === 'lazada' ? <LazadaIcon style={{ margin: 0, padding: 0 }}/> : <SendoIcon style={{ margin: 0, padding: 0 }}/>}&nbsp;{value.toUpperCase()}</Text>
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
            case 'Sẵn sàng giao hàng':
              color = 'cyan'
              break
            case 'Đang chờ xác nhận thanh toán': 
              color = 'geekblue'
              break
            case 'Đã giao hàng': 
              color = 'green'
              break
            case 'Đã đóng gói': 
              color ='volcano'
              break
            case 'Đã hoàn trả': 
              color = 'magenta'
              break
            default: 
              color = 'blue'
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
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: value => amountFormatter(value)
    },
    {
      title: 'Ngày tạo đơn',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => <Text>{new Date(value).toLocaleString('vi-VN')}</Text>
    }
  ]

  useEffect(() => {
    if(!_.isEqual(dataSource,props.orders)) {
      setDataSource(props.orders)
    }
  }, [props.orders])

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
      bordered
      loading={props.loading}
      locale={{
        emptyText: (
          <Row justify={"center"}>
            <Col span={24}>
              <ProfileOutlined style={{ fontSize: 100, marginTop: 16, marginBottom: 16 }}/>
            </Col>
            <Col span={24}>
              <Title level={5}>Không có đơn hàng</Title>
              <Text type={"secondary"}>Không tìm thấy đơn hàng phù hợp với dữ liệu tìm kiếm.</Text>
            </Col>
          </Row>
        )
      }}
      rowSelection={{
        onChange: onRowSelection,
        type: props.selectType ? props.selectType : "checkbox",
        selectedRowKeys: selectedOrderRowKeys,
      }}
      onRow={(record) => ({
        onClick: () => {
          selectRow(record)
          props.onSelect && props.onSelect(record)
        }
      })}
      dataSource={dataSource.map(i => ({ key: i._id, ...i })).filter(i => {
        if(props.filterByCustomer) {
          if (i.customerEmail === props.filterByCustomer.email && i.outstockStatus === true && i.orderStatus !== 'Đã hoàn trả') {
            return i
          }
        } else if(props.refundFilter) {
          console.log(i.orderStatus)
            if(i.outstockStatus === true && i.orderStatus !== 'Đã hoàn trả') {
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

export default connect(mapStateToProps, mapDispatchToProps)(AllOrderTable)
