import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Link, useHistory } from 'react-router-dom' 
import { Row, Col, Typography, Divider, Button, Table } from 'antd'
import SupplierCreators from 'Redux/supplier'
import AddSupplierForm from 'Components/AddSupplierForm'

const { Title, Text } = Typography

export const SupplierView = (props) => {
  const [supplierList, setSupplierList] = useState([])
  const history = useHistory()
  const [selectedSupRowKeys, setSelectedSupRowKeys] = useState([])

  const columns = [
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/app/products/suppliers/${record._id}`}>{text}</Link>
    },
    {
      title: 'Nhóm nhà cung cấp',
      dataIndex: 'group',
      key: 'group',
      render: (text) => {
        let renderText = text;
        switch(text) {
          case 'Normal': 
            renderText = 'Khác'
            break;
        }

        return <Text>{renderText}</Text>
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
  ]

  useEffect(() => {
    props.getSupplierStart()
  }, [])

  useEffect(() => {
    const { isWorking, suppliers } = props.supplier
    if(!isWorking && suppliers.length > 0 && !_.isEqual(suppliers, supplierList)) {
      setSupplierList(suppliers.map(sup => ({
        ...sup,
        key: sup._id
      })))
    }
  }, [props.supplier])

  const onRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedOrderRowKeys(selectedRowKeys)
  }

  return (
    <>
      <Row justify={"center"}>
        <Col span={16}>
          <Title level={3}>Quản lý nhà cung cấp</Title>
          <Divider/>  
        </Col>
      </Row>
      {
        supplierList.length > 0 ? (
          <Row 
            justify={"end"}
            style={{ 
              backgroundColor: '#fff',
              padding: '8px 24px',
              border: '1px solid #ccc',
              borderRadius: 5
            }}
          >
            <Col span={24} style={{ marginBottom: 8, width: '100%' }}>
              <AddSupplierForm/>
              {/* <Button type={"primary"}>Thêm nhà cung cấp</Button> */}
            </Col>
            <Col span={24}>
              <Table 
                rowSelection={{
                  onChange: onRowSelection,
                }}
                dataSource={supplierList} 
                columns={columns} 
                
              />
            </Col>
          </Row>
        ) : (
          <Row justify={"center"}>
            <Col span={16} className={"front-text"}>
              <Text>Cửa hàng của bạn chưa có nhà cung cấp nào</Text> <br/>
              <Button 
                type={"primary"} 
                style={{ marginTop: 50}}
                onClick={() => history.push('/app/products/suppliers/create')}
              >Tạo nhà cung cấp đầu tiên</Button>
            </Col>
          </Row>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  supplier: state.supplier.toJS()
})

const mapDispatchToProps = dispatch => ({
  getSupplierStart: () => dispatch(SupplierCreators.getSupplierStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierView)
