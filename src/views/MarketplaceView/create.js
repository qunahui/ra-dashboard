import React, { useState, useEffect, useRef, useReducer, Fragment } from 'react'
import _ from 'lodash'
import { Row, Col, Typography, Divider, Form, Input, InputNumber, Checkbox, Button, AutoComplete, Select } from 'antd'
import { connect } from 'react-redux'
import CreateBasicStep from './CreateBasicStep'
import CreatePlatformStep from './CreatePlatformStep.js'

import AppCreators from 'Redux/app'

const { Text, Title } = Typography
const { Option } = Select

export const create = (props) => {
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
      brand: 'No brand',
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
      options: [
        {
          optionName: 'Kích thước',
          optionValue: ['8', '9'],
        },
        {
          optionName: 'Màu sắc',
          optionValue: ['nâu', 'vàng'],
        },
        {
          optionName: 'Chất liệu',
          optionValue: ['gỗ', 'thép'],
        }
      ],
      products: [],
    }
    )

  //<---------------------------------------------- refresh all token handler ----------------------------------------->
  const [currentStorage, setCurrentStorage] = useState(props.app.storage || {})
  useEffect(() => {
    props.refreshAllTokenStart()
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
    formValues.products = formValues.products.map(i => {
      if(values.map(val => val._id).includes(i._id)) {
        i.post = true
      } else { 
        i.post = false
      }

      return i
    })

    setFormValues({...formValues})
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

  const handleBasicFormSubmit = async (values) => {
    setFormValues(values)

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

    setFormValues({ products: initPlatformProduct })

  
    setCurrentPage(1)
  }

  //<--------------------------------------page render handler------------------------------------------>
    
  return (
    <>
      {
        currentPage === 0 && 
        (
          <CreateBasicStep 
            initialFormValues={formValues} 
            prev={prev} 
            handleSubmit={handleBasicFormSubmit}
          />
        )
      }
      { 
        currentPage === 1 && 
        (
          <CreatePlatformStep
            initialFormValues={formValues} 
            prev={prev} 
            onSelectPLatformToPost={onSelectPLatformToPost}
            // handleSubmit={handleBasicFormSubmit}
          />
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  app: state.app.toJS()
})

const mapDispatchToProps = dispatch => ({
  refreshAllTokenStart: () => dispatch(AppCreators.refreshAllTokenStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(create)
