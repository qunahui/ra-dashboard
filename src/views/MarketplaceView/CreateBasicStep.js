import React, { useState, useEffect, useRef, useReducer, Fragment } from 'react'
import { request } from 'Config/axios'
import { Row, Col, Typography, Divider, Form, Input, InputNumber, Checkbox, Button, AutoComplete, Select, Tooltip } from 'antd'
import { amountFormatter, amountParser, moneyFormatter, moneyParser } from 'Utils/inputFormatter'
import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'
import { connect } from 'react-redux'
import './createBasicStep.styles.scss'

import toast from 'Components/Helpers/ShowToast'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'
import ImageUpload from 'Components/ImageUpload'
import TextEditor from 'Components/TextEditor'
import BrandSelect from 'Components/BrandSelect'

const { Text, Title } = Typography
const { Option } = Select

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 21,
    offset: 1
  },
};

const smallLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 19,
    offset: 1
  },
}

const smallNoOffsetLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export const CreateBasicStep = (props) => {
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useReducer(
    (state, newState) => ({ ...state, ...newState}),
    {
      productType: 'normal',
      name: 'Áo phông EAGLES',
      sku: 'test-sku',
      categoryName: '',
      categoryId: 0,
      sendoCategoryName: '',
      sendoCategoryId: 0,
      // brand: 'No Brand',
      brand: '',
      shortDescription: '',
      description: '',
      retailPrice: 100000, // gia ban le
      wholeSalePrice: 100000, // gia ban buon
      importPrice: 100000, //gia nhap
      specialPrice: 100000, //gia nhap
      weight: 100, //khoi luong
      width: 100, //khoi luong
      height: 100, //khoi luong
      length: 100, //khoi luong
      weightValue: 100, //khoi luong
      unit: 'Cái', // don vi tinh
      weightUnit: 'g', //don vi khoi luong
      fileList: [],
      avatar: [],
      isConfigInventory: true,
      quantity: 100,
      initPrice: 0,
      options: [],
      // variants: [{
      //   name: '',
      //   sku: '',
      //   inventories: [{
      //     initStock: 0,
      //     initPrice: 0,
      //   }],
      //   sellable: true,
      // }]
    }
  )

  //<------------------------------------------------------- category picker handler --------------------------------------------------------->
  const [requiredSaleProp, setRequiredSaleProp] = useState([])
  useEffect(() => {
    form.setFieldsValue({
      categoryName: 'Electronics Accessories > Phụ kiện máy ảnh chụp lấy ngay',
      categoryId: 11078
    })
  }, [])

  async function getSuggestCategory(name) {
    try {
      const result = await request.post(`/sendo/categories/suggest`, {
        name,
      })

      return result.data
    } catch(e) {
      console.log(e.message)
    }
  }

  const handleSelectCategory = async (selected) => {
    const { name, value } = selected
    let required = [];
    try {
      const response = await request.get(`/lazada/attributes/${value}`)
      if(response.code === 200) {
        required = response.data?.attributes
      }
    } catch(e) { 
      toast({ type: 'error', message: e.message })
    }

    let baseNameArr = name.split(' > ')
    let suggestCategory = await getSuggestCategory(baseNameArr[baseNameArr.length - 1])
    //set category state
    form.setFieldsValue({
      categoryId: value,
      categoryName: name,
      sendoCategoryName: suggestCategory?.namepath?.join('>'),
      sendoCategoryId: suggestCategory?.category_id,
      options: required.filter(i => i.is_variant_attribute === true).map(i => { 
        // let matchIndex = ['color_family', 'size'].findIndex(opt => opt === i.name)
        // let translate = matchIndex === -1 ? i.name : ['Nhóm màu', 'Kích thước'][matchIndex]
        return {
          optionName: i.attribute_name, 
          optionName_vi: i.name,
          optionValue: [], 
          options: i.option, 
          options_en: i.option_en,
          required: true 
        }
      })
    })

    //fetch required attrs
    
  }
  //<------------------------------------------------------- category picker handler --------------------------------------------------------->

  //<------------------------------------------------------- category picker handler --------------------------------------------------------->
  const handleImageChange = (files) => {
    form.setFieldsValue({ avatar: files.map(i => i.url) })
  }
  //<------------------------------------------------------- category picker handler --------------------------------------------------------->

  //<------------------------------------------------------- form handler --------------------------------------------------------->
  const handleFormSubmit = (values) => {
    // console.log(values)
    props.handleSubmit(values)
  }
  //<------------------------------------------------------- form handler --------------------------------------------------------->

  return (
    <Form
      {...layout} 
      form={form}
      colon={false}
      initialValues={formValues}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={handleFormSubmit}
    >
      <Row>
        <Col span={21} offset={1}>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Text strong>Thông tin cơ bản</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row className={'padding'} id={"name-section"}>
              <Form.Item 
                name={"name"} 
                label={"Tên sản phẩm"} 
                rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
                style={{ width: '100%'}}
                placeholder="Nhập vào tên sản phẩm"
              >
                <Input />
              </Form.Item>
            </Row>
            <Row className={'padding'} id={"category-section"}>
              <Form.Item
                name={"categoryName"}
                label={"Ngành hàng"}
                style={{ width: '100%'}}
                rules={[{ required: true, message: 'Trường ngành hàng là bắt buộc'}]}
              >
                <LazadaCategoryPicker 
                  handleSelect={handleSelectCategory}
                  renderState={{
                    name: form.getFieldValue('categoryName') || 'Electronics Accessories > Phụ kiện máy ảnh chụp lấy ngay',
                    value: form.getFieldValue('categoryId') || 11078
                    // name: formState.categoryName,
                    // value: formState.categoryId
                  }}
                />
              </Form.Item>
              <Form.Item name={"categoryId"} noStyle>
                  <Input type="text" type="hidden" />
              </Form.Item>
              <Form.Item name={"sendoCategoryName"} noStyle>
                  <Input type="text" type="hidden" />
              </Form.Item>
              <Form.Item name={"sendoCategoryId"} noStyle>
                  <Input type="text" type="hidden" />
              </Form.Item>
            </Row>
            <Row className={'padding'} id={"name-section"}>
              <Form.Item 
                name={"brand"} 
                label={"Thương hiệu"} 
                rules={[{ required: true, message: 'Trường thương hiệu là bắt buộc'}]}
                style={{ width: '100%'}}
                placeholder="Nhập vào tên thương hiệu"
              >
                <BrandSelect onChange={value => form.setFieldsValue({ brand: value})}/>
              </Form.Item>
            </Row>
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Text strong>Quản lý hình ảnh</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row className={'padding'} id={"image-section"}>
              <Form.Item 
                name={"avatar"}
                label={"Hình ảnh"}
                // rules={[{ required: true, message: 'Trường hình ảnh là bắt buộc' }]}
                style={{ width: '100%'}}
              >
                <ImageUpload 
                  type="normal"
                  handleChange={handleImageChange}
                  style={{ height: 100 }}
                >
                  <PlusOutlined />
                </ImageUpload>
              </Form.Item>
            </Row>
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Text strong>Giá và tồn kho</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row gutter={24} className={'padding'} style={{ width: '97%'}} id={"price-and-stock-section"}>
                <Col span={12}>
                  <Form.Item 
                    {...smallLayout}
                    name={"sku"} 
                    label={"Mã SKU"} 
                    rules={[{ required: true, message: 'Trường sku là bắt buộc'}]}
                    style={{ width: '100%'}}
                    placeholder="Nhập vào sku"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                    {...smallLayout}
                    name={"quantity"} 
                    label={"Tồn kho"} 
                    rules={[{ required: true, message: 'Trường tồn kho là bắt buộc'}]}
                    style={{ width: '100%'}}
                    placeholder="Nhập vào tồn kho"
                  >
                    <InputNumber formatter={amountFormatter} parser={amountParser} style={{ width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                      {...smallLayout}
                      name={"retailPrice"} 
                      label={"Giá gốc"} 
                      rules={[{ required: true, message: 'Trường giá gốc là bắt buộc'}]}
                      style={{ width: '100%'}}
                    >
                      <InputNumber formatter={moneyFormatter} parser={moneyParser} style={{ width: '100%'}} placeholder="Nhập vào giá gốc" />
                    </Form.Item>
                    <Form.Item 
                      {...smallLayout}
                      name={"specialPrice"} 
                      label={"Giá khuyến mãi"} 
                      style={{ width: '100%'}}
                    >
                      <InputNumber formatter={moneyFormatter} parser={moneyParser} style={{ width: '100%'}} placeholder="Nhập vào giá khuyến mãi"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row id={"config-variant-section"}>
              <Form.Item name="isConfigVariant" valuePropName="checked" initialValue={true} style={{ width: '100%'}}>
                <Checkbox>Sản phẩm có nhiều phiên bản</Checkbox>
              </Form.Item>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row id={"attribute-section"} gutter={[16, 16]} className={"padding"}>
              <Col span={24}>
                <Form.List name="options">
                  {(fields, { add, remove }, { errors }) => (
                    <Row align="middle" className={'padding'} style={{ marginBottom: 5 }} gutter={[16, 16]}>
                      <Col span={8} style={{ marginLeft: 16 }}>
                        <Text strong>Nhóm thuộc tính</Text>
                      </Col>
                      <Col span={15}>
                        <Text strong>Giá trị thuộc tính</Text>
                      </Col>
                        {
                          fields.map((field, index) => (
                            <Fragment key={`option_${index}`}>
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  key={field.fieldKey}
                                  name={[field.name, 'optionName_vi']}
                                  fieldKey={[field.fieldKey, 'optionName_vi']}
                                  noStyle
                                  style={{ marginBottom: 0}}
                                >
                                  <AutoComplete
                                    size={"large"}
                                    disabled={!!form.getFieldValue('options')[index]?.required}
                                    style={{ width: '100%'}}
                                    placeholder="Nhập thuộc tính tùy chọn khác, ví dụ: chất liệu,....."
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={15}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'optionValue']}
                                  fieldKey={[field.fieldKey, 'optionValue']}
                                  noStyle
                                  style={{ marginBottom: 0}}
                                >
                                  {console.log(form.getFieldValue('options')[index])}
                                  <Select
                                    options={form.getFieldValue('options')[index]?.required && form.getFieldValue('options')[index].options?.map(i => ({ label: i, value: i }))}
                                    size="large" 
                                    mode="tags"  
                                    style={{ width: '100%' }} 
                                    placeholder="Gõ ký tự và nhấn Enter để thêm giá trị" 
                                  >
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={1}>
                              {
                                !form.getFieldValue('options')[index]?.required ? (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name, index)}
                                    style={{ color: red[5] }}
                                  />
                                ) : <Tooltip title="Thuộc tính này là bắt buộc đối với ngành hàng đã chọn">
                                  <InfoCircleOutlined />
                                </Tooltip>
                              }
                              </Col>
                            </Fragment>
                          ))
                        }
                      <Col span={1}>
                        <Button onClick={() => add()}>Thêm thuộc tính khác</Button>
                      </Col>
                    </Row>
                    )}
                </Form.List>  
              </Col>
            </Row>
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={"padding"}>
              <Text strong>Mô tả sản phẩm</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row className={"padding"}>
              <Form.Item
                {...smallLayout}
                name={"shortDescription"} 
                label={<div style={{ whiteSpace: 'pre-wrap', height: '100%', textAlignLast:'left' }}>Mô tả ngắn gọn của sản phẩm (độ dài nên ít hơn 100 ký tự)</div>} 
                rules={[{ required: true, message: 'Trường mô tả ngắn gọn là bắt buộc'}]}
                style={{ width: '100%', height: 50 }}
                placeholder="Nhập vào tên sản phẩm"
              >
                <Input placeholder={'Mô tả ngắn gọn cho sản phẩm.....'}/>
              </Form.Item>
              <Form.Item
                {...smallLayout}
                name={"description"} 
                label={<div style={{ whiteSpace: 'pre-wrap', height: '100%', textAlignLast:'left' }}>Mô tả chi tiết của sản phẩm (độ dài nên dài hơn 100 ký tự)</div>} 
                rules={[{ required: true, message: 'Trường mô tả là bắt buộc'}]}
                style={{ width: '100%', height: '100%' }}
                placeholder="Nhập vào tên sản phẩm"
              >
                <TextEditor
                  initialValue={'initialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValueinitialValue'}
                  handleChange={(value) => form.setFieldsValue({ description: value })}/>
              </Form.Item>
            </Row>
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Text strong>Thông tin đóng gói</Text>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row className={'padding'} gutter={16}>
              <Form.Item 
                {...smallLayout}
                name={"weight"} 
                label={<div style={{ whiteSpace: 'pre-wrap', height: '100%', textAlignLast:'left', display: 'grid', placeItems: 'center' }}>Cân nặng (sau khi đóng gói)</div>} 
                rules={[{ required: true, message: 'Trường cân nặng là bắt buộc'}]}
                style={{ width: '100%', height: 48}}
                placeholder="Nhập vào tên sản phẩm"
              >
                <Input suffix={"gram"}/>
              </Form.Item>  
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14, offset: 4 }}
                  name={"width"} 
                  label={<div style={{ whiteSpace: 'pre-wrap', height: '100%', textAlignLast:'left' }}>Kích thước đóng gói</div>} 
                  rules={[{ required: true, message: 'Trường chiều rộng là bắt buộc'}]}
                  style={{ width: '100%', height: 48 }}
                >
                  <Input placeholder={"Rộng"} suffix={"cm"}/>
                </Form.Item> 
              </Col>
              <Col span={6}>
                <Form.Item
                  name={"length"} 
                  rules={[{ required: true, message: 'Trường chiều dài là bắt buộc' }]}
                  style={{ width: '100%', height: 48 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder={"Dài"} suffix={"cm"}/>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={"height"} 
                  rules={[{ required: true, message: 'Trường chiều cao là bắt buộc' }]}
                  style={{ width: '100%', height: 48 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder={"Cao"} suffix={"cm"}/>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row gutter={8} justify="end" style={{ width: '100%'}}>
        <Col><Button type={"primary"} htmlType={"submit"}>Chọn sàn và đăng bán</Button></Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBasicStep)
