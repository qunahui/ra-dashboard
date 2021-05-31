import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { request } from 'Config/axios'
import { Row, Col, Form, Typography, Steps, Tag, Input, InputNumber, Divider, Table, Button, Modal, Popconfirm, Popover } from 'antd'
import { ArrowLeftOutlined, UserOutlined, ShopOutlined, CreditCardFilled } from '@ant-design/icons'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'
import OrderCreators from 'Redux/order'
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

export const SingleOrderView = (props) => {
  const history = useHistory()
  const [order, setOrder] = useState({})
  const [currentStep, setCurrentStep] = useState(null)
  const [form] = Form.useForm()

  const orderColumns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value, record) => <Popover
        placement={"rightTop"} content={<img 
          src={value || "data:image/png;base64,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"}
          style={{ height: 150 }}/>}
      >
        <img
          style={{ height: 50, cursor: 'pointer' }}
          src={value || "data:image/png;base64,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"}/>
      </Popover>,
      width: 100,
    },
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
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      type: 'number',
      width: 150,
      render: (text, record) => <Text>{amountFormatter(text)}</Text>
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

  //<---------------------------------------------- cancel handler ------------------------------------->
  const [isOrderCanceled, setIsOrderCanceled] = useState(false)

  const handleCancelOrder = () => {
    console.log(order._id)
    props.cancelOrderStart({
      _id: order._id
    })
  }
  //<---------------------------------------------- payment modal handler ------------------------------------->
  
  async function fetchOrder() {
    NProgress.start()
    try { 
      let id = props.match.params.id;
      const response = await request.get(`/orders/${id}`)
      if(response.code === 200) {
        setOrder({
          ...response.data[0],
          paidHistory: response.data[0].paidHistory.reverse(),
          lineItems: response.data[0].lineItems.map(i => ({
            ...i,
            key: i._id
          }))
        })
        let currentStep = 0;
        response.data[0].step && response.data[0].step.map((i, index) => {
          if(i.isCreated === true) {
            currentStep = index
          }
        })

        console.log(response.data[0].step)

        setCurrentStep(currentStep)
        setIsOrderCanceled(response.data[0].orderStatus === 'Đã hủy')
      }
    } catch(e) { 
      toast({ type: 'error', message: 'Có gì đó sai sai !'})
    } finally {
      NProgress.done()
    }
  }

  useEffect(() => {
    const { isWorking } = props.order
    if(!isWorking) {
      fetchOrder()
    }
  }, [props.order])

  //<---------------------------------------------- payment modal handler ------------------------------------->
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const remainPrice = order.totalAmount - order.paidPrice
  const [paidPrice, setPaidPrice] = useState(order.totalAmount - order.paidPrice || 0)
  const handleConfirmPayment = () => {
   if(!isNaN(paidPrice) && paidPrice > 0) {
    props.confirmPaymentStart({
      _id: order._id,
      paidPrice,
      formattedPaidPrice: amountFormatter(paidPrice)
    })

    handleHidePaymentModal()
    fetchOrder()
   } else {
     toast({ type: 'error', message: 'Vui lòng nhập giá trị thanh toán hợp lệ'})
   }
  }

  const handleShowPaymentModal = () => {
    setShowPaymentModal(true)
  }

  const handleHidePaymentModal = () => {
    setShowPaymentModal(false)
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

  //<---------------------------------------------- create pack handler ------------------------------------->
  const handleCreatePackaging = () => {
    props.createPackagingStart({ 
      _id: order._id,
    })
  }
  //<---------------------------------------------- create pack handler ------------------------------------->

  //<---------------------------------------------- confirm delivery handler ------------------------------------->
  const handleConfirmDelivery = () => {
    props.confirmDeliveryStart({ 
      _id: order._id,
    })
  }
  //<---------------------------------------------- confirm delivery handler ------------------------------------->

  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={() => {}}
    >
      <Row>
        <Steps size={"small"} className="custom-step" current={currentStep} type={'default'} progressDot>
          {/* {
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
          } */}
          {
            order?.step && order.step.map((curStep, index) => {
              if(index < 6) {
                return (
                  <Step status={isOrderCanceled && "wait"} key={curStep.name} title={curStep.name} description={curStep.createdAt && new Date(curStep.createdAt).toLocaleString('vi-VN')}/>
                )
              } else {
                return <Step className={"antd-step-error"} status={index >= 6 && index === currentStep ? "error" : 'wait'} key={curStep.name} title={curStep.name} description={curStep.createdAt && new Date(curStep.createdAt).toLocaleString('vi-VN')}/>
              }
            })
          }
        </Steps>
      </Row>
      <Row gutter={[0, 16]} style={{ marginBottom: 16 }} justify={"space-between"}>
        <Col span={8}>
          <Title level={2}>Mã đơn hàng: #{order.code}</Title>
          <Text type="secondary">{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
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
                  <UserOutlined /> {order.customerName}
                </Col>
              </Row>
              <Divider/>
              <Row className={"padding"}>
                <Tag color={"blue"}>
                  <Col span={24}>
                    <Text strong> TÊN: </Text>&nbsp;{order.customerName}
                  </Col>
                  <Col span={24}>
                    <Text strong> EMAIL: </Text>&nbsp;{order.customerEmail}
                  </Col>
                  <Col span={24}>
                    <Text strong> SỐ ĐIỆN THOẠI: </Text>&nbsp;{order.customerPhone}
                  </Col>
                  <Col span={24}>
                    <Text strong> ĐỊA CHỈ XUẤT HÀNG: </Text>&nbsp;{order.customerAddress}
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
                      id={"purchase-orders-table"}
                      columns={orderColumns}
                      dataSource={order.lineItems}
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
                      {amountFormatter(order.totalQuantity)} <br/>
                      {amountFormatter(order.shippingFee)} <br/>
                      {amountFormatter(order.subTotal)} <br/>
                      {amountFormatter(order.totalAmount)} <br/>
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
                  <Text>Còn phải trả: {amountFormatter(parseFloat(order.totalAmount - order.paidPrice))} đ</Text>
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
                <InputNumber style={{ width: '100%', marginTop: 8}} value={paidPrice} onChange={(value) => setPaidPrice(value)} min={0} max={order.totalAmount - order.paidPrice} step={1000} formatter={amountFormatter} parser={amountParser}/>
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
                <Text strong>Chính sách giá</Text>
              </Row><br/>
                <Text>{order.pricePolicy === 'retailPrice' ? 'Giá bán lẻ' : order.pricePolicy === 'wholeSalePrice' ? 'Giá bán buôn' : 'Giá nhập'}</Text>
            </div>
            <div className={"order-info padding"}>
              <Row gutter={1} style={{ marginTop: 8 }}>
                <Text strong>GHI CHÚ</Text>
              </Row>
                <Text>{order.note}</Text>
            </div>
          </Col>
        </Row>
      <Divider/>
      <Row gutter={8} justify={"space-between"}>
        <Col>
          <Popconfirm
            title={"Xác nhận hủy đơn hàng này ?"}
            onConfirm={handleCancelOrder}
          >
            <Button disabled={isOrderCanceled} type="danger">{isOrderCanceled ? 'Đã hủy' : 'Hủy đơn hàng'}</Button>
          </Popconfirm>     
        </Col>
        <Col>
          <Button onClick={() => history.push('/app/orders')} style={{ marginRight: 8}}>Quay lại</Button>
          {
            remainPrice > 0 && (
              <Button disabled={isOrderCanceled} onClick={handleShowPaymentModal} style={{ marginRight: 8 }}>Xác nhận thanh toán</Button>
            )
          }
          {
            !order.packStatus ? (
              <Popconfirm
                title={"Xác nhận đóng gói cho đơn hàng này ?"}
                onConfirm={handleCreatePackaging}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Đóng gói</Button>
              </Popconfirm>
            ) : !order.outstockStatus && (
              <Popconfirm
                title={"Xác nhận xuất kho cho đơn hàng này ?"}
                onConfirm={handleCreateReceipt}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Xuất kho</Button>
              </Popconfirm>
            )
          }
          {
            order.outstockStatus && !order.deliveryStatus && <Popconfirm
                title={"Xác nhận đã giao hàng cho đơn hàng này ?"}
                onConfirm={handleConfirmDelivery}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Xác nhận đã giao hàng</Button>
              </Popconfirm>
          }
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  order: state.order.toJS()
})

const mapDispatchToProps = dispatch => ({
  cancelOrderStart: (payload) => dispatch(OrderCreators.cancelOrderStart(payload)),
  confirmPaymentStart: (payload) => dispatch(OrderCreators.confirmOrderPaymentStart(payload)),
  confirmDeliveryStart: (payload) => dispatch(OrderCreators.confirmOrderDeliveryStart(payload)),
  createReceiptStart: (payload) => dispatch(OrderCreators.createOrderReceiptStart(payload)),
  createPackagingStart: (payload) => dispatch(OrderCreators.createOrderPackagingStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleOrderView)
