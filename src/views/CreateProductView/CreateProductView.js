import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
// import { useDispatch, useSelector } from 'redux'

import ProductCreators from 'Redux/product'

import VariantConfirm from './VariantConfirm'

import { Row, Col, Form, Select, InputNumber, Divider, Input, Typography, Checkbox, Collapse, Button, Upload, Modal, Tag,  } from 'antd'
import theme from 'Theme'
import { blue } from '@ant-design/colors'
import './CreateProductView.styles.scss'
import BasicProductInfo from './BasicProductInfo'

const { Title, Text, Link } = Typography
const { Panel } = Collapse
const { Option } = Select
// const dispatch = useDispatch()

const CreateProductView = (props) => {
  const [formValues, setFormValues] = useState(props.initialFormValues || {
    productType: 'normal',
    name: '',
    sku: '',
    categoryName: 'Giày dép & Quần áo nam > Quần áo nam > Áo thun & Áo không tay > Áo thun nam',
    categoryId: 7930,
    brand: '',
    description: '',
    shortDescription: '',
    tags: '',
    retailPrice: 0, // gia ban le
    wholeSalePrice: 0, // gia ban buon
    importPrice: 0, //gia nhap
    weightValue: 0, //khoi luong
    unit: '', // don vi tinh
    weightUnit: 'g', //don vi khoi luong
    fileList: [],
    avatar: [],
    isConfigInventory: true,
    initStock: 100,
    isStockDivided: false,
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
    ]
  })
  //<--------------------------------------change location handler----------------------------------------->
  const history = useHistory()
  //<--------------------------------------change location handler----------------------------------------->

  //<--------------------------------------page render handler------------------------------------------>
  const [currentPage, setCurrentPage] = useState(0)

  const prev = () => { 
    if(currentPage === 0) { 
      history.push('/app/products')
    } else if(currentPage === 1) {
      setCurrentPage(0)
    }
  }

  const handleBasicFormSubmit = (values) => {
    setFormValues(values)
    setCurrentPage(1)
  }

  //<--------------------------------------page render handler------------------------------------------>
  
  //<--------------------------------------page render handler------------------------------------------>
  const handleVariantConfirmSubmit = (data) => {
    const finalData = {
      ...formValues,
      variants: data
    }

    delete finalData.fileList
    delete finalData.importPrice
    delete finalData.retailPrice
    delete finalData.wholeSalePrice

    finalData.variants = finalData.variants.map(i => {
      i.options = i.options.map((option, index) => {
        return {
          optionName: finalData.options[index].optionName,
          optionValue: option
        }
      })

      return i
    })

    console.log(finalData)
    props.createProductStart(finalData)
  }
  //<--------------------------------------page render handler------------------------------------------>

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Thêm mới sản phẩm</Title>
      {
        currentPage === 0 && 
        (
          <BasicProductInfo 
            initialFormValues={formValues} 
            prev={prev} 
            handleSubmit={handleBasicFormSubmit}
            // setCategory={(selected) => setFormValues({
            //   ...formValues,
            //   categoryId: selected.value,
            //   categoryName: selected.namepath.join('/')
            // })}
          />
        )
      }
      { currentPage === 1 && 
        (
          <VariantConfirm 
            initialFormValues={formValues} 
            prev={prev} 
            handleSubmit={handleVariantConfirmSubmit}
          />
        )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
})

const mapDispatchToProps = dispatch => ({
  createProductStart: (payload) => dispatch(ProductCreators.createProductStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductView)
