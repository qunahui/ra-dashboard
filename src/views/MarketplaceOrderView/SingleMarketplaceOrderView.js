import React, { useState, useEffect, } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { request } from 'Config/axios'
import { Row, Col, Form, Popover, Typography, Steps, Tag, Input, InputNumber, Divider, Table, Button, Modal, Popconfirm } from 'antd'
import { ArrowLeftOutlined, UserOutlined, ShopOutlined, CreditCardFilled } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
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
      width: 100,
      render: (value, record) => {
        return <Popover placement={"rightTop"} content={<img src={value} style={{ height: 150 }}/>}>
          <img src={value} style={{ height: 50, cursor: 'pointer' }}/>
        </Popover>
      }
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
      case 'Sẵn sàng giao hàng':
        color = 'cyan'
        break
      case 'Đang chờ xác nhận thanh toán': 
        color = 'geekblue'
        break
      case 'Đã giao hàng': 
        color = 'purple'
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

    console.log(color)

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
  
  //<---------------------------------------------- print bill handler ------------------------------------->
  const [bill, setBill] = useState('')
  const [showBill, setShowBill] = useState(false)
  const handlePrintBill = async () => {
    try { 
      if(order.source === 'sendo') {
        const response = await request.post('/orders/print-bill', order)
        if(response.code === 200) {
          setBill(response.data.bill)
          var pri = document.getElementById("ifmcontentstoprint").contentWindow;
          pri.document.open();
          pri.document.write(response.data.bill);
          pri.document.close();
          pri.focus();
          pri.print();
          setShowBill(true)
        }
      }
    } catch(e) {
      console.log(e.message)
      toast({ type: 'error', message: 'In vận đơn thất bại. Vui lòng thử lại sau!'})
    }
  }

  //converts base64 to blob type for windows
  function pdfBlobConversion(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];

    for ( var offset = 0; offset < byteCharacters.length; offset = offset + sliceSize ) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  //<---------------------------------------------- print bill handler ------------------------------------->

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

  //<---------------------------------------------- confirm order handler ------------------------------------->
  const handleConfirmOrder = () => {
    props.confirmPlatformOrderStart(order)
  }
  //<---------------------------------------------- confirm order handler ------------------------------------->

  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={() => {}}
    >
      <Row gutter={[0, 16]} style={{ marginBottom: 16 }} justify={"space-between"}>
        <Col span={24}>
          <Steps size={"small"} className="custom-step" current={currentStep} type={'default'} progressDot>
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
        </Col>
        <Col span={8}>
          {/* <Row>
            <Link to={(() => { 
              let back = window.location.pathname.split('/')
              back.pop()
              return back.join('/')
             })()}>
              <Title level={5} style={{ color: blue[5] }}><ArrowLeftOutlined/> Quay lại danh sách đơn hàng</Title>
            </Link>
          </Row> */}
          <Title level={2}>Mã đơn hàng: #{order.code}</Title>
          <Text strong>Ngày đặt hàng: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text> <br/>
          <Text strong>Hạn duyệt đơn hàng: { order?.createdAt && new Date(new Date(order.createdAt).setHours(new Date(order.createdAt).getHours() + (order.source === 'sendo' ? 48 : 72) )).toLocaleString('vi-VN') }</Text>
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
                      <Text>Mã giảm giá (sàn + NBH)</Text> <br/>
                      <Text strong>Tổng tiền khách cần trả</Text> <br/>
                      <Text strong>Tổng tiền nhận được (sau khi trừ phí sàn)</Text> <br/>
                    </Col>
                    <Col>
                      {amountFormatter(order.totalQuantity)} <br/>
                      {amountFormatter(order.shippingFee)} <br/>
                      {amountFormatter(order.subTotal)} <br/>
                      {amountFormatter(order.shippingVoucher + order.orderVoucher)} <br/>
                      {amountFormatter(order.totalPrice)} <br/>
                      {amountFormatter(order.totalAmount)} <br/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className={"order-info"}>
              <Row justify={"space-between"} gutter={16} style={{ marginTop: 5, padding: '8px 24px'}}>
                <Text strong style={{ marginBottom: 15 }}><CreditCardFilled/> Thanh toán</Text>
                {
                  !order.source === 'sendo' && remainPrice > 0 && <Button onClick={handleShowPaymentModal}>Xác nhận đã chuyển tiền</Button>
                }
              </Row>
              <Row className={"padding"}>
                <Col span={12}>
                  <Text>Sàn đã thanh toán: {amountFormatter(order.paidPrice)} đ</Text>
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
                title={`Xác nhận đã chuyển tiền cho đơn: ${order.code}`}
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
      <Row gutter={8} justify={"end"}>
        {/* <Col>
          <Popconfirm
            title={"Xác nhận hủy đơn hàng này ?"}
            onConfirm={handleCancelOrder}
          >
            <Button disabled={isOrderCanceled} type="danger">{isOrderCanceled ? 'Đã hủy' : 'Hủy đơn hàng'}</Button>
          </Popconfirm>     
        </Col> */}
        <Col>
          <Button onClick={() => history.push('/app/market_place/orders')} style={{ marginRight: 8}}>Quay lại</Button>
          {
            remainPrice > 0 && (
              <Button disabled={isOrderCanceled} onClick={handleShowPaymentModal} style={{ marginRight: 8 }}>Xác nhận đã chuyển tiền</Button>
            )
          }
          {
            !order.packStatus && order.orderStatus === 'Duyệt' ? (
              <Popconfirm
                title={"Xác nhận đóng gói cho đơn hàng này ?"}
                onConfirm={handleCreatePackaging}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Đóng gói</Button>
              </Popconfirm>
            ) : !order.outstockStatus && !order.source === 'sendo' && (
              <Popconfirm
                title={"Xác nhận xuất kho cho đơn hàng này ?"}
                onConfirm={handleCreateReceipt}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Xuất kho</Button>
              </Popconfirm>
            )
          }
          {
            !!order.trackingNumber && (
              <Button onClick={handlePrintBill} style={{ marginRight: 8 }}>In vận đơn</Button>
            )
          }
          {
            order.orderStatus === 'Đặt hàng' && (
              <Popconfirm
                title={"Xác nhận duyệt đơn hàng này ?"}
                onConfirm={handleConfirmOrder}
              >
               <Button style={{ marginRight: 8 }} type={'primary'}>Duyệt</Button>
              </Popconfirm>
            )
          }
          {/* {
            order.outstockStatus && !order.deliveryStatus && <Popconfirm
                title={"Xác nhận đã giao hàng cho đơn hàng này ?"}
                onConfirm={handleConfirmDelivery}
              >
                <Button disabled={isOrderCanceled} type="primary" loading={props.order.isWorking} style={{ marginRight: 8 }}>Xác nhận đã giao hàng</Button>
              </Popconfirm>
          } */}
          <iframe id="ifmcontentstoprint" style={{ margin: 0, padding: 0, height: 0, width: 0, position: 'absolute' }}></iframe>
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
  confirmPlatformOrderStart: (payload) => dispatch(OrderCreators.confirmPlatformOrderStart(payload)),
  createReceiptStart: (payload) => dispatch(OrderCreators.createOrderReceiptStart(payload)),
  createPackagingStart: (payload) => dispatch(OrderCreators.createOrderPackagingStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleOrderView)
