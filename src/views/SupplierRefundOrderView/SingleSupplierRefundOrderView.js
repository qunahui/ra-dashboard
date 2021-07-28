import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { request } from 'Config/axios'
import { Row, Col, Form, Typography, Steps, Tag, Input, InputNumber, Divider, Table, Button, Modal, Popconfirm } from 'antd'
import { ArrowLeftOutlined, UserOutlined, ShopOutlined, CreditCardFilled } from '@ant-design/icons'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'
import SupplierRefundOrderCreators from 'Redux/supplierRefundOrder'
import NProgress from 'nprogress'
import toast from 'Helpers/ShowToast'
import './create.styles.scss'

const { Title, Text } = Typography
const { Step } = Steps
const { TextArea } = Input

const customAmountFormatter = (value, max) => {  
  let formattedValue = value
  if(formattedValue > max) {
    formattedValue = max
  }
  
  return `${formattedValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const SingleRefundOrderView = (props) => {
  const history = useHistory()
  const [order, setOrder] = useState({})
  const [currentStep, setCurrentStep] = useState(null)
  const [form] = Form.useForm()

  const refundOrderColumns = [
    {
      title: 'Mã sku',
      dataIndex: 'sku',
      key: 'sku',
      render: (value, record) => <Link to={`/app/product/${record.productId}/variant/${record._id}`} target={"_blank"}>{value}</Link>,
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
      render: (text) => <Text>{amountFormatter(text)}</Text>
    },
    {
      title: 'Giá nhập',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      type: 'number',
      width: 150,
      render: (text) => <Text>{amountFormatter(text)}</Text>
    },
    {
      title: 'Thành tiền',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => <Text strong>{amountFormatter(record.price * record.quantity)}</Text>
    },
  ]

  const renderStatusTag = () => {
    let color = ''
    let renderText = ''

    switch(order.orderStatus) {
      case 'Đang giao dịch': 
        color = 'gold'
        break
      case 'Đã hủy': 
        color = 'red'
        break
      case 'Hoàn thành': 
        color = 'green'
        break
      default: 
        color = 'blue'
    }

    return (
      <Tag color={color}>{order.orderStatus}</Tag>
    )
  }

  async function fetchRefundOrder() {
    NProgress.start()
    try { 
      let id = props.match.params.id;
      const response = await request.get(`/supplier-refund-orders/${id}`)
      if(response.code === 200) {
        setOrder({
          ...response.data,
          paidHistory: response.data.paidHistory.reverse(),
          lineItems: response.data.lineItems.map(i => ({
            ...i,
            key: i._id
          }))
        })
        let currentStep = 0;
        response.data.step && response.data.step.map((i, index) => {
          if(i.isCreated === true) {
            console.log("index: ", index)
            currentStep = index
          }
        })

        if(response.data.orderStatus === 'Đã hủy') {
          setIsOrderCanceled(true)
        }
        setCurrentStep(currentStep)
      }
    } catch(e) { 
      toast({ type: 'error', message: 'Có gì đó sai sai !'})
    } finally {
      NProgress.done()
    }
  }

  useEffect(() => {
    const { isWorking } = props.supplierRefundOrder
    if(!isWorking) {
      fetchRefundOrder()
    }
  }, [props.supplierRefundOrder])
  
  //<---------------------------------------------- payment modal handler ------------------------------------->
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const remainPrice = order.totalPrice - order.paidPrice
  const [paidPrice, setPaidPrice] = useState(order.totalPrice - order.paidPrice || 0)
  const handleConfirmPayment = () => {
    if(!isNaN(paidPrice) && paidPrice > 0) {
      props.confirmPaymentStart({
        _id: order._id,
        paidPrice,
        formattedPaidPrice: amountFormatter(paidPrice)
      })
  
      handleHidePaymentModal()
      fetchRefundOrder()
    } else {
      toast({ type: 'error', message: 'Vui lòng nhập giá trị thanh toán hợp lệ !'})
    }
  }

  const handleShowPaymentModal = () => {
    setShowPaymentModal(true)
  }

  const handleHidePaymentModal = () => {
    setShowPaymentModal(false)
  }
  //<---------------------------------------------- payment modal handler ------------------------------------->
  
  //<---------------------------------------------- cancel handler ------------------------------------->
  const [isOrderCanceled, setIsOrderCanceled] = useState(false)

  const handleCancelRefundOrder = () => {
    console.log(order._id)
    props.cancelOrderStart({
      _id: order._id
    })
  }
  //<---------------------------------------------- payment modal handler ------------------------------------->
  
  //<---------------------------------------------- create receipt handler ------------------------------------->
  const handleCreateReceipt = () => {
    props.createReceiptStart({ 
      _id: order._id,
      lineItems: order.lineItems
    })
  }
  //<---------------------------------------------- create receipt handler ------------------------------------->

  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={() => {}}
    >
      <Row gutter={[0, 16]} style={{ marginBottom: 16 }} justify={"space-between"}>
        <Col span={12}>
          <Row>
            <a href="/app/products/supplier_refund_orders">
              <Title level={5}><ArrowLeftOutlined/> Quay lại danh sách đơn nhập hàng</Title>
            </a>
          </Row>
          <Title level={2}>{order.code}</Title>
          <Text type="secondary">{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
        </Col>
        <Col span={12}>
          <Steps size={"small"} className="custom-step" current={currentStep} type={'default'} progressDot>
            {
              order?.step && order.step.map((curStep) => {
                if(isOrderCanceled === true) {
                  if(curStep.name !== 'Đã hủy') {
                    return (
                      <Step status={"wait"} key={curStep.name} title={curStep.name} description={curStep.createdAt && new Date(curStep.createdAt).toLocaleString('vi-VN')}/>
                    )
                  } else {
                    return (
                      <Step className={"antd-step-error"} status={"error"} key={curStep.name} title={curStep.name} description={curStep.createdAt && new Date(curStep.createdAt).toLocaleString('vi-VN')}/>
                    )
                  }
                } else {
                  if(curStep.name !== 'Đã hủy') {
                    return (
                      <Step key={curStep.name} title={curStep.name} description={curStep.createdAt && new Date(curStep.createdAt).toLocaleString('vi-VN')}/>
                    )
                  }
                }
              })
            }
          </Steps>
        </Col>
      </Row>
      <Row gutter={16}>
          <Col span={19}>
            <div className={"order-info"}>
              <Row gutter={1} className={"padding"}>
                <Col span={24}>
                  <Text strong>Thông tin nhà cung cấp</Text>
                </Col>
                <Col style={{ marginTop: 16}}>
                  <UserOutlined /> {order.supplierName}
                </Col>
              </Row>
              <Divider/>
              <Row className={"padding"}>
                <Tag color={"blue"}>
                  <Col span={24}>
                    <Text strong> TÊN: </Text>&nbsp;{order.supplierName}
                  </Col>
                  <Col span={24}>
                    <Text strong> EMAIL: </Text>&nbsp;{order.supplierEmail}
                  </Col>
                  <Col span={24}>
                    <Text strong> SỐ ĐIỆN THOẠI: </Text>&nbsp;{order.supplierPhone}
                  </Col>
                  <Col span={24}>
                    <Text strong> ĐỊA CHỈ XUẤT HÀNG: </Text>&nbsp;{order.supplierAddress}
                  </Col>
                </Tag>
              </Row>
            </div>
            <div className={"order-info"}>
              <Row gutter={16} style={{ marginTop: 5, padding: '8px 24px'}}>
                <Text strong style={{ marginBottom: 15 }}>Thông tin sản phẩm</Text>
              </Row>
              <Row>
                <Col span={24}>
                    <Table
                      id={"refund-orders-table"}
                      columns={refundOrderColumns}
                      dataSource={order.lineItems}
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
                      {amountFormatter(order.totalQuantity)} <br/>
                      {amountFormatter(order.totalPrice)} <br/>
                      {amountFormatter(order.totalPrice)} <br/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className={"order-info"}>
              <Row justify={"space-between"} gutter={16} style={{ marginTop: 5, padding: '8px 24px'}}>
                <Text strong style={{ marginBottom: 15 }}><CreditCardFilled/> Thanh toán</Text>
                {
                  remainPrice > 0 && <Button onClick={handleShowPaymentModal}>Xác nhận thanh toán</Button>
                }
              </Row>
              <Row className={"padding"}>
                <Col span={12}>
                  <Text>Đã thanh toán: {amountFormatter(order.paidPrice)} đ</Text>
                </Col>
                <Col span={12}>
                  <Text>Còn phải trả: {amountFormatter(parseFloat(order.totalPrice - order.paidPrice))} đ</Text>
                </Col>
              </Row>
              {
                order.paidHistory?.length > 0 && (
                  <Row style={{ marginLeft: 16}}>
                    <Divider/>
                    <Steps progressDot current={0} direction="vertical">
                      {
                        order.paidHistory.map(i => <Step key={i._id} title={i.title} description={new Date(i.date).toLocaleString('vi-VN')}/>)
                      }
                    </Steps>
                  </Row>
                )
              }
              <Modal
                title={`Xác nhận thanh toán cho đơn: ${order.code}`}
                id="payment-modal"
                visible={showPaymentModal}
                onCancel={handleHidePaymentModal}
                footer={[
                  <Button key={"cancel-payment-modal"} onClick={handleHidePaymentModal}>Quay lại</Button>,
                  <Button key={"confirm-payment-modal"} onClick={handleConfirmPayment} type={'primary'}>Thanh toán</Button>
                ]}
              >
                <Text strong>Số tiền tạm thanh toán: </Text>
                <InputNumber style={{ width: '100%', marginTop: 8}} value={paidPrice} onChange={(value) => setPaidPrice(value)} min={0} max={order.totalPrice - order.paidPrice} step={1000} formatter={(value) => customAmountFormatter(value, order.totalPrice - order.paidPrice)} parser={amountParser}/>
              </Modal>
            </div>
          </Col>
          <Col span={5}>
            <div className={"order-info"}>
              <div className={"padding"}>
                <Text strong>Thông tin đơn nhập</Text> &nbsp;
                {renderStatusTag()} 
                <br/><br/>
                <Text><ShopOutlined /> Chi nhánh mặc định</Text>
              </div>
              <Divider style={{ marginTop: 0}}/>
            </div>
            <div className={"order-info padding"}>
              <Row gutter={1} style={{ marginTop: 8 }}>
                <Text strong>GHI CHÚ</Text>
              </Row>
                <Text>{order.note}</Text>
            </div>
            <div className={"order-info padding"}>
              <Row gutter={1} style={{ marginTop: 8 }}>
                <Text strong>MÃ CHỨNG TỪ</Text>
              </Row>
                <Text>{order.reference?.name} / {order.reference?.id}</Text>
            </div>
          </Col>
        </Row>
      <Divider/>
      <Row gutter={8} justify={"space-between"}>
        <Col>
          {
            !order.outstockStatus && (
              <Popconfirm
                title={"Xác nhận hủy đơn hàng này ?"}
                onConfirm={handleCancelRefundOrder}
              >
                <Button disabled={order.orderStatus === 'Đã hủy'} type="danger">{order.orderStatus === 'Đã hủy' ? 'Đã hủy' : 'Hủy đơn hàng'}</Button>
              </Popconfirm>
            )
          }
        </Col>
        <Col>
          <Button style={{ marginRight: 8 }} onClick={() => history.push('/app/products/supplier_refund_orders')}>Quay lại</Button>
          {
            remainPrice > 0 && (
              <Button disabled={isOrderCanceled} style={{ marginRight: 8 }} onClick={handleShowPaymentModal}>Xác nhận thanh toán</Button>
            )
          }
          {
            !order.outstockStatus && (
              <Popconfirm
                title={"Xác nhận xuất kho cho đơn hàng này ?"}
                onConfirm={handleCreateReceipt}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.supplierRefundOrder.isWorking}>Xuất kho</Button>
              </Popconfirm>
            )
          }
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  supplierRefundOrder: state.supplierRefundOrder.toJS()
})

const mapDispatchToProps = dispatch => ({
  confirmPaymentStart: (payload) => dispatch(SupplierRefundOrderCreators.confirmSupplierRefundPaymentStart(payload)),
  createReceiptStart: (payload) => dispatch(SupplierRefundOrderCreators.createSupplierRefundReceiptStart(payload)),
  cancelOrderStart: (payload) => dispatch(SupplierRefundOrderCreators.cancelSupplierRefundOrderStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleRefundOrderView)
