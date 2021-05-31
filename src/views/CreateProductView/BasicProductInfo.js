import React, { useEffect, useState, useRef, useReducer } from 'react'
import { connect } from 'react-redux'
import firebase from '../../utils/firebase'

import { Row, Col, Form, Select, AutoComplete, InputNumber, Divider, Input, Typography, Checkbox, Collapse, Button, Upload, Modal, Tag,  } from 'antd'
import { blue } from '@ant-design/colors'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'
import TextEditor from 'Components/TextEditor'
import { request } from 'Config/axios'

const { Title, Text, Link } = Typography
const { Panel } = Collapse
const { Option } = Select

const moneyFormatter = value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const moneyParser = value => value.replace(/\$\s?|(,*)/g, '').replace(/[^0-9.]/g, "")
const amountFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const amountParser = value => value.replace(/\$\s?|(,*)/g, '').replace(/[^0-9.]/g, "")

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const BasicProductInfo = (props) => {
  const { initialFormValues } = props
  const [form] = Form.useForm()
  //<--------------------------------------description handler----------------------------------------->
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState('')

  const handleTextEditorChange = (value) => {
    setDescription(value)
  }

  //<--------------------------------------description handler----------------------------------------->
  
  //<--------------------------------------sku handler----------------------------------------->
  const handleCheckSku = async () => {
    const sku = form.getFieldValue('sku')
    if(sku.length > 0) {
      const result = await request.get('/products/check-sku', {
        params: {
          sku
        }
      })
      if(result.code === 200) {
        alert(JSON.stringify(result.data))
      }
    }
  }
  //<--------------------------------------sku handler----------------------------------------->

  
  //<-------------------------------------------image handler----------------------------------------->

  const [uploaderState, setUploaderState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: initialFormValues.fileList || [],
      imageUrlList: initialFormValues.avatar || [],
    }
  )

  const { previewVisible, previewImage, fileList, imageUrlList, previewTitle } = uploaderState;

  const handleImagePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploaderState({
      ...uploaderState,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleImageCancel = () => setUploaderState({ previewVisible: false });

  const handleImageChange = ({ file, fileList }) => {
    setUploaderState({ fileList: fileList.map(i => ({ ...i, url: i.xhr?.url }))})
  };

  const handleImageRemove = (file) => {
    const removeIndex = fileList.findIndex(i => i.name === file.name);
    const removedArr = fileList.splice(removeIndex, 1)
    setUploaderState({ 
      fileList: fileList.filter(item => !removedArr.includes(item)),
    })
  }

  const handleImageUpload = async ({ onSuccess, file, onError }) => {
    const storage = firebase.storage()
    const metadata = {
      contentType: 'image/jpeg'
    }

    const storageRef = storage.ref()
    const imgFile = storageRef.child(`${props.auth.user._id}/${Date.now() + '_' + file.name}`);
    try {
      let imageUrl = '';
      const image = await imgFile.put(file, metadata);
      await imgFile.getDownloadURL().then(url => {
        imageUrl = url
      })
      onSuccess(null, {...image, url: imageUrl});
    } catch(e) {
      onError(e);
    }
  }

  // useEffect(() => {
  //   console.log("uploader changed: ", uploaderState)
  // }, [uploaderState])

  //<----------------------------------------image handler-------------------------------------->
  
  //<----------------------------------------table inventory handler----------------------------------->
  const [showInventory, setShowInventory] = React.useState(initialFormValues.isConfigInventory)

  const handleAutoSetInitPrice = () => {
    const importPrice = form.getFieldValue('importPrice')
    if(!!importPrice && importPrice > 0) {
      form.setFieldsValue({
        initPrice: importPrice
      })
    }
  }
  //<----------------------------------------table inventory handler---------------------------------->
 
  //<----------------------------------------table options handler----------------------------------->
  const [showOptions, setShowOptions] = React.useState(true)
  const [optionState, setOptionState] = React.useState([])

  const handleAddNewOption = (add) =>  {
    setOptionState([...optionState, {
      name: '',
      tags: [],
      value: '',
    }])

    add()
  }
  //<----------------------------------------table options handler---------------------------------->

  //<----------------------------------------categorySelected handler---------------------------------->
  const [categorySelected, setCategorySelected] = useState({
    name: initialFormValues.categoryName,
    value: initialFormValues.categoryId
  })

  const handleSelectCategory = (selected) => {
    const { name, value } = selected
    setCategorySelected({ name, value })
    form.setFieldsValue({
      categoryId: value,
      categoryName: name
    })
  }
  //<----------------------------------------categorySelected handler---------------------------------->
 
  //<----------------------------------------form handler---------------------------------->
  const handleFormSubmit = (values) => {

    const formValues = {
      ...initialFormValues,
      ...values,
      isConfigInventory: showInventory,
      categoryName: categorySelected.name,
      categoryId: categorySelected.value,
      avatar: fileList.map(i => i.url),
      fileList: fileList,
      description
    }

    props.handleSubmit(formValues)
  }
  //<----------------------------------------form handler---------------------------------->

  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={handleFormSubmit}
    >
      <Row gutter={16} id="Basic-product-infos">
        <Col span={16}>
          <div className={"product-info"}>
            <Form.Item 
              name={"name"} 
              initialValue={"Áo phông EAGLES"} 
              label={<p className="product-info__item--text">Tên sản phẩm</p>} 
              className={"product-info__item"}
              rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
            >
              <Input placeholder="Nhập vào tên sản phẩm"/>
            </Form.Item>
            <Form.Item 
              name={"sku"} 
              initialValue={"aophong"} 
              label={<p className="product-info__item--text">Mã sản phẩm / SKU</p>} 
              className={"product-info__item"}
              rules={[{ required: true, message: 'Trường sku là bắt buộc'}]}
            >
              <Input 
                placeholder="Nhập vào mã sản phẩm"
                onBlur={handleCheckSku}
              />
            </Form.Item>
            <Row gutter={16} className={"product-info__item"}>
              <Col span={12}>
                <Row>
                  <Col span={20}>  
                    <Form.Item name="weightValue" initialValue={100} label={<p className={"product-info__item--text"}>Khối lượng</p>}>
                      <InputNumber style={{ width: '100%'}}
                        formatter={amountFormatter}
                        parser={amountParser}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="weightUnit" initialValue={"g"} label={<p className={"product-info__item--text"}></p>}>
                      <Select style={{ border: 'none' }} id="weight-unit-selector">
                        <Option key="g" value="g">g</Option>
                        <Option key="kg" value="kg">kg</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Form.Item name="unit" initialValue={"Cái"} label={<p className={"product-info__item--text"}>Đơn vị tính</p>}>
                  <Input placeholder="Nhập vào đơn vị tính"/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p style={{ cursor: 'pointer', color: blue[4] }} onClick={(e) => { e.preventDefault(); setShowDescription(!showDescription)}}>{ showDescription ? 'Ẩn mô tả chi tiết' : 'Thêm mô tả chi tiết'}</p>
              </Col>
              {
                showDescription && <>
                  <Col span={24}>
                    <Form.Item 
                      name="shortDescription" 
                      initialValue={''}
                      rules={[{ max: 100,  message: 'Mô tả ngắn gọn tối đa 80 ký tự' }]}
                    >
                      <Input placeholder={'Mô tả ngắn gọn cho sản phẩm, bao gồm các thông tin nổi bật nhất.....'}/>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <TextEditor placeholder={"Mô tả chi tiết cho sản phẩm....."} handleChange={handleTextEditorChange}/>
                  </Col>
                </>
              }
            </Row>
          </div>
          <div className={"product-info"}>
            <Title level={5}>Giá sản phẩm</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="retailPrice" initialValue={150000} label={"Giá bán lẻ"}>
                  <InputNumber style={{ width: '100%'}}
                    formatter={moneyFormatter}
                    parser={moneyParser}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="wholeSalePrice" initialValue={150000} label={"Giá bán buôn"}>
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
                <Form.Item name="importPrice" initialValue={150000} label={"Giá nhập"}>
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
          <div className={"product-info"}>
            <Row justify={"space-between"}>
              <Col>
                <Title level={5}>Kho hàng</Title>
                <Typography>Ghi nhận số lượng <strong>Tồn kho ban đầu</strong> và <strong>Giá vốn</strong> của sản phẩm tại các <strong>Chi nhánh.</strong></Typography>
              </Col>
              <Col>
                <Checkbox defaultChecked={showInventory} onChange={(e) => {setShowInventory(e.target.checked)}}>Khởi tạo kho hàng</Checkbox>
              </Col>
            </Row>
            <Collapse
                bordered={false}
                className="site-collapse-custom-collapse"
                accordion={true}
                activeKey={showInventory && 'table-inventory'}
                ghost
                // collapsible="disabled"
            >
              <Panel key={"table-inventory"} showArrow={false} style={{ width: '100%'}}>
                <Row align="middle">
                  <Col span={8}>
                    <Text strong>Chi nhánh</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>Tồn kho ban đầu</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>Giá vốn</Text>
                  </Col>
                </Row>
                <Divider/>
                <Row align="middle" gutter={16}>
                  <Col span={8}>
                    <Text>Chi nhánh mặc định</Text>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={"initStock"} initialValue={initialFormValues.initStock}>
                      <InputNumber
                        formatter={amountFormatter}
                        parser={amountParser}
                        style={{ width: '100%'}}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={"initPrice"} initialValue={initialFormValues.initPrice}>
                      <InputNumber
                        formatter={moneyFormatter}
                        parser={moneyParser}
                        style={{ width: '100%'}}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} offset={8}>
                      <Form.Item name="isStockDivided" initialValue={true}>
                        <Select style={{ width: '100%'}}>
                          <Option key={'apply-all-stock'} value={false}>Áp dụng tồn cho tất cả biến thể</Option>
                          <Option key={'divide-all-stock'} value={true}>Chia đều tồn cho tất cả biến thể</Option>
                        </Select>
                      </Form.Item>
                  </Col>
                </Row>
                <Divider/>
                <Row justify="end">
                  <Col>
                    <Button onClick={handleAutoSetInitPrice}>Tự động điền Giá vốn = Giá nhập</Button>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </div>
          <div className={"product-info"}>
            <Row justify={"space-between"}>
              <Col>
                <Title level={5}>Thuộc tính</Title>
                <Typography>Thêm mới thuộc tính giúp sản phẩm có nhiều lựa chọn, như kích cỡ hay màu sắc.</Typography>
              </Col>
              <Col>
                <Checkbox defaultChecked={showOptions} onChange={(e) => setShowOptions(e.target.checked)}>Sản phẩm có nhiều phiên bản</Checkbox>
              </Col>
            </Row>
            <Collapse
                bordered={false}
                className="site-collapse-custom-collapse"
                accordion={true}
                activeKey={showOptions && "table-options"}
                ghost
                // collapsible="disabled"
            >
              <Panel key={"table-options"} showArrow={false} style={{ width: '100%'}}>
                <Row align="middle">
                  <Col span={8}>
                    <Text strong>Tên thuộc tính</Text>
                  </Col>
                  <Col span={16}>
                    <Text strong>Giá trị</Text>
                  </Col>
                </Row>
                <Divider/>
                <>
                  <Form.List initialValue={initialFormValues.options} name="options">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                          {
                            fields.map((field, index) => (
                              <Row align="middle" gutter={[24, 16]} style={{marginBottom: 5}} key={`option_${index}`}>
                                <Col span={8}>
                                  <Form.Item
                                    {...field}
                                    key={field.fieldKey}
                                    name={[field.name, 'optionName']}
                                    fieldKey={[field.fieldKey, 'optionName']}
                                    style={{ marginBottom: 0}}
                                    // rules={[{ required: true, message: 'Missing  name' }]}
                                  >
                                    <AutoComplete
                                      size={"large"}
                                      placeholder="Kích thước, màu sắc, chất liệu,....."
                                      options={[{ 
                                        value: 'Kích thước' 
                                      }, { 
                                        value: 'Màu sắc'
                                      }, {
                                        value: 'Chất liệu'
                                      }
                                      ]}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={15}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'optionValue']}
                                      fieldKey={[field.fieldKey, 'optionValue']}
                                      style={{ marginBottom: 0}}
                                    >
                                      <Select size="large" mode="tags"  style={{ width: '100%' }} placeholder="Gõ ký tự và nhấn Enter để thêm giá trị">
                                      </Select>
                                    </Form.Item>
                                </Col>
                                {
                                  fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      className="dynamic-delete-button"
                                      onClick={() => remove(field.name, index)}
                                    />
                                  ) : null
                                }
                              </Row>
                            ))
                          }
                        <Button onClick={() => handleAddNewOption(add)}>Thêm thuộc tính khác</Button>
                      </>
                      )}
                  </Form.List>  
                </>
              </Panel>
            </Collapse>
          </div>
        </Col>
        <Col span={8}>
          <div className={"product-info"}>
            <Title level={5}>Phân loại</Title>
            <div style={{ marginBottom: 8}}>
              <Text strong>Loại sản phẩm</Text>
              <LazadaCategoryPicker
                handleSelect={handleSelectCategory}
                renderState={{
                  name: categorySelected.name,
                  value: categorySelected.value
                }}
              />
            </div>
            <Form.Item name="brand" initialValue={"No brand"} label="Nhãn hiệu">
              <Input allowClear={true} placeholder="Nhập vào nhãn hiệu"/>
            </Form.Item>
            <Divider/>
            <Form.Item name="tags" initialValue={['Áo', 'Áo thun']} label="Tags">
              {/* <Input placeholder="Nhập vào tags"/> */}
              <Select mode="tags" placeholder="Nhập vào tags"></Select>
            </Form.Item>
          </div>
          <div className={"product-info"}>
            <Row>
              <Col>
                <Title level={5}>Ảnh</Title>
              </Col>
            </Row>
            <Row>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handleImagePreview}
                onChange={handleImageChange}
                onRemove={handleImageRemove}
                customRequest={handleImageUpload}
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleImageCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Row>
          </div>
        </Col>
      </Row>
      <Divider />
      <Row id="create product footer" justify="end">
        <Col>
          <Button style={{ marginRight: '10px'}} onClick={() => props.prev()}>Hủy</Button>
          <Button type="primary" htmlType="submit">Tiếp theo</Button>
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicProductInfo)
