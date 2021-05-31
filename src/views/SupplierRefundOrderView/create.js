import React, { useContext, useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { Row, Col, Divider, Form, Typography, Modal, Input, Select, Button, Table, Tag, InputNumber, Steps } from 'antd'
import { moneyFormatter, moneyParser, amountFormatter, amountParser } from 'Utils/inputFormatter'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import SupplierCreators from 'Redux/supplier'
import PurchaseOrderCreators from 'Redux/purchaseOrder'
import SupplierRefundOrderCreators from 'Redux/supplierRefundOrder'
import toast from 'Helpers/ShowToast'

import AllPurchaseOrderTable from 'Components/AllPurchaseOrderTable'
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
    console.log(title)
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
              max={title === 'Số lượng' && restProps.max}
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

  //<--------------------------------------- supplier handler -------------------------------------------->
  const [supplierList, setSupplierList] = useState([])
  const [chosenSupplier, setChosenSupplier] = useState(null)

  useEffect(() => {
    const { suppliers, isWorking } = props.supplier;
    if(!isWorking) { 
      if(suppliers.length > 0 && !_.isEqual(suppliers, supplierList)) { 
        setSupplierList(suppliers)
      }
    }
  }, [props.supplier])
  
  const handleDropdownVisibleChange = (open) => {
    if(open) {
      props.getSupplierStart()
    }
  }

  const handleRemoveSelectedSupplier = () => {
    setChosenSupplier(null)

  }
  //<--------------------------------------- supplier handler -------------------------------------------->
  
  //<--------------------------------------- search product modal handler -------------------------------------------->
  const [orderList, setOrderList] = useState([])
  const [chosenOrder, setChosenOrder] = useState(null)
  const [lineItemList, setLineItemList] = useState([])
  const [searchOrderFilter, setSearchOrderFilter] = useState('')
  const [showSearchOrderModal, setShowSearchOrderModal] = useState(false)

  useEffect(() => {
    const { purchaseOrders, isWorking } = props.purchaseOrder;
    if(!isWorking) { 
      if(purchaseOrders.length > 0 && !_.isEqual(purchaseOrders, orderList)) { 
        setOrderList(purchaseOrders)
      }
    }
  }, [props.purchaseOrder])

  const handleShowSearchOrderModal = () => {
    props.getPurchaseOrdersStart()
    setShowSearchOrderModal(true)
  }
  const handleHideSearchOrderModal = () => {
    setShowSearchOrderModal(false)
  }

  const handleOrderChange = (selected) => {
    setChosenOrder(selected)
  }

  const handleOrderSelect = () => {
    if(chosenOrder) {
      if(chosenSupplier?.email !== chosenOrder.supplierEmail) {
        setChosenSupplier({
          email: chosenOrder.supplierEmail,
          phone: chosenOrder.supplierPhone,
          address: chosenOrder.supplierAddress,
          group: chosenOrder.supplierGroup,
          name: chosenOrder.supplierName,
          _id: chosenOrder.supplierId,
          userId: chosenOrder.userId
        })
      }
      setLineItemList(chosenOrder.lineItems.map(lineItem => ({ key: lineItem._id, ...lineItem })))
      handleCalcRefundOrderTotal(chosenOrder.lineItems.map(lineItem => ({ key: lineItem._id, ...lineItem })))
      setShowSearchOrderModal(false)
      form.setFieldsValue({
        code: `HOÀN_TRẢ_${chosenOrder.code}`
      })
    }
  }
  //<--------------------------------------- search product modal handler -------------------------------------------->
  
  //<--------------------------------------- refund orders table handler -------------------------------------------->
  const [totalState, setTotalState] = useState({
    quantity: 0,
    price: 0,
  })

  const handleCalcRefundOrderTotal = (data) => {
    setTotalState({
      quantity: data.reduce((acc, item) => acc += item.quantity, 0),
      price: data.reduce((acc, item) => acc += (item.price * item.quantity), 0),
    })
  }

  const handleSave = (row) => {
    const newData = [...lineItemList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setLineItemList(newData);
    handleCalcRefundOrderTotal(newData)
  };

  const lineItemColumns = [
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
      render: (value) => <InputNumber min={1} value={value} formatter={amountFormatter} parser={amountFormatter}/>
    },
    {
      title: 'Giá hoàn',
      dataIndex: 'price',
      key: 'price',
      type: 'number',
      width: 150,
      render: (value) => <InputNumber disabled={true} min={0} value={value} formatter={amountFormatter} parser={amountFormatter}/>
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
      render:(text, record) => <Link onClick={() => handleRemoveRowFromRefundTable(record._id)}><DeleteOutlined/></Link>,
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
        max: lineItemList.find(i => i._id === record._id).quantity,
        handleSave: handleSave,
      }),
    };
  });

  const handleRemoveRowFromRefundTable = (_id) => {
    const newData = [...lineItemList].filter(record => record._id !== _id)
    setLineItemList(newData)
    handleCalcRefundOrderTotal(newData)
  }

  //<--------------------------------------- refund orders table handler -------------------------------------------->
  
  //<--------------------------------------- form submit handler -------------------------------------------->
  const handleFormSubmit = (values) => {
    if(!chosenSupplier || !chosenOrder) {
      toast({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin !'})
    } else if(chosenSupplier.email !== chosenOrder.supplierEmail) {
      toast({ type: 'error', message: 'Nhà cung cấp không trùng với đơn hàng !'})
    } else {
      const finalData = {
        ...values,
        supplierId: chosenSupplier?._id,
        supplierName: chosenSupplier?.name,
        supplierAddress: chosenSupplier?.address,
        supplierPhone: chosenSupplier?.phone,
        supplierEmail: chosenSupplier?.email,
        userId: chosenSupplier?.userId,
        lineItems: lineItemList,
        totalPrice: totalState?.price,
        subTotal: totalState?.price,
        totalQuantity: totalState?.quantity,
        reference: {
          name: chosenOrder?.code,
          id: chosenOrder?._id
        }
      }

      props.createSupplierRefundOrderStart(finalData)
    }
  }
  //<--------------------------------------- form submit handler -------------------------------------------->


  return (
    <>
      <Row justify="end" style={{ marginBottom: 24 }}>
        <Col span={10}>
          <Steps size={"small"} current={0} type={'default'} progressDot>
            <Step title="Duyệt đơn hoàn"/>
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
              <Row gutter={1} className={"padding"}>
                <Col span={24}>
                  <Text strong>Thông tin nhà cung cấp</Text>
                </Col>
                <Col span={24} style={{ marginTop: 16}}>
                  <Form.Item>
                    <Select
                      value={chosenSupplier && chosenSupplier.name}
                      onSelect={(value) => {
                        setChosenSupplier(supplierList.find(sup => sup._id === value))
                      }}
                      allowClear
                      onClear={handleRemoveSelectedSupplier}
                      onDropdownVisibleChange={(open) => handleDropdownVisibleChange(open)}
                      placeholder={"Nhập tên nhà cung cấp để tìm kiếm....."}
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          {/* <AddSupplierForm/> */}
                        </div>
                      )}
                    >
                      {
                        supplierList.map(sup => (
                          <Option key={sup._id}>
                            <div>
                              <Text strong>{sup.name}</Text> <br/>
                              {sup.phone}
                            </div>
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {
                chosenSupplier && (
                  <Row style={{ paddingLeft: 16, paddingBottom: 8}}>
                    <Tag color={"blue"}>
                      <Col span={24}>
                        <Text strong> TÊN: </Text>&nbsp;{chosenSupplier.name}
                      </Col>
                      <Col span={24}>
                        <Text strong> EMAIL: </Text>&nbsp;{chosenSupplier.email}
                      </Col>
                      <Col span={24}>
                        <Text strong> SỐ ĐIỆN THOẠI: </Text>&nbsp;{chosenSupplier.phone}
                      </Col>
                      <Col span={24}>
                        <Text strong> ĐỊA CHỈ XUẤT HÀNG: </Text>&nbsp;{chosenSupplier.address}
                      </Col>
                    </Tag>
                  </Row>
                )
              }
            </div>
            <div className={"order-info"}>
              <Row gutter={16} style={{ marginTop: 5, padding: '8px 24px'}}>
                <Text strong style={{ marginBottom: 15 }}>Thông tin đơn hoàn</Text>
                <Input prefix={<SearchOutlined/>} placeholder={"Tìm kiếm đơn hoàn"} onClick={handleShowSearchOrderModal}/>
                <Modal 
                  width={'90%'}
                  title={'Chọn đơn hàng'}
                  id="Search  orders modal"
                  visible={showSearchOrderModal}
                  onCancel={handleHideSearchOrderModal}
                  footer={[
                    <Button key={"cancel-search-modal"} onClick={handleHideSearchOrderModal}>Thoát</Button>,
                    <Button key={"submit-search-modal"} type="primary" onClick={handleOrderSelect}>Thêm vào đơn</Button>
                  ]}
                >
                  <Input prefix={<SearchOutlined/>} value={searchOrderFilter} onChange={(e) => setSearchOrderFilter(e.target.value)}/> <br/><br/>
                  <AllPurchaseOrderTable purchaseOrders={orderList.filter(i => i.supplierName !== props.displayName )} selectType={"radio"} onSelect={handleOrderChange} selectOnClick filterBySupplier={chosenSupplier} refundFilter/>
                </Modal>
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
                    id={"refund-orders-table"}
                    columns={lineItemColumns}
                    dataSource={lineItemList}
                  />
                </Col>
              </Row>
              <Row justify="end" style={{ margin: 16}}>
                <Col span={6}>
                  <Row justify="space-between">
                    <Col>
                      <Text>Số lượng</Text> <br/>
                      <Text>Tổng tiền</Text> <br/>
                      <Text strong>Tiền cần trả</Text> <br/>
                    </Col>
                    <Col>
                      {totalState.quantity} <br/>
                      {amountFormatter(totalState.price)} <br/>
                      {amountFormatter(totalState.price)} <br/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={5}>
            <div className={"order-info padding"}>
              <Text strong>Thông tin đơn hoàn hàng</Text>
              <Row gutter={1} style={{ marginTop: 20 }}>
                <Form.Item style={{ width: '100%' }} label="Mã đơn hoàn hàng" name="code"
                  rules={[{ required: true, message: 'Trường mã đơn là bắt buộc'}]}
                >
                  <Input />
                </Form.Item>
                <Row style={{ marginBottom: 16, width: '100%'}}>
                  <Text style={{ marginBottom: 5}}>Chi nhánh</Text>
                  <Input disabled={true} value={"Chi nhánh mặc định"}/>
                </Row>
                <Row style={{ width: '100%'}}>
                  <Text style={{ marginBottom: 5}}>Chính sách giá</Text>
                  <Input disabled={true} value={"Giá nhập"}/>
                </Row>
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
            <Button onClick={() => history.push('/app/supplier_refund_orders')}>Hủy</Button>
          </Col>
          <Col>
            <Button htmlType="submit" type="primary">Duyệt đơn hoàn</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  supplier: state.supplier.toJS(),
  purchaseOrder: state.purchaseOrder.toJS(),
  displayName: state.auth.toJS().user.displayName
})

const mapDispatchToProps = dispatch => ({
  getSupplierStart: () => dispatch(SupplierCreators.getSupplierStart()),
  getPurchaseOrdersStart: () => dispatch(PurchaseOrderCreators.getPurchaseOrdersStart()),
  createSupplierRefundOrderStart: (payload) => dispatch(SupplierRefundOrderCreators.createSupplierRefundOrderStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(create)
