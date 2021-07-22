import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import Creators from 'Redux/product'
import toast from 'Helpers/ShowToast'
import firebase from 'Utils/firebase'
import { amountFormatter, amountParser } from 'Utils/inputFormatter'
import { request } from 'Config/axios'
import { Link } from 'react-router-dom'

import { Row, Col, Form, Select, Switch, Divider, Input, Typography, Checkbox, Collapse, Button, Upload, Modal, Tag, Table } from 'antd'
import { blue } from '@ant-design/colors'
import { PlusOutlined, ArrowLeftOutlined, InfoCircleTwoTone } from '@ant-design/icons'
import './SingleProduct.styles.scss'

import TextEditor from 'Components/TextEditor'
import LazadaCategoryPicker from 'Components/LazadaCategoryPicker'
import AddVariantForm from 'Components/AddVariantForm'

const { Title, Text } = Typography 

export const SingleProduct = (props) => {
  const [product, setProduct] = useState({})
  const [form] = Form.useForm()

  useEffect(() => {
    const { dataProduct } = props
    if(dataProduct && Object.keys(dataProduct)?.length > 0) {
      const product = dataProduct
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
      }) || []
      form.setFieldsValue({
        ...product,
      })
      setProduct(product)
      setUploaderState({ fileList: product.fileList})
      if(product.description) {
        setDescription(product.description)
      }
    }
  }, [props])

  useEffect(() => {
    try { 
      let id = props.match.params.id;
      props.getProductById(id)
    } catch(e) { 
      toast({ type: 'error', message: 'Có gì đó sai sai !'})
    }
  }, [])

  //<--------------------------------------description handler----------------------------------------->
  const [showDescription, setShowDescription] = useState(true)
  //<--------------------------------------description handler----------------------------------------->
  
  
  //<----------------------------------------categorySelected handler---------------------------------->
  const [categorySelected, setCategorySelected] = useState({
    name: product.categoryName,
    value: product.categoryId
  })

  const handleSelectCategory = (selected) => {
    const { name, value } = selected;
    setCategorySelected({
      name, value
    })
  }
  //<----------------------------------------categorySelected handler---------------------------------->
  
  
  //<-------------------------------------------image handler----------------------------------------->

  const [uploaderState, setUploaderState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: product.fileList || [],
    }
  )

  const { previewVisible, previewImage, fileList, previewTitle } = uploaderState;

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

      form.setFieldsValue({ avatar: [imageUrl] })
      onSuccess(null, {...image, url: imageUrl});
    } catch(e) {
      onError(e);
    }
  }

  useEffect(() => {
  }, [uploaderState])

  //<----------------------------------------image handler-------------------------------------->

  //<----------------------------------------variant table handler-------------------------------------->
  const columns = [
    {
      title: 'Tên phiên bản',
      fixed: 'left',
      width: 300,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <>
            <Row gutter={[0, 16]}>
              <Col span={4}>
                <img 
                  src={record.avatar || "data:image/png;base64,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"}
                  style={{ width: 30, height: 30}}
                  />
              </Col>
              <Col span={20}>
                <Link to={`/app/product/${product._id}/variant/${record._id}`}>{text}</Link>
              </Col>
            </Row>
          </>
        )
      }
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 200,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 150,
      render: (text) => amountFormatter(text)
    },
    {
      title: 'Giá bán buôn',
      dataIndex: 'wholeSalePrice',
      key: 'wholeSalePrice',
      width: 150,
      render: (text) => amountFormatter(text)
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weightValue',
      key: 'weightValue',
      colSpan: 2,
      width: 150,
      render: (text) => amountFormatter(text)
    },
    {
      dataIndex: 'weightUnit',
      key: 'weightUnit',
      width: 100,
      colSpan: 0,
    },
    {
      title: (
        <>
          <Row justify={"center"} style={{ borderBottom: '1px solid #ddd'}}>Chi nhánh mặc định</Row>
          <Row gutter={16}>
            <Col span={12} style={{ textAlign: 'center'}}>
              Tồn kho
            </Col>
            <Col span={12} style={{ textAlign: 'center'}}>
              Giá vốn
            </Col>
          </Row>
        </>
      ),
      dataIndex: 'initStock',
      key: 'initStock',
      colSpan: 2,
      width: 150,
      render: (value, record) => {
        return amountFormatter(record.inventories.onHand)
      }
    },
    {
      key: 'initPrice',
      dataIndex: 'initPrice',
      colSpan: 0,
      width: 150,
      render: (value, record) => amountFormatter(record.inventories.initPrice)
    }
  ]
  //<----------------------------------------variant table handler-------------------------------------->
  
  //<----------------------------------------variant table handler-------------------------------------->
  //<----------------------------------------variant table handler-------------------------------------->

  //<----------------------------------------text editor handler-------------------------------------->
  const [description, setDescription] = useState(product.description || '')
  const handleTextEditorChange = (value) => {
    setDescription(value)
  }
  //<----------------------------------------text editor handler-------------------------------------->

  //<------------------------------------------ form handler ----------------------------------------->
  const handleFormSubmit = (values) => {
    const updatedProduct = {
      ...product,
      ...values,
      avatar: form.getFieldValue('avatar'),
      description,
      categoryName: categorySelected.name,
      categoryId: categorySelected.value
    }

    props.updateProductStart(updatedProduct)
  }
  //<------------------------------------------ form handler ----------------------------------------->
  
  //<------------------------------------------ remove product handler ----------------------------------------->
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const handleDeleteProduct = () => {
    props.deleteProductStart(product)
    setShowRemoveModal(false)
  }
  //<------------------------------------------ remove product handler ----------------------------------------->

  return (
    <Form 
      colon={false} 
      layout={"vertical"} 
      form={form}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={handleFormSubmit}
    >
      <Row gutter={[0, 16]} style={{ marginBottom: 16 }}>
        <Link to="/app/products">
          <Title level={5}><ArrowLeftOutlined/> Quay lại danh sách sản phẩm</Title>
        </Link>
      </Row>
      <Row gutter={[16, 16]} id="Basic product infos">
        <Col span={16}>
          <div className={"product-info"} style={{ height: '100%' }}>
            <Form.Item 
                name={"name"} 
                label={<p className="product-info__item--text">Tên sản phẩm</p>} 
                className={"product-info__item"}
                rules={[{ required: true, message: 'Trường tên là bắt buộc'}]}
            >
              <Input placeholder="Nhập vào tên sản phẩm"/>
            </Form.Item>
            <p style={{ cursor: 'pointer', color: blue[4] }} onClick={(e) => { e.preventDefault(); setShowDescription(!showDescription)}}>{ showDescription ? 'Ẩn mô tả' : 'Thêm mô tả'}</p>
            {
              showDescription && <>
                <Col span={24}>
                  <Form.Item 
                    name="shortDescription" 
                    rules={[{ max: 100,  message: 'Mô tả ngắn gọn tối đa 80 ký tự' }]}
                  >
                    <Input placeholder={'Mô tả ngắn gọn cho sản phẩm, bao gồm các thông tin nổi bật nhất.....'}/>
                  </Form.Item>
                </Col>
                <Col span={24} style={{ height: '100%' }}>
                  <TextEditor 
                    handleChange={handleTextEditorChange}
                    initialValue={description}
                  />
                </Col>
              </>
            }
          </div>
          </Col>
        <Col span={8}>
          <div className={"product-info"} style={{ height: '100%'}}>
            <Title level={5}>Phân loại</Title>
            <div style={{ marginBottom: 8}}>
              <Text strong>Loại sản phẩm</Text>
              { product.categoryName && 
                  <LazadaCategoryPicker
                    handleSelect={handleSelectCategory}
                    renderState={{
                      name: product.categoryName,
                      value: product.categoryId
                    }}
                  />
                }
            </div>
            <Form.Item name="brand" initialValue={product.brand} label="Nhãn hiệu">
              <Input allowClear={true} value={product.brand} placeholder="Nhập vào nhãn hiệu"/>
            </Form.Item>
            <Divider/>
            <Form.Item 
                name={"tags"} 
                label={'Tags'} 
            >
              <Select mode={"tags"} placeholder="Nhập vào tag"/>
            </Form.Item>
            <Divider/>
            <Row>
              <Col>
                <Title level={5}>Ảnh</Title>
              </Col>
            </Row>
            <Row>
            {/* <Form.Item name="avatar" noStyle> */}
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
            {/* </Form.Item> */}
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
        <Col span={24}>
        <div className={"product-info"}>
            <Row justify={"space-between"}>
              <Col>
                <Title level={5}>Phiên bản</Title>
              </Col>
              <Col>
                { product && (
                  <AddVariantForm 
                    trigger={"link"} 
                    label={"Thêm phiên bản"}
                    initialValues={{
                      suggestOptions: product.options || [],
                      suggestName: product.name,
                      productId: product._id || '',
                    }}  
                  />
                )}
                <Link to="#">Sửa thuộc tính</Link>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={props?.variants && props?.variants.map(i => ({ ...i, key: i._id }))}
                  bordered
                  size="middle"
                  scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Form.Item
        name={"sellable"} 
        label={"Cho phép bán"} 
        style={{ marginRight: 8 }}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Divider />
      <Row id="create product footer" justify="space-between">
        <Col>
          <Button type="danger" onClick={() => setShowRemoveModal(true)}>Xóa sản phẩm</Button>
          <Modal 
            title={(
              <span style={{ fontSize: 18 }}>
                <InfoCircleTwoTone twoToneColor={"#faad14"}/> &nbsp;
                <Text>Xác nhận xóa</Text>
              </span>
            )}
            visible={showRemoveModal}
            onOk={handleDeleteProduct}
            onCancel={() => setShowRemoveModal(false)}
          >
            Bạn có chắc chắn muốn xóa sản phẩm: <Text strong>{product.name}</Text>
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
  auth: state.auth.toJS(),
  dataProduct: state.product.toJS()?.dataProduct,
  variants: state.product.toJS()?.variants,
})

const mapDispatchToProps = dispatch => ({
  getProductById: (payload) => dispatch(Creators.getProductByIdStart(payload)),
  updateProductStart: (payload) => dispatch(Creators.updateProductStart(payload)),
  deleteProductStart: (payload) => dispatch(Creators.deleteProductStart(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)