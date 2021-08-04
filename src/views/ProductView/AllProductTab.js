import React, { useState, useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Creators from 'Redux/product'
import { removeVI } from 'jsrmvi'
import _ from 'lodash'

//
import { Table, Button, Tag, Row, Col, Input, Tooltip, Typography } from 'antd'
import { UndoOutlined } from '@ant-design/icons'

const columns = [
  {
    title: '',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (value, record) => {
      return (
        <img 
          src={(value && value?.[0]) || "data:image/png;base64,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"}
          style={{ width: 50, height: 50 }}
        />
      )
    },
    width: '5%'
  },
  {
    title: <div>Sản phẩm</div>,
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      return <>
      <Link to={`/app/product/${record._id}`}>{record.name}</Link><br/>
      {record.store_id}
    </>
    },
    width: '15%'
  },
  {
    title: <div>Tag</div>,
    dataIndex: 'tags',
    key: 'tags',
    width: '15%',
    render: tags => (
      <>
        {
          tags?.length > 0 ? tags?.map(tag => {
          let color = 'blue'
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        }) : '--'
        }
      </>
    ),
  },
  {
    title: <div>Nhãn hiệu</div>,
    dataIndex: 'brand',
    key: 'brand',
    width: '10%',
    render: (value) => <span>{value ? value : '--'}</span>
  },
  {
    title: <div>Có thể bán</div>,
    dataIndex: 'sellableVariants',
    key: 'sellableVariants',
    width: '15%',
    render: (value, record) => {
      return <Typography.Text>({record.variants.length} phiên bản)</Typography.Text>
    }
  },
  {
    title: <div>Trạng thái</div>,
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (value, record) => <Typography.Text type={record.sellable ? "success" : "warning"}>{record.sellable ? "Đang giao dịch" : "Ngừng giao dịch"}</Typography.Text>
  },
  {
    title: <div>Ngày khởi tạo</div>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '15%',
    render: value => new Date(value).toLocaleString('vi-VN')
  },
]

const INITIAL_FILTER = {
  name: '',
  type: 'active'
}

const FilterPanel = ({ onFilter }) => {
  const [filter, setFilter] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    INITIAL_FILTER
  )

  const handleFilterSubmit = () => {
    onFilter({ name: filter?.name })
  }
  
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 8 }} justify="end">
      <Col span={6}><Input value={filter?.name} onChange={e => setFilter({ name: e.target.value })} placeholder={"Tìm kiếm theo tên"} allowClear/></Col>
      <Col span={2}>
        <Button type={'primary'} style={{ width: '100%'}} onClick={handleFilterSubmit}>Tìm kiếm</Button>
      </Col>
    </Row>
  )
}

export const AllProductTab = (props) => {
  const [dataSource, setDataSource] = useState([])
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    setFilterType(props.type)
    props.getProductsStart({ type: props.type })
  }, [props.type])

  useEffect(() => {
    if(!_.isEqual(props.products, dataSource)) {
      setDataSource(props.products.map(i => ({ 
          ...i, 
          key: i._id,
          slug: removeVI(i.name, { replaceSpecialCharacters: false }).split(' ').join('-')
        })))
    }
  }, [props.products])

  return (
    <>
    <FilterPanel onFilter={(params) => props.getProductsStart({ ...params, type: filterType })}/>
    <Table 
      dataSource={dataSource} 
      columns={columns} 
      bordered
    />
    </>
  )
}

const mapStateToProps = (state) => ({
  products: state.product.toJS().products
})

const mapDispatchToProps = dispatch => ({
  getProductsStart: (params = {}) => dispatch(Creators.getProductsStart(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(AllProductTab)
