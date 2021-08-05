import React, { useState, useEffect, useRef, useReducer, Fragment } from 'react'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Form, Input, InputNumber, Checkbox, Button, AutoComplete, Select } from 'antd'
import { connect } from 'react-redux'
import CreateBasicStep from './CreateBasicStep'
import CreatePlatformStep from './CreatePlatformStep.js'
import './AllProductTab.styles.scss'

import AppCreators from 'Redux/app'

const { Text, Title } = Typography
const { Option } = Select

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 19,
    offset: 1
  },
};


const INITIAL_VALUES = {
  productType: 'normal',
  name: 'Áo thun ngắn tay nam',
  sku: 'ao-thun',
  categoryName: '',
  categoryId: 0,
  sendoCategoryName: '',
  sendoCategoryId: 0,
  brand: 'No brand',
  shortDescription: 'Áo thun nam ngắn tay',
  description: "<p><strong>THÔNG TIN SẢN PHẨM</strong></p><p>- Chất Liệu: 95% sợi cotton - 5% sợi Spandex</p><p>- Tính năng: Co dãn 4 chiều</p><p>- Công nghệ: Thêu</p>",
  retailPrice: 100000, // gia ban le
  wholeSalePrice: 100000, // gia ban buon
  importPrice: 100000, //gia nhap
  specialPrice: 100000, //gia nhap
  weightValue: 100, //khoi luong
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
  // options: [
  //   {
  //     optionName: 'Kích thước',
  //     optionValue: ['8', '9'],
  //   },
  //   {
  //     optionName: 'Màu sắc',
  //     optionValue: ['nâu', 'vàng'],
  //   },
  //   {
  //     optionName: 'Chất liệu',
  //     optionValue: ['gỗ', 'thép'],
  //   }
  // ],
  products: [],
}

export const create = (props) => {
  const [form] = Form.useForm()
  //<---------------------------------------------- refresh all token handler ----------------------------------------->
  const [currentStorage, setCurrentStorage] = useState(props.app.storage || {})
  useEffect(() => {
    props.refreshAllTokenStart()
    form.setFieldsValue(INITIAL_VALUES)
  }, [])

  useEffect(() => {
    const { isWorking, storage } = props.app
    if(!isWorking && !_.isEqual(currentStorage, storage)) {
      setCurrentStorage(storage)
    }
  }, [props])
  //<---------------------------------------------- refresh all token handler ----------------------------------------->
  
  //<---------------------------------------------- init all platformProduct ----------------------------------------->
  const onSelectPLatformToPost = (values) => {
    let products = form.getFieldValue('products')

    products = products.map(i => {
      if(values.map(val => val._id).includes(i._id)) {
        i.post = true
      } else { 
        i.post = false
      }

      return i
    })

    form.setFieldsValue({ products })
  }
  //<---------------------------------------------- init all platformProduct ----------------------------------------->
  //<--------------------------------------page render handler------------------------------------------>
  const [currentPage, setCurrentPage] = useState(0)

  const prev = () => { 
    if(currentPage === 0) { 
      history.push('/app/market_place/products')
    } else if(currentPage === 1) {
      setCurrentPage(0)
    }
  }

  const handleBasicFormSubmit = async () => {
    const values = form.getFieldsValue()
    let initPlatformProduct = []
    initPlatformProduct = initPlatformProduct.concat({
        platform_name: 'system',
        store_name: 'MMS'})
      .concat(currentStorage.sendoCredentials)
      .concat(currentStorage.lazadaCredentials)
      .map(i => ({
        ...i,
        name: values.name,
        sku: values.sku,
        quantity: values.quantity,
        retailPrice: values.retailPrice,
        specialPrice: values.specialPrice,
        post: false
      }))      

    form.setFieldsValue({ products: initPlatformProduct } )
    console.log("form after basic step: ", form.getFieldsValue())
    setCurrentPage(1)
  }

  const handleFormSubmit = (values) => {
    console.log("Final form data: ", values)
  }

  //<--------------------------------------page render handler------------------------------------------>
    
  return (
    <Form
      {...layout} 
      form={form}
      colon={false}
      onFinishFailed={(err) => console.log("Failed: ", err)}
      onFinish={handleFormSubmit}
    >
      <CreateBasicStep 
        prev={prev} 
        form={form}
        handleSubmit={handleBasicFormSubmit}
        className={`${currentPage !== 0 ? 'hidden' : ''}`}
      />
      <CreatePlatformStep
        prev={prev} 
        form={form}
        onSelectPLatformToPost={onSelectPLatformToPost}
        className={`${currentPage !== 1 ? 'hidden' : ''}`}
        // handleSubmit={handleBasicFormSubmit}
      />
       <Form.Item name="products">
          <Input type={"text"} type={"hidden"}/>
      </Form.Item>
    </Form>
  )
}

const mapStateToProps = (state) => ({
  app: state.app.toJS()
})

const mapDispatchToProps = dispatch => ({
  refreshAllTokenStart: () => dispatch(AppCreators.refreshAllTokenStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(create)
