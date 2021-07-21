import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import toast from 'Helpers/ShowToast'
import { request } from 'Config/axios'
import { Link, useHistory } from 'react-router-dom'
import Creators from 'Redux/product'

import { Row, Col, Form, Image, Menu, Select, AutoComplete, InputNumber, Divider, Input, Typography, Checkbox, Collapse, Button, Upload, Modal, Tag, Table } from 'antd'
import { blue } from '@ant-design/colors'
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './SingleVariant.styles.scss'
import { amountFormatter, amountParser, moneyFormatter, moneyParser } from 'Utils/inputFormatter'

import { InfoCircleTwoTone } from '@ant-design/icons'

import TextEditor from 'Components/TextEditor'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'
import ImageUpload from 'Components/ImageUpload'
import clsx from 'clsx'

const { Title, Text } = Typography 
const { Option } = Select

export const SingleVariant = (props) => {
  const [product, setProduct] = useState({})
  const [inventoryList, setInventoryList] = useState([])
  const [variant, setVariant] = useState({})
  const [form] = Form.useForm()

  async function fetchInventory() {
    try {
      let id = props.match.params.variantId;
      const response = await request.get(`/inventory/${id}`)

      if(response.code === 200) {
        setInventoryList(response.data.reverse().map(inv => ({ ...inv, key: inv._id})))
      }

      console.log(response)
    } catch(e) {
      toast({ type: 'error', message: 'Lấy thông tin tồn kho thất bại !'})
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [variant])
  
  useEffect(() => {
    try { 
      let id = props.match.params.id;
      let variantId = props.match.params.variantId;
      async function fetchProduct() {
        const response = await request.get(`/products/${id}`)
        if(response.code === 200) {
          const product = response.data
          product.fileList = product?.avatar.map(i => { 
            let arr = i.split('/')
            let name = arr[arr.length - 1].split('?')[0]
            return {
              url: i,
              thumbUrl: i,
              uid: name,
              name,
              status: 'done', 
            }
          })
      
          const currentVariant = product.variants.find(i => i._id === variantId)

          form.setFieldsValue({
            ...currentVariant,
          })

          setProduct(product)
          setVariant(currentVariant)
        } 
      }

      fetchProduct()
    } catch(e) { 
      toast({ type: 'error', message: 'Có gì đó sai sai !'})
    }
  }, [])


  useEffect(() => {
    let variantId = props.match.params.variantId;
    if(variantId !== variant._id) {
      if(product && product.variants?.length > 0) {
        const currentVariant = product.variants.find(i => i._id === variantId)
        setVariant(currentVariant)
        form.setFieldsValue({
          ...currentVariant
        })
      } 
    }
  }, [props.location.pathname])

  //<-------------------------------------------- history handler ------------------------------------->
  const history = useHistory();
  //<-------------------------------------------- history handler ------------------------------------->
  
  //<-------------------------------------------- image handler ------------------------------------->
  const uploadRef = useRef(null)
  const [newAvatar, setNewAvatar] = useState('')
  const [isNewAvatarUploaded, setIsNewAvatarUploaded] = useState(false)

  const handleImageChange = (file) => {
    setIsNewAvatarUploaded(true)
    setNewAvatar(file[0].url)
  }

  const handleSetNewAvatar = () => {
    if(newAvatar) {
      // uploadRef.current.src = newAvatar
      setVariant({
        ...variant, 
        newAvatar
      })
    }
    
  }

  const handleUndoSetAvatar = () => {
    delete variant.newAvatar
    setVariant({...variant})
    // uploadRef.current.src = oldAvatar
  }
  //<-------------------------------------------- image handler ------------------------------------->

  //<------------------------------------------ remove product handler ----------------------------------------->
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const handleDeleteVariant = () => {
    props.deleteVariantStart(variant)
  }
  //<------------------------------------------ remove product handler ----------------------------------------->

  //<-------------------------------------------- inventory table handler ------------------------------------->
  const inventoryColumns = [
    {
      title: 'Ngày ghi nhận',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => <Text>{new Date(value).toLocaleString('vi-VN')}</Text>
    },
    {
      title: 'Thao tác',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: 'Số lượng thay đổi',
      dataIndex: 'change',
      key: 'change',
      render: (value) => {
        let prefix = '+'
        if(value.type === 'Giảm') {
          prefix = '-'
        }

        return <Text>{prefix}{value.amount}</Text>
      }
    },
    {
      title: 'Tồn kho',
      dataIndex: 'instock',
      key: 'instock',
    },
    {
      title: 'Mã chứng từ',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'department',
      key: 'department'
    },
  ]
  //<-------------------------------------------- inventory table handler ------------------------------------->
  
  //<-------------------------------------------- form handler ------------------------------------->
  const handleFormSubmit = (values) => {
    const updatedVariant = {
      ...variant,
      ...values,
    }

    if(updatedVariant.newAvatar) {
      updatedVariant.avatar = newAvatar
      delete updatedVariant.newAvatar
    }

    product.variants = product.variants.map(i => {
      if(i._id === variant._id) {
        return updatedVariant
      } 
      return i;
    })
    delete updatedVariant.__v
    console.log("updated: ", updatedVariant)

    props.updateVariantStart(updatedVariant)
  }
  //<-------------------------------------------- form handler ------------------------------------->


  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={handleFormSubmit}
    >
      <Row gutter={[0, 16]} style={{ marginBottom: 16 }}>
        <Link to={`/app/product/${product._id}`}>
          <Text strong><ArrowLeftOutlined/> {product.name}</Text>
        </Link>
      </Row>
      <Row>
        <Title level={3}>{variant.name}</Title>
      </Row>
      <Row gutter={36} id="Basic variant infos">
        <Col span={8}>
          <Row gutter={16} className={'variant-avatar'}>
            <Col>
              <img 
                src={(variant.newAvatar ? variant.newAvatar : variant.avatar) || "data:image/png;base64,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"} 
                ref={uploadRef}
                style={{
                  width: 120,
                  height: 120
                }}
              />
            </Col>
            <Col>
              <Text strong>{product.name}</Text> <br/>
              <Text>{product.variants?.length} phiên bản</Text> <br/>
              {/* <Link to={`/app/product/${product._id}`}><Typography.Link>Trở lại sản phẩm</Typography.Link></Link> */}
            </Col>
          </Row>
          <Row gutter={16} className={"variant-picker"}>
            <div className={"variant-picker-header"}>
                <Text strong>Phiên bản</Text>
            </div>
            {
              product.variants?.length > 0 && product.variants.map(i => (
                <div 
                  className={clsx("variant", (i._id === variant._id && "chosen-variant"))}
                  onClick={() => {
                    history.push(`/app/product/${product._id}/variant/${i._id}`)
                  }}
                  key={i._id}
                >
                  <img 
                    src={i.avatar || "data:image/png;base64,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"} 
                    style={{ width: 30, height: 30, marginRight: 10}}
                  /> {i.name}
                </div>
              ))
            }
          </Row>
         </Col>
        <Col span={16}>
          <div className={"variant-info"}>
            <div style={{ marginBottom: 16}}>
              <Text strong>Phiên bản sản phẩm</Text>
            </div>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item 
                  name={"name"} 
                  initialValue={"Áo phông EAGLES"} 
                  label={<p className="variant-info__item--text">Tên sản phẩm</p>} 
                  className={"variant-info__item"}
                  rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
                >
                  <Input placeholder="Nhập vào tên sản phẩm"/>
                </Form.Item>
                <Form.List name="options">
                  {
                    (fields) => (
                      <>
                        {
                          fields.map((field, index) => (
                              <Form.Item
                                {...field}
                                key={field.fieldKey}
                                name={[field.name, 'optionValue']}
                                fieldKey={[field.fieldKey, 'optionValue']}
                                label={variant.options && variant.options[index].optionName}
                                // rules={[{ required: true, message: 'Missing  name' }]}
                              >
                                <Input/>
                              </Form.Item>
                            )
                          )
                        }
                      </>
                    )
                  }
                </Form.List>
              </Col>
              <Col span={8} style={{ height: 200 }}>
                <ImageUpload 
                  type="drag"
                  handleChange={handleImageChange}
                  maxCount={1}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Thả tập tin ảnh để cập nhật ảnh của phiên bản này</p>
                </ImageUpload>
                {
                  isNewAvatarUploaded &&
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="primary" onClick={handleSetNewAvatar}>Sử dụng</Button>
                    <Button onClick={handleUndoSetAvatar}>Hoàn tác</Button>
                  </div>
                }
              </Col>
            </Row>
          </div>
          <div className={"variant-info"}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name={"sku"} 
                  label={<p className="variant-info__item--text">Mã SKU</p>} 
                  className={"variant-info__item"}
                  // rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
                >
                  <Input placeholder="Nhập vào mã SKU"/>
                </Form.Item>
                <Form.Item 
                  name={"weightValue"} 
                  label={<p className="variant-info__item--text">Khối lượng</p>} 
                  className={"variant-info__item"}
                  // rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
                >
                  <InputNumber style={{ width: '100%'}}
                    placeholder="Nhập vào khối lượng"
                    formatter={amountFormatter}
                    parser={amountParser}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name={"weightUnit"} 
                  label={<p className="variant-info__item--text">Đơn vị tính</p>} 
                  className={"variant-info__item"}
                  // rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
                >
                  <Select>
                    <Option value="g">g</Option>
                    <Option value="kg">kg</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={"variant-info"}>
            <Title level={5}>Giá sản phẩm</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="retailPrice" label={"Giá bán lẻ"}>
                  <InputNumber style={{ width: '100%'}}
                    formatter={moneyFormatter}
                    parser={moneyParser}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="wholeSalePrice" label={"Giá bán buôn"}>
                  <InputNumber style={{ width: '100%'}}
                    formatter={moneyFormatter}
                    parser={moneyParser}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col span={12}>
                <Form.Item name="importPrice" label={"Giá nhập"}>
                  <InputNumber style={{ width: '100%'}}
                    formatter={moneyFormatter}
                    parser={moneyParser}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Form.Item name="sellable" valuePropName="checked" initialValue={true}>
                <Checkbox>Cho phép bán</Checkbox>
              </Form.Item>
            </Row>
          </div>
         </Col>
      </Row>
      <Divider/>
      <div className={"variant-info no-padding"}>
        <Row>
          <Col span={24}>
            <Row className={"padding"}>
              <Text strong>Tồn kho</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
          </Col>
        </Row>
        <Row gutter={6} className={"padding"}>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Kho hàng</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Tồn kho</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Có thể bán</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Hàng đang về</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Hàng đang giao</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text strong>Đang giao dịch</Text></Col>
        </Row>
        <Row gutter={6} className={"padding"}>
          <Col span={4} style={{ textAlign: 'center'}}><Text>Chi nhánh mặc định</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text>{variant?.inventories?.onHand}</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text>{variant?.inventories?.available}</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text>{variant?.inventories?.incoming}</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text>{variant?.inventories?.onway}</Text></Col>
          <Col span={4} style={{ textAlign: 'center'}}><Text>{variant?.inventories?.trading}</Text></Col>
        </Row>
      </div>
      <Divider/>
      <div className={"variant-info"}>
        <Row id="Inventory history">
          <Col span={24}>
              <Row>
                <Text strong>Lịch sử kho</Text>
              </Row>
              <Row style={{ padding: 8 }}>
                <Text>Chi nhánh: </Text> &nbsp;&nbsp;
                <Select defaultValue={"default"}>
                  <Option value={"default"}>Chi nhánh mặc định</Option>
                </Select>
              </Row>
          </Col>
          <Col span={24}>
            <Table
              id="inventory-history-table"
              dataSource={inventoryList}
              columns={inventoryColumns}
            />
          </Col>
        </Row>
      </div>
      <Row id="create product footer" justify="space-between">
        <Col>
          <Button type="danger" onClick={() => setShowRemoveModal(true)}>Xóa phiên bản</Button>
          <Modal 
            title={(
              <span style={{ fontSize: 18 }}>
                <InfoCircleTwoTone twoToneColor={"#faad14"}/> &nbsp;
                <Text>Xác nhận xóa</Text>
              </span>
            )}
            visible={showRemoveModal}
            onOk={handleDeleteVariant}
            onCancel={() => setShowRemoveModal(false)}
          >
            Bạn có chắc chắn muốn xóa phiên bản: <Text strong>{variant.name}</Text>
          </Modal>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = dispatch => ({
  updateVariantStart: (payload) => dispatch(Creators.updateVariantStart(payload)),
  deleteVariantStart: (payload) => dispatch(Creators.deleteVariantStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleVariant)
