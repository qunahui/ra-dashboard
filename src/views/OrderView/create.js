import React, { useContext, useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { Row, Col, Divider, Form, Typography, Modal, Input, Select, Button, Table, Tag, InputNumber, Steps } from 'antd'
import { moneyFormatter, moneyParser, amountFormatter, amountParser } from 'Utils/inputFormatter'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import CustomerCreators from 'Redux/customer'
import ProductCreators from 'Redux/product'
import OrderCreators from 'Redux/order'

import toast from 'Helpers/ShowToast'
import AddCustomerForm from 'Components/AddCustomerForm'
import CheckInstockModal from 'Components/CheckInstockModal'
import './create.styles.scss'

const { Text, Link } = Typography
const { Option } = Select
const { TextArea } = Input
const { Step } = Steps
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
  const [editing, setEditing] = useState(false);
  const type = restProps.type || 'text'
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      let values = await form.validateFields();
      ['price', 'quantity'].map(tag => {
        values.hasOwnProperty(tag) && (values[tag] = parseFloat(values[tag]))
      })

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        { 
          type === 'number' ?
            <InputNumber 
              ref={inputRef} 
              onPressEnter={save} 
              onBlur={save} 
              formatter={amountFormatter}
              parser={amountParser}
              min={1}
            />
            :
            <Input 
              ref={inputRef} 
              onPressEnter={save} 
              onBlur={save} 
            />
        }
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onMouseEnter={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export const create = (props) => {
  const history = useHistory()
  const [form] = Form.useForm()

  //<--------------------------------------- customer handler -------------------------------------------->
  const [customerList, setCustomerList] = useState([])
  const selectRef = useRef(null)
  const [chosenCustomer, setChosenCustomer] = useState(null)

  useEffect(() => {
    const { customers, isWorking } = props.customer;
    if(!isWorking) { 
      if(customers.length > 0 && !_.isEqual(customers, customerList)) { 
        setCustomerList(customers)
      }
    }
  }, [props.customer])
  
  const handleDropdownVisibleChange = (open) => {
    if(open) {
      props.getCustomerStart()
    }
  }

  const handleRemoveSelectedCustomer = () => {
    setChosenCustomer(null)
    props.getCustomerStart()
  }

  //<--------------------------------------- customer handler -------------------------------------------->
  
  //<--------------------------------------- search product modal handler -------------------------------------------->
  const [productList, setProductList] = useState([])
  const [variantList, setVariantList] = useState([])
  const [searchProductFilter, setSearchProductFilter] = useState('')
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([])
  const [showSearchProductModal, setShowSearchProductModal] = useState(false)

  useEffect(() => {
    const { products, isWorking } = props.product;
    if(!isWorking) { 
      if(products.length > 0 && !_.isEqual(products, productList)) { 
        setProductList(products)
        let newVariantList = []
        products.map(product => {
          newVariantList = [...newVariantList, ...product.variants.map(variant => ({ ...variant, key: variant._id, productId: product._id, price: variant.retailPrice, quantity: 1 }))]
        })

        setVariantList(newVariantList)
      }
    }
  }, [props.product])

  const productColumns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value, record) => {
        return (
          <>
            <img 
              src={value || value[0] || "data:image/png;base64,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"}
              style={{ width: 30, height: 30}}
            />
            &nbsp; {record.name}
          </> 
        )
      },
      width: '75%'
    },
    {
      title: 'inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      render: (text, record) => {
        return (
          <div key={record._id}>
            {amountFormatter(record.retailPrice)}đ<br/>
            <Text>Số lượng: {record.inventories.available}</Text>
          </div>
        )
      }
    }
  ]

  const handleShowSearchProductModal = () => {
    props.getProductsStart()
    setShowSearchProductModal(true)
  }
  const handleHideSearchProductModal = () => {
    setSelectedProductRowKeys([])
    setShowSearchProductModal(false)
  }

  const handleChooseProduct = () => {
    let filteredVariants = variantList;
    filteredVariants = filteredVariants.filter(i => (selectedProductRowKeys.includes(i.key)))
    filteredVariants = filteredVariants.filter(i => ![...purchaseOrderDataSource].map(p => p._id).includes(i.key))
    const finalDataSource = [...purchaseOrderDataSource, ...filteredVariants].map(i => ({ ...i, price: i[pricePolicy] }))
    setPurchaseOrderDataSource(finalDataSource)
    handleCalcPurchaseOrderTotal(finalDataSource)
    handleHideSearchProductModal()
  }
  //<--------------------------------------- search product modal handler -------------------------------------------->
  
  //<--------------------------------------- purchase orders table handler -------------------------------------------->
  const [purchaseOrderDataSource, setPurchaseOrderDataSource] = useState([])
  const [totalState, setTotalState] = useState({
    quantity: 0,
    price: 0,
  })

  const handleCalcPurchaseOrderTotal = (data) => {
    setTotalState({
      quantity: data.reduce((acc, item) => acc += item.quantity, 0),
      price: data.reduce((acc, item) => acc += (item.price * item.quantity), 0),
    })
  }

  const handleSave = (row) => {
    const newData = [...purchaseOrderDataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setPurchaseOrderDataSource(newData);
    handleCalcPurchaseOrderTotal(newData)
  };

  const purchaseOrderColumns = [
    {
      title: 'Mã sku',
      dataIndex: 'sku',
      key: 'sku',
      render: (value, record) => <Link href={`/app/product/${record.productId}/variant/${record._id}`} target={"_blank"}>{value}</Link>,
      width: 200,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
      type: 'number',
      width: 150,
      render: (text, record) => <InputNumber min={1} max={record?.inventories?.available} value={text} formatter={amountFormatter} parser={amountFormatter}/>
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      type: 'number',
      width: 150,
      render: (text) => <InputNumber min={0} value={text} formatter={amountFormatter} parser={amountFormatter}/>
    },
    {
      title: 'Thành tiền',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => <InputNumber min={0} disabled value={parseFloat(parseFloat(record.price) * parseFloat(record.quantity))}  formatter={amountFormatter} parser={amountFormatter}/>
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render:(text, record) => <Link onClick={() => handleRemoveRowFromPurchaseTable(record._id)}><DeleteOutlined/></Link>,
    }
  ].map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        type: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const handleRemoveRowFromPurchaseTable = (_id) => {
    const newData = [...purchaseOrderDataSource].filter(record => record._id !== _id)
    setPurchaseOrderDataSource(newData)
    handleCalcPurchaseOrderTotal(newData)
  }

  //<--------------------------------------- purchase orders table handler -------------------------------------------->
  
  //<--------------------------------------- form submit handler -------------------------------------------->
  const handleFormSubmit = (values) => {
    if(!chosenCustomer || purchaseOrderDataSource.length === 0) {
      return toast({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin !'})
    } else {
      const finalData = {
        ...values,
        customerId: chosenCustomer._id,
        customerName: chosenCustomer.name,
        customerAddress: chosenCustomer.address,
        customerPhone: chosenCustomer.phone,
        customerEmail: chosenCustomer.email,
        userId: chosenCustomer.userId,
        lineItems: purchaseOrderDataSource,
        totalQuantity: totalState.quantity,
        subTotal: totalState.price,
        totalPrice: totalState.price + values.shippingFee, // khach nhan
        totalAmount: totalState.price, //seller nhan
        pricePolicy
      }

      return purchaseOrderDataSource.some(i => (i.quantity > i.inventories.available) || (i.quantity === 0 )) 
        ? toast({ type: 'error', message: 'Số lượng hàng bán vượt quá tồn kho. Vui lòng kiểm tra lại'})
        : props.createOrderStart(finalData)
    }
  }
  //<--------------------------------------- form submit handler -------------------------------------------->

  //<--------------------------------------- price policy handler -------------------------------------------->
  const [pricePolicy, setPricePolicy] = useState('retailPrice')
  const handleChangePricePolicy = (value) => {
    setPricePolicy(value)
  }

  useEffect(() => {
    if(purchaseOrderDataSource.length > 0) {
      let newData = [...purchaseOrderDataSource]
      newData = newData.map(i => {
        return ({ ...i, price: i[pricePolicy] })
      })
      setPurchaseOrderDataSource(newData)
      handleCalcPurchaseOrderTotal(newData)
    }
  }, [pricePolicy])
  //<--------------------------------------- price policy handler -------------------------------------------->


  return (
    <>
      <Row justify="end" style={{ marginBottom: 24 }}>
        <Col span={10}>
          <Steps size={"small"} current={0} type={'default'} progressDot>
            <Step title="Đặt hàng và duyệt"/>
            <Step title="Đóng gói"/>
            <Step title="Xuất kho"/>
            <Step title="Hoàn thành"/>
          </Steps>
        </Col>
      </Row>
      <Form 
        colon={false} 
        layout={"vertical"} 
        form={form}
        onFinishFailed={(err) => console.log("Failed: ", err)}
        onFinish={handleFormSubmit}
      >
        <Row gutter={16}>
          <Col span={19}>
            <div className={"order-info"}>
              <Row gutter={8} className={"padding"}>
                <Col span={24}>
                  <Text strong>Thông tin khách hàng</Text>
                </Col>
                <Col span={24} style={{ marginTop: 16}}>
                  <Form.Item>
                    <Select
                      ref={selectRef}
                      onSelect={(value) => {
                        setChosenCustomer(customerList.find(cus => cus._id === value))
                      }}
                      allowClear
                      onClear={handleRemoveSelectedCustomer}
                      onDropdownVisibleChange={(open) => handleDropdownVisibleChange(open)}
                      placeholder={"Nhập tên khách hàng để tìm kiếm....."}
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          <AddCustomerForm/>
                        </div>
                      )}
                    >
                      {
                        customerList.map(cus => (
                          <Option key={cus._id}>
                            <div>
                              <Text strong>{cus.name}</Text> <br/>
                              {cus.phone}
                            </div>
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {
                chosenCustomer && (
                  <Row style={{ paddingLeft: 16, paddingBottom: 8}}>
                    <Tag color={"blue"}>
                      <Col span={24}>
                        <Text strong> TÊN: </Text>&nbsp;{chosenCustomer.name}
                      </Col>
                      <Col span={24}>
                        <Text strong> EMAIL: </Text>&nbsp;{chosenCustomer.email}
                      </Col>
                      <Col span={24}>
                        <Text strong> SỐ ĐIỆN THOẠI: </Text>&nbsp;{chosenCustomer.phone}
                      </Col>
                      <Col span={24}>
                        <Text strong> ĐỊA CHỈ XUẤT HÀNG: </Text>&nbsp;{chosenCustomer.address}
                      </Col>
                    </Tag>
                  </Row>
                )
              }
            </div>
            <div className={"order-info"}>
              <Row gutter={16} style={{ marginTop: 5, padding: '8px 24px 0 24px'}} justify={"space-between"}>
                <Text strong style={{ marginBottom: 15 }}>Thông tin sản phẩm</Text>
                <CheckInstockModal disabled={purchaseOrderDataSource.length === 0} dataSource={purchaseOrderDataSource}/>
                <Modal 
                  width={800}
                  title={'Chọn sản phẩm'}
                  id="Search products modal"
                  visible={showSearchProductModal}
                  onCancel={handleHideSearchProductModal}
                  footer={[
                    <Button key={"cancel-search-modal"} onClick={handleHideSearchProductModal}>Thoát</Button>,
                    <Button key={"submit-search-modal"} type="primary" onClick={handleChooseProduct}>Thêm vào đơn</Button>
                  ]}
                >
                  <Input prefix={<SearchOutlined/>} value={searchProductFilter} onChange={(e) => setSearchProductFilter(e.target.value)}/> <br/><br/>
                  <Table
                    id={"search-product-table"}
                    rowSelection={{
                      type: 'checkbox',
                      onChange: (selectedRowKeys, selectedRows) => setSelectedProductRowKeys(selectedRowKeys),
                      selectedRowKeys: selectedProductRowKeys
                    }}
                    rowClassName={'search-product-row-cursor'}
                    onRow={(record, rowIndex) => ({
                      onClick: (e) => {
                        if(selectedProductRowKeys.includes(record._id)) {
                          setSelectedProductRowKeys([...selectedProductRowKeys].filter(key => key !== record._id))
                        } else {
                          setSelectedProductRowKeys([...selectedProductRowKeys, record._id])
                        }
                      }
                    })}
                    scroll={{ y: 350 }} 
                    showHeader={false}
                    columns={productColumns}
                    dataSource={variantList.filter(variant => variant.name.includes(searchProductFilter))}
                  />
                </Modal>
              </Row>
              <Row style={{ padding: 8}}>
                <Input prefix={<SearchOutlined/>} placeholder={"Tìm kiếm sản phẩm"} onClick={handleShowSearchProductModal}/>
              </Row>
              <Row style={{ marginTop: 5}}>
                <Col span={24}>
                  <Table
                    components={{
                      body: {
                        row: EditableRow,
                        cell: EditableCell,
                      },
                    }}
                    id={"purchase-orders-table"}
                    columns={purchaseOrderColumns}
                    dataSource={purchaseOrderDataSource}
                  />
                </Col>
              </Row>
              <Row justify="end" style={{ margin: 16}}>
                <Col span={10}>
                  <Row justify="space-between">
                    <Col>
                      <Text>Số lượng</Text> <br/>
                      <Text>Phí vận chuyển</Text> <br/>
                      <Text>Tổng tiền hàng</Text> <br/>
                      <Text strong>Tổng tiền nhận được</Text> <br/>
                      <Text strong>Tổng tiền khách cần trả</Text> <br/>
                    </Col>
                    <Col>
                      {totalState.quantity} <br/>
                      {amountFormatter(form.getFieldValue('shippingFee')) || 0} <br/>
                      {amountFormatter(totalState?.price) || 0} <br/>
                      {amountFormatter(totalState?.price) || 0} <br/>
                      {amountFormatter(totalState?.price + form.getFieldValue('shippingFee')) || 0} <br/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={5}>
            <div className={"order-info padding"}>
              <Text strong>Thông tin đơn xuất hàng</Text>
              <Row gutter={1} style={{ marginTop: 20 }}>
                <Form.Item style={{ width: '100%' }} label="Mã đơn xuất hàng" name="code"
                  rules={[{ required: true, message: 'Trường mã đơn là bắt buộc'}]}
                >
                  <Input/>
                </Form.Item>
                <Row style={{ marginBottom: 16, width: '100%'}}>
                  <Text style={{ marginBottom: 5}}>Chi nhánh</Text>
                  <Input disabled={true} value={"Chi nhánh mặc định"}/>
                </Row>
                <Row style={{ width: '100%'}}>
                  <Text style={{ marginBottom: 5}}>Chính sách giá</Text>
                  {/* <Input disabled={true} value={"Giá xuất"}/> */}
                  <Select style={{ width: '100%'}} defaultValue={'retailPrice'} onChange={(value) => handleChangePricePolicy(value)}>
                    <Option value={'retailPrice'}>Giá bán lẻ</Option>
                    <Option value={'wholeSalePrice'}>Giá bán buôn</Option>
                    <Option value={'importPrice'}>Giá nhập</Option>
                  </Select>
                </Row>
              </Row>
            </div>
            <div className={"order-info padding"}>
              <Row gutter={1} style={{ marginTop: 8 }}>
                <Form.Item style={{ width: '100%' }} label="Phí vận chuyển" name="shippingFee" initialValue={0}>
                  <InputNumber formatter={moneyFormatter} parser={moneyParser} style={{ width: '100%'}}/>
                </Form.Item>
              </Row>
            </div>
            <div className={"order-info padding"}>
              <Row gutter={1} style={{ marginTop: 8 }}>
                <Form.Item style={{ width: '100%' }} label="GHI CHÚ" name="note">
                  <TextArea/>
                </Form.Item>
              </Row>
            </div>
          </Col>
        </Row>
        <Divider/>
        <Row justify="end" gutter={[16]}>
          <Col>
            <Button onClick={() => history.push('/app/products/purchase_orders')}>Hủy</Button>
          </Col>
          <Col>
            <Button htmlType="submit" type="primary">Đặt hàng và duyệt</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  customer: state.customer.toJS(),
  product: state.product.toJS(),
})

const mapDispatchToProps = dispatch => ({
  getCustomerStart: () => dispatch(CustomerCreators.getCustomerStart()),
  getProductsStart: () => dispatch(ProductCreators.getProductsStart()),
  createOrderStart: (payload) => dispatch(OrderCreators.createOrderStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(create)
