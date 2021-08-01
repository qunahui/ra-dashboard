import React, { useState, useEffect, useRef, useReducer, Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { request } from 'Config/axios'
import { removeVI } from 'jsrmvi'
import { Row, Col, Typography, Divider, Form, Input, Tag, InputNumber, Checkbox, Button, AutoComplete, Select, Table } from 'antd'
import { amountFormatter, amountParser, moneyFormatter, moneyParser } from 'Utils/inputFormatter'
import CateMappingTable from 'Components/CateMappingTable'
import AddPlatformForm from 'Components/AddPlatformForm'
import BrandSelect from 'Components/BrandSelect'
import toast from 'Components/Helpers/ShowToast'
import TextEditor from 'Components/TextEditor'
import ImageUpload from 'Components/ImageUpload'
import AppCreators from 'Redux/app'

import Icon, { CloseOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
import SendoIcon from 'Assets/sendo-icon.svg'
import LazadaIcon from 'Assets/lazada-icon.svg'
import SystemIcon from 'Assets/system.svg'

import './createBasicStep.styles.scss'

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

const sendoUnit = [
  "Cái",
  "Bộ",
  "Chiếc",
  "Đôi",
  "Hộp",
  "Cuốn",
  "Chai",
  "Thùng"
]

let searchBrandTimeout;
let curBrandValue;

export const CreatePlatformStep = (props) => {
  //<------------------------------------------------------- form handler --------------------------------------------------------->
  const { form } = props

  const [formValues, setFormValues] = useReducer(
    (state, newState) => ({ ...state, ...newState}),
    {
      ...props.initialFormValues
    }
  )

  const createSystemVariant = (arr, generalData) => {
    let variants = []
    let n = arr.length
    
    let indices = []

    for (let i = 0; i < n; i++) {
      indices[i] = 0;
    }

    while (1) {
        let variantName = ''
        for (let i = 0; i < n; i++) {
          variantName += ' - ' + arr[i][indices[i]]
        }

        const variantNameArr = variantName.split(' - ')
        variantNameArr.shift()

        variants.push({
          avatar: '',
          name: generalData.name + variantName,
          key: variantName,
          sku: generalData.sku + '-' + variantNameArr?.map(i => removeVI(i, { replaceSpecialCharacters: false })).join('-'),
          options: variantNameArr,
          importPrice: generalData.retailPrice,
          wholeSalePrice: generalData.retailPrice,
          retailPrice: generalData.retailPrice,
          unit: generalData.unit,
          weightValue: generalData.weightValue,
          weightUnit: generalData.weightUnit,
          initPrice: generalData.retailPrice || 0,
          initStock: generalData.quantity || 0,
          inventories: {
            initPrice: generalData.retailPrice || 0,
            onHand: generalData.quantity || 0,
            trading: 0,
            onway: 0,
            incoming: 0,
          },
          sellable: generalData.sellable || true,
        })

        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >= arr[next].length)) {
          next--;
        }

        if (next < 0) {
          break;
        }

        indices[next]++;

        for (let i = next + 1; i < n; i++) {
          indices[i] = 0;
        }
    }

    return variants
  }

  const createSystemProduct = (generalData) => {
    const { options } = generalData
    let variants = createSystemVariant(options?.map(option => option.optionValue), generalData)


    const finalData = {
      ...generalData,
      variants
    }

    finalData.variants = finalData.variants?.map(i => {
      i.options = i.options?.map((option, index) => {
        return {
          optionName: finalData.options[index].optionName,
          optionValue: option
        }
      })

      return i
    })

    return finalData
  }

  const createLazadaVariants = (options, additionalData) => {
    let variants = []
    let arr = options.map(i => i.optionValue)
    let n = arr.length

    let indices = []

    for (let i = 0; i < n; i++) {
      indices[i] = 0;
    }

    while (1) {
        let variantName = ''
        for (let i = 0; i < n; i++) {
          variantName += ' - ' + arr[i][indices[i]]
        }

        const variantNameArr = variantName.split(' - ')
        variantNameArr.shift()

        variants.push({
          ...additionalData,
          options: variantNameArr,
          SellerSku: additionalData.SellerSku + variantName
        })

        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >= arr[next].length)) {
          next--;
        }

        if (next < 0) {
          break;
        }

        indices[next]++;

        for (let i = next + 1; i < n; i++) {
          indices[i] = 0;
        }
    }

    return variants
  }

  const createSendoVariants = (options) => {
    let variants = []
    let arr = options.map(i => i.optionValue)
    let n = arr.length

    let indices = []

    for (let i = 0; i < n; i++) {
      indices[i] = 0;
    }

    while (1) {
        let variantName = ''
        for (let i = 0; i < n; i++) {
          variantName += ' - ' + arr[i][indices[i]]
        }

        const variantNameArr = variantName.split(' - ')
        variantNameArr.shift()

        variants.push({
          options: variantNameArr,
          sku: variantName
        })

        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >= arr[next].length)) {
          next--;
        }

        if (next < 0) {
          break;
        }

        indices[next]++;

        for (let i = next + 1; i < n; i++) {
          indices[i] = 0;
        }
    }

    return variants
  }

  const createLazadaProduct = (generalData) => {
    const { options } = generalData
    const attrs = {}
    const skuAttrs = {}
    lazadaAttr.map(i => {
      if(i.attribute_type === 1 && i.attribute_name !== 'color_family' && i.attribute_name !== 'size') {
        attrs[i.attribute_name] = i.values
      } else {
        skuAttrs[i.attribute_name] = i.values
      }
    })
    let skus = []
    if(!options.some(i => i.required === true)) {
      skus.push({
        ...skuAttrs,
        SellerSku: generalData.sku,
        package_weight: generalData.weight,
        package_height: generalData.height,
        package_width: generalData.width,
        package_length: generalData.length,
        quantity: generalData.quantity,
        price: generalData.retailPrice,
        Images: {
          Image: generalData.avatar.map(avt => (avt.split('?alt=media')[0] + '?alt=media'))
        }
      })
    } else {
      skus = createLazadaVariants(options, { 
        ...skuAttrs,
        SellerSku: generalData.sku,
        package_weight: generalData.weight,
        package_height: generalData.height,
        package_width: generalData.width,
        package_length: generalData.length,
        quantity: generalData.quantity,
        price: generalData.retailPrice,
        Images: {
          Image: generalData.avatar.map(avt => avt.split('?alt=media')[0] + '?alt=media')
        }
      }).map(sku => {
        options.map((i, index) => sku[i.optionName] = sku.options[index])
        delete sku.options
        delete sku.options_en
        return sku
      })
    }

    delete attrs.description

    const lazadaProduct = {
      "Request": {
        "Product": {
          "PrimaryCategory": generalData.categoryId,
          "SPUId": null,
          "Attributes": {
            ...attrs,
            'name': generalData.name,
            'short_description': generalData.shortDescription
          },
          "Skus": {
            "Sku": skus
          }
        }
      }
    }

    return lazadaProduct
  }

  const createSendoProduct = (generalData) => {
    let variants = undefined
    let isConfigVariant = sendoAttr.is_config_variant

    if(isConfigVariant) {
      let options = sendoAttr.attribute?.map(i => {
        if(i.is_checkout === true) {
          if(i.control_type === 'ComboBox') {
            let matchedOpt = i.attribute_values.find(i => i.is_selected === true)
            return {
              optionName: i.name,
              optionValue: [matchedOpt?.value].filter(v => v),
              additionalData: i,
              isSendoAttr: true
            }
          } else if(i.control_type === 'CheckBox') {
            let matchedOpt =i.attribute_values.filter(i => i.is_selected === true)
            let optionValue =  _.uniq(matchedOpt.map(opt => opt?.value))

            return {
              optionName: i.name,
              optionValue,
              additionalData: i,
              isSendoAttr: true
            }
          }
        }
      })

      let filteredOpt = options.filter(i => i)
      variants = createSendoVariants(filteredOpt);
      for(let variant of variants) {
        let variant_attributes = []
        filteredOpt.map((i, index) => {
          let isSendoAttr = !!i.isSendoAttr
          let customMatched = sendoAttr.attribute.find(y => y.name === i.optionName)
          let toPush = {
            attribute_id: isSendoAttr ? i.additionalData.id : customMatched?.id,
            attribute_is_custom: !isSendoAttr,
            attribute_is_checkout: isSendoAttr,
            name: i.optionName,
            attribute_code: i.optionName.split(' ').map(i => removeVI(i, { replaceSpecialCharacters: false }).toLowerCase()).join('_'),
            option_id: isSendoAttr ? i.additionalData.attribute_values.find(at => at.value === variant.options[index])?.id : customMatched.attribute_values.find(at => at.value === variant.options[index])?.id,
            attribute_values: {
              id: isSendoAttr ? i.additionalData.attribute_values.find(at => at.value === variant.options[index])?.id : customMatched.attribute_values.find(at => at.value === variant.options[index])?.id,
              value: variant.options[index],
              is_selected: true,
              is_custom: !isSendoAttr
            },
            // option_id: 25304
          }
          variant_attributes.push(toPush)
        })
        variant.variant_attributes = variant_attributes
        variant.variant_sku = generalData.sku + variant.sku
        variant.variant_price = generalData.retailPrice
        variant.variant_quantity = generalData.quantity
        delete variant.options
        delete variant.sku
        // variant.variant_is_promotion = 0 
        // "variant_special_price": 0,
        // "variant_quantity": 122,
        // "variant_promotion_start_date_timestamp": null,
        // "variant_promotion_end_date_timestamp": null,
        // "variant_is_flash_sales": null,
        // "variant_campaign_status": null,
        // "variant_attribute_hash": "602_25304",
      }
    }

    // console.log(variants)

    let sendoProduct = {
      id: 0,
      name: generalData.name,
      sku: generalData.sku,
      price: generalData.retailPrice,
      weight: generalData.weight,
      stock_availability: generalData.quantity > 0 ? true : false,
      description: generalData.description,
      cat_4_id: generalData.sendoCategoryId,
      height: generalData.height,
      length: generalData.length,
      width: generalData.width,
      unit_id: generalData?.sendoUnitId,
      stock_quantity: generalData.quantity,
      avatar: {
        "picture_url" : generalData?.avatar[0]
      },
      pictures: generalData?.avatar.map(i => ({
        "picture_url" : i
      })),
      extended_shipping_package: {
        is_using_instant: false,
        is_using_in_day: false,
        is_self_shipping: false,
        is_using_standard: true,
        is_using_eco: false
      },
      is_promotion: false,
      attributes: sendoAttr.attribute.map(at => ({
        attribute_id: at.id,
        attribute_name: at.name,
        attribute_code: at.name.split(' ').map(i => removeVI(i, { replaceSpecialCharacters: false }).toLowerCase()).join('_'),
        attribute_is_custom: !!at.is_custom,
        attribute_is_checkout: !at.is_custom,
        attribute_values: at.attribute_values.filter(i => i.is_selected === true)
      })),
      is_config_variant: sendoAttr.is_config_variant,
      variants,
      voucher: {
        product_type: sendoAttr.product_types[0]
      }
    }

    // .concat(generalData.options.filter(cusAt => cusAt.optionName !== 'Màu sắc' && cusAt.optionName !== 'color_family').map(cusAt => ({
    //   attribute_id: 10000 + parseInt(Math.random()*10000),
    //   attribute_name: cusAt.optionName,
    //   attribute_code: cusAt.optionName.split(' ').map(i => removeVI(i, { replaceSpecialCharacters: false }).toLowerCase()).join('_'),
    //   attribute_is_custom: true,
    //   attribute_is_checkout: false,
    //   attribute_values: cusAt.optionValue.map(ol => ({ id: 10000 + parseInt(Math.random()*10000), value: ol, is_selected: true, is_custom: true }))
    // })))

    return sendoProduct
  }

  const handleFormSubmit = (values) => {
    let finalData = form.getFieldsValue()

    let productToPost = []
    const products = form.getFieldValue('products')
    for(let item of products) {
      if(item.platform_name === 'system' && item.post === true) {
        let systemProduct = createSystemProduct({
          ...finalData,
          ...item
        })
        productToPost.push({ ...systemProduct, ...item })

      } else if(item.platform_name === 'lazada' && item.post === true) {
        let lazadaProduct = createLazadaProduct({
          ...finalData,
          weight: finalData?.weightValue,
          ...item
        })
        productToPost.push({ ...lazadaProduct, ...item })
      } else if(item.platform_name === 'sendo' && item.post === true) {
        let sendoProduct = createSendoProduct({
          ...finalData,
          ...item
        })
        productToPost.push({ ...sendoProduct , ...item})
      }
    }

    props.createMulti(productToPost)
  }

  useEffect(() => {
    // form.setFieldsValue(props.initialFormValues)
    // setFormValues(props.initialFormValues)
    console.log(form.getFieldsValue())
  }, [])

  //<------------------------------------------------------- form handler --------------------------------------------------------->

  //<------------------------------------------------------- category handler --------------------------------------------------------->
  const handleLazadaSelect = selected => {
    form.setFieldsValue({
      categoryId: selected.value,
      categoryName: selected.name,
    })
    setFormValues({
      categoryId: selected.value,
      categoryName: selected.name,
    })
  }

  const handleSendoSelect = selected => {
    form.setFieldsValue({
      sendoCategoryId: selected.value,
      sendoCategoryName: selected.name,
    })
    setFormValues({
      sendoCategoryId: selected.value,
      sendoCategoryName: selected.name,
    })
  }
  //<------------------------------------------------------- category handler --------------------------------------------------------->
  

  //<------------------------------------------------------- platform handler --------------------------------------------------------->
  const [selectedPlatform, setSelectedPlatform] = useState([])
  const [isConfigSendoAttr, setConfigSendoAttr] = useState(false)
  const [isConfigLazadaAttr, setConfigLazadaAttr] = useState(false)
  const [sendoAttr, setSendoAttr] = useState([])
  const [lazadaAttr, setLazadaAttr] = useState([])
  const [cateDataSource, setCateDataSource] = useState([])
  
  const handlePlatformSelected = (values) => {
    let newCateDataSource = values.filter((value, index, self) => self.findIndex(val => val.platform_name === value.platform_name) === index)
    setConfigSendoAttr(newCateDataSource.some(i => i.platform_name === 'sendo'))
    setConfigLazadaAttr(newCateDataSource.some(i => i.platform_name === 'lazada'))
    setSelectedPlatform(values)
    setCateDataSource(newCateDataSource)
    props.onSelectPLatformToPost && props.onSelectPLatformToPost(values)
  }

  const handleRemoveSelectedPlatform = (remove) => {
    let newData = selectedPlatform.filter(i => i.store_name !== remove.store_name)
    setSelectedPlatform(newData)
    props.onSelectPLatformToPost && props.onSelectPLatformToPost(newData)
    if(newData.reduce((acc, ds) => {
      if(ds.platform_name === remove.platform_name) {
        acc += 1
      }
      return acc
    }, 0) === 0) {
      setCateDataSource(cateDataSource.filter(i => i.platform_name !== remove.platform_name))
    }
    setConfigSendoAttr(newData.some(i => i.platform_name === 'sendo'))
    setConfigLazadaAttr(newData.some(i => i.platform_name === 'lazada'))
  }
  //<------------------------------------------------------- platform handler --------------------------------------------------------->
  
  //<------------------------------------------------------- input type handler --------------------------------------------------------->
  //<------------------------------------------------------- input type handler --------------------------------------------------------->
  
  //<------------------------------------------------------- attribute handler --------------------------------------------------------->
  const [showMax, setShowMax] = useState(3)
  useEffect(() => {
    async function getSendoAttr() {
      const { sendoCategoryId, options } = form.getFieldsValue()
      try {
        const response = await request.get(`/api/sendo/attributes/${sendoCategoryId}`, {
          headers: {
            'Platform-Token': selectedPlatform.find(i => i.platform_name === 'sendo').access_token
          }
        })

        if(response.code === 200) {
          let finalSendoAttr = response.data
          let customId = new Date().getTime() % 100000 + parseInt(Math.random()*1000)
          console.log("aaaaaaaaaaaaaa, ", finalSendoAttr)
          console.log("bbbbbbbbbbbbbbb, ", options)
          // finalSendoAttr.attribute = finalSendoAttr.attribute.concat(options.filter(cusAt => cusAt.optionName !== 'Màu sắc' && cusAt.optionName !== 'color_family').map(cusAt => ({
          //   id: customId,
          //   name: cusAt.optionName,
          //   is_custom: true,
          //   is_required: false,
          //   is_checkout: false,
          //   attribute_values: cusAt.optionValue.map((ol, index) => ({ id: customId + parseInt(Math.random()*1000), value: ol, is_selected: true, is_custom: true }))
          // })))
          setSendoAttr(finalSendoAttr)
        }
      } catch(e) {
        console.log(e.message)
        toast({ type: 'error', message: e.message })
      }
    }

    if(isConfigSendoAttr) {
      getSendoAttr()
    }
  }, [form.getFieldValue('sendoCategoryId'), isConfigSendoAttr])

  useEffect(() => {
    async function getLazadaAttr() {
      try {
        const { categoryId, options } = form.getFieldsValue()
        const response = await request.get(`/lazada/attributes/${categoryId}`)

        if(response.code === 200) {
          console.log(response.data)
          setLazadaAttr(response.data?.attributes)
          // setLazadaAttr(response.data.api)
        }
      } catch(e) {
        console.log(e.message)
        toast({ type: 'error', message: e.message })
      }
    }

    if(isConfigLazadaAttr) {
      getLazadaAttr()
    }
  }, [form.getFieldValue('categoryId'), isConfigLazadaAttr])

  const lazadaInputTypeSwitch = (attr, index) => {
    switch(attr.input_type) {
      case 1:
      case 'text':
        return <Input style={{ width: '100%'}} key={attr._id}/>
      case 2: 
      case 'numeric':
        return <InputNumber style={{ width: '100%' }} key={attr._id}/>
      case 3:
      case 'richText':
        return <TextEditor key={attr._id}/>
      case 4:
      case 'singleSelect':
        return (!(attr.name === 'Thương hiệu') && !(attr.name === 'brand')) ?
          <Select 
            value={lazadaAttr[index]?.values_vi}
            style={{ width: '100%'}}
            showSearch 
            key={attr._id}
            onChange={(value) => {
              let newAttr = [...lazadaAttr];
              let values_en = newAttr[index].option_en[newAttr[index].option.findIndex(i => i === value)]
              newAttr[index] = {
                ...newAttr[index],
                values: !!values_en ? values_en : value,
                values_vi: value
              }
              setLazadaAttr(newAttr)
            }}
          >
            {attr.options ? attr.options?.map(i => <Option key={Math.random()} value={i.name}>{i.name}</Option>) : attr.option?.map(i => <Option key={Math.random()} value={i}>{i}</Option>)}
          </Select> : null
      case 5:
      case 'multiSelect':
        return <Select mode={'multiple'} style={{ width: '100%'}} showSearch key={attr._id}>
          {attr.options ? attr.options?.map(i => <Option key={Math.random()} value={i.name}>{i.name}</Option>) : attr.option?.map(i => <Option key={Math.random()} value={i}>{i}</Option>)}
        </Select>
      case 6:
      case 'date': 
        return <Input style={{ width: '100%'}} key={attr._id}/>
      case 7:
      case 'img': 
        return <ImageUpload key={attr._id}/>
      case 8:
      case 'multiEnumInput':
        return <Select mode={'tags'} style={{ width: '100%'}} showSearch key={attr._id} value={attr?.values || []}
          onChange={(values) => {
            let newAttr = [...lazadaAttr];
            newAttr[index] = {
              ...newAttr[index],
              values
            }
            setLazadaAttr(newAttr)
          }}
        >
            {attr.options ? attr.options?.map(i => <Option key={Math.random()} value={i.name}>{i.name}</Option>) : attr.option?.map(i => <Option key={Math.random()} value={i}>{i}</Option>)}
        </Select>
      case 9:
      case 'enumInput':
        return <Select mode={'tags'} value={lazadaAttr[index]?.values_vi && [lazadaAttr[index]?.values_vi]} style={{ width: '100%'}} showSearch key={attr._id} onChange={value => {
          let newAttr = [...lazadaAttr];
          let values_en = newAttr[index]?.option_en[newAttr[index].option.findIndex(i => i === value[value.length - 1])]
          newAttr[index] = {
            ...newAttr[index],
            values: !!values_en ? values_en : value[value.length - 1],
            values_vi: value[value.length - 1]
          }
          setLazadaAttr(newAttr)
        }}>
            {attr.options ? attr.options?.map(i => <Option key={Math.random()} value={i.name}>{i.name}</Option>) : attr.option?.map(i => <Option key={Math.random()} value={i}>{i}</Option>)}
        </Select>
    }
  }
  //<------------------------------------------------------- attribute handler --------------------------------------------------------->
  //<------------------------------------------------------- brand render --------------------------------------------------------->
  const renderSystemBrand = () => {
    const brand = form.getFieldValue('brand')
    return <BrandSelect
      size={'large'}
      value={brand}
      onChange={brand => {
        form.setFieldsValue({ brand })
      }}
    />
  }

  const renderLazadaBrand = () => {
    let newLazAttr = [...lazadaAttr]
    let index = newLazAttr.findIndex(i => i.attribute_name === 'brand') 

    return <BrandSelect
      size={'large'} 
      value={newLazAttr[index]?.values}
      onChange={value => {
        newLazAttr[index] = {
          ...newLazAttr[index],
          values: value
        }
        setLazadaAttr(newLazAttr)
      }}
    />
  }
  //<------------------------------------------------------- brand render --------------------------------------------------------->

  //<------------------------------------------------------- handle not required sendo attribute --------------------------------------------------------->
  const handleNotRequiredSendoAttributeChange = (value, attrName, mode) => {
    let newSendoAttr = { ...sendoAttr }
    newSendoAttr.attribute = newSendoAttr.attribute.map((attr, index) => {
      if(attr.name === attrName) {
        attr.attribute_values = attr?.attribute_values?.map(attrValue => {
          if(mode === 'multiple') {
            if(value.includes(attrValue.value)) {
              attrValue.is_selected = true
            } else {
              attrValue.is_selected = false
            }
          } else {
            if(value === attrValue.value) {
              attrValue.is_selected = true
            } else {
              attrValue.is_selected = false
            }
          }
          return attrValue
        })
      }
      return attr
    })

    setSendoAttr(newSendoAttr)
  }
  //<------------------------------------------------------- handle not required sendo attribute --------------------------------------------------------->

  return (
    <div className={props.className}>
      <Row>
        <div style={{ margin: 32 }}>
          <Button type={"primary"} onClick={() => console.log(form.getFieldsValue())}>Show form</Button>
          <Button style={{ marginLeft: 16}} type={"primary"} onClick={() => console.log(sendoAttr)}>Show sendo attribute</Button>
        </div>
        <Col span={21} offset={1}>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Title level={5}>Chọn gian hàng</Title>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Row className={"padding"}>
              <Col span={24}>
                <AddPlatformForm
                  handleSubmit={handlePlatformSelected}
                />
              </Col>
              <Col span={24} style={{ marginTop: 16 }}>
                {
                  selectedPlatform.map(plat => (
                    <Tag style={{ fontSize: 18, width: 250, height: 40 }} color={'blue'} key={plat.store_name}>
                      <Row style={{ height: '100%'}} justify={"space-between"}>
                        <Col style={{ display: 'grid', placeItems:'center'}}>
                          <Text>{plat.platform_name === 'sendo' ? <SendoIcon/> : plat.platform_name === 'lazada' ? <LazadaIcon/> : <SystemIcon/>} {plat.store_name}</Text>
                        </Col>
                        <Col style={{ display: 'grid', placeItems:'center'}}>
                          <CloseOutlined onClick={() => handleRemoveSelectedPlatform(plat)}/>
                        </Col>
                      </Row>
                    </Tag>
                  ))
                }
              </Col>
            </Row>
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Title level={5}>Chọn ngành hàng</Title>
            </Row>
            <Divider style={{ margin: 0}}/>
            { selectedPlatform.length > 0 && (
              <CateMappingTable 
                credentials={cateDataSource} 
                defaultCategory={{
                  name: form.getFieldValue('categoryName'),
                  value: form.getFieldValue('categoryId')
                }}
                sendoCategory={{
                  name: form.getFieldValue('sendoCategoryName'),
                  value: form.getFieldValue('sendoCategoryId'),
                }}
                handleSendoSelect={handleSendoSelect}
                handleLazadaSelect={handleLazadaSelect}
              />
            )}
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Title level={5}>Thiết lập giá và tồn kho cho từng gian hàng</Title>
            </Row>
            <Divider style={{ margin: 0}}/>
            {
              selectedPlatform.length > 0 && 
                <Form.List name="products">
                  {
                    (fields, { add, remove }, { errors }) => {
                      return (
                          fields.map((field, index) => {
                            const products = form.getFieldValue('products')
                            const icon = products[index].platform_name === 'sendo' ? <SendoIcon/> : products[index].platform_name === 'lazada' ? <LazadaIcon/> : <SystemIcon/> 
                            if(products[index].post === true){
                              return (
                                <Fragment key={Math.random()}>
                                  <Row>
                                    <Col span={24} style={{ padding: '8px 16px', background: '#fafafa'}}>
                                      <Text>{icon} {products[index].store_name}</Text>
                                    </Col>
                                  </Row>
                                  <Row gutter={16} type={"flex"} style={{ padding: '8px 16px', marginBottom: 16, height: 100 }}>
                                    <Col span={4}>
                                      <Form.Item
                                        layout={"vertical"}
                                        {...field}
                                        label={<Text strong>Phiên bản</Text>}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24}}
                                        key={field.fieldKey}
                                        name={[field.name, 'name']}
                                        fieldKey={[field.fieldKey, 'name']}
                                        style={{ marginBottom: 0, width: '100%'}}
                                        // rules={[{ required: true, message: 'Missing  name' }]}
                                      >
                                        <Input disabled={true}/>
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        {...field}
                                        key={field.fieldKey}
                                        label={<Text strong>Mã SKU</Text>}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24}}
                                        name={[field.name, 'sku']}
                                        fieldKey={[field.fieldKey, 'sku']}
                                        style={{ marginBottom: 0, width: '100%'}}
                                        // rules={[{ required: true, message: 'Missing  name' }]}
                                      >
                                        <Input/>
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        {...field}
                                        key={field.fieldKey}
                                        label={<Text strong>Tồn kho</Text>}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24}}
                                        name={[field.name, 'quantity']}
                                        fieldKey={[field.fieldKey, 'quantity']}
                                        style={{ marginBottom: 0, width: '100%'}}
                                        // rules={[{ required: true, message: 'Missing  name' }]}
                                      >
                                        <InputNumber style={{ width: '100%'}} formatter={amountFormatter} parser={amountParser}/>
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        {...field}
                                        key={field.fieldKey}
                                        label={<Text strong>Giá bán</Text>}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24}}
                                        name={[field.name, 'retailPrice']}
                                        fieldKey={[field.fieldKey, 'retailPrice']}
                                        style={{ marginBottom: 0, width: '100%'}}
                                        // rules={[{ required: true, message: 'Missing  name' }]}
                                      >
                                        <InputNumber style={{ width: '100%'}} formatter={moneyFormatter} parser={moneyParser}/>
                                      </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...field}
                                        key={field.fieldKey}
                                        label={<Text strong>Giá đặc biệt</Text>}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24}}
                                        name={[field.name, 'specialPrice']}
                                        fieldKey={[field.fieldKey, 'specialPrice']}
                                        style={{ marginBottom: 0, width: '100%'}}
                                        // rules={[{ required: true, message: 'Missing  name' }]}
                                      >
                                        <InputNumber style={{ width: '100%'}} formatter={moneyFormatter} parser={moneyParser}/>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Fragment>
                              )
                            }
                          })
                      )
                    }
                  }
                </Form.List>
            }  
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Title level={5}>Thiết lập thông tin bắt buộc theo sàn</Title>
            </Row>
            <Divider style={{ margin: 0}}/>
            <Col span={24} style={{ padding: '8px 16px', background: '#fafafa'}}>
              <Text strong>Thương hiệu</Text>
            </Col>
              { selectedPlatform.length > 0 && form.getFieldValue('products').map(i => {
                if(i.post === true && i.platform_name !== 'sendo') {
                  if(i.platform_name === 'system') {
                    renderSystemBrand()
                  } else if(i.platform_name === 'lazada') {
                    renderLazadaBrand()
                  }
                  return <Row className={'padding'} key={Math.random()}>
                    <Col span={6}><Text>{i.platform_name === 'lazada' ? <LazadaIcon/> : <SystemIcon/>} {i.platform_name.toUpperCase()}</Text></Col>
                    <Col span={18}>{i.platform_name === 'system' ? renderSystemBrand() : i.platform_name === 'lazada' && renderLazadaBrand()}</Col>
                  </Row>
                }
              })}
            <Col span={24} style={{ padding: '8px 16px', background: '#fafafa'}}>
              <Text strong>Thông tin bắt buộc theo ngành hàng của từng sàn</Text>
            </Col>
            {
              selectedPlatform.some(i => i.platform_name === 'sendo') && (
                <Row align="middle" gutter={[16,8]} className={"padding"} style={{ width: '100%'}}>
                  <Col span={8}><Text>{<SendoIcon/>} Đơn vị tính</Text></Col>
                  <Col span={16}>
                    <Form.Item
                      name={"sendoUnitId"}
                      label={""}
                    >
                      <Select
                        defaultActiveFirstOption
                        onChange={(value) => form.setFieldsValue({ sendoUnitId: value })}
                        style={{ width: '100%'}}
                      >
                        {sendoUnit.map((i, index) => <Option key={index + 1} value={index + 1}>{i}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
            {
              isConfigSendoAttr && (
                <>
                  {/* Sendo attribute section */}
                  <Row align="middle" gutter={[16,8]} className={"padding"} style={{ width: '100%'}}> 
                  {
                    sendoAttr?.attribute && sendoAttr.attribute.map((attr, index) => attr.is_required && (
                      <Fragment key={Math.random()}>
                        <Col span={8}><SendoIcon/> &nbsp;{attr.name}</Col>
                        <Col span={16}>
                          {
                            attr.control_type === 'TextBox' ? 
                              <Input style={{ width: '100%'}} onChange={(value) => {
                                let newArr = [...attr.attribute]
                                if(value) {
                                  newArr[index] = {
                                    ...newArr,
                                    value,
                                    is_selected: true,
                                  }
                                } else {
                                  newArr[index] = {
                                    ...newArr,
                                    value,
                                    is_selected: false,
                                  }
                                }
                                setSendoAttr({ ...sendoAttr, attribute: newArr })
                              }}/>
                            : 
                              <Select 
                                mode={attr.control_type === 'CheckBox' && 'multiple'}
                                value={attr.control_type === 'CheckBox' ? attr.attribute_values.filter(i => i.is_selected === true).map(i => i.value) : attr.attribute_values.find(i => i.is_selected === true)?.value}
                                style={{ width: '100%'}}  
                                showSearch
                                onChange={(value, option) => {
                                  if(attr.control_type === 'ComboBox') {
                                    for(let item of attr.attribute_values) {
                                      item.is_selected = false
                                    }
                                    attr.attribute_values.find(i => i.value === value).is_selected = true
                                  } else if(attr.control_type === 'CheckBox') {
                                    for(let item of value) {
                                      attr.attribute_values.find(i => i.value === item).is_selected = true
                                    }
                                  }
                                  setSendoAttr({ ...sendoAttr })
                                }}
                                onDeselect={(value) => {
                                  attr.attribute_values.find(i => i.value === value).is_selected = false
                                  setSendoAttr({ ...sendoAttr })
                                }}
                              >
                                {
                                  attr.attribute_values.map(i => <Option key={i.id} value={i.value}>{i.value}</Option>)
                                }
                              </Select>
                          }
                        </Col>
                      </Fragment>
                    ))
                  }
                  </Row>
                  {/* Sendo attribute section */}
                </>
              )
            }
            {
              isConfigLazadaAttr && (
                <>
                  {/* Sendo attribute section */}
                  <Row align="middle" gutter={[16,8]} className={"padding"} style={{ width: '100%'}}> 
                  {
                    lazadaAttr.length > 0 && lazadaAttr.map((attr, index) => {
                      if(attr.is_mandatory && !['Tên', 'Thương hiệu', 'Giá', 'Khối lượng gói hàng (kg)', 'Chiều dài gói hàng (cm)', 'Chiều rộng gói hàng (cm)', 'Chiều cao gói hàng (cm)'].concat(['name', 'brand', 'SellerSku', 'price', 'package_weight', 'package_length', 'package_width', 'package_height']).includes(attr.name)) {
                        return (
                          <Fragment key={Math.random()}>
                            <Col span={8}><LazadaIcon/> &nbsp;{attr.name}</Col>
                            <Col span={16}>
                              {lazadaInputTypeSwitch(attr, index)}
                            </Col>
                          </Fragment>
                        )
                      }
                    })
                  }
                  </Row>
                  {/* Sendo attribute section */}
                </>
              )
            }
          </div>
          <div className={'basic-marketplace-section'}>
            <Row className={'padding'}>
              <Title level={5}>Thiết lập thuộc tính không bắt buộc theo sàn</Title>
            </Row>
            <Divider style={{ margin: 0}}/>
            {
              isConfigSendoAttr && (
                <>
                  {/* Sendo attribute section */}
                  <Row align="middle" gutter={[16,8]} className={"padding"} style={{ width: '100%'}}>
                  {
                    sendoAttr?.attribute && sendoAttr.attribute.map((attr, index) => !attr.is_required && index < showMax && (
                      <Fragment key={Math.random()}>
                        <Col span={8}><SendoIcon/> &nbsp;{attr.name}</Col>
                        <Col span={16}>
                          {
                            attr.control_type === 'TextBox' ? 
                              <Input style={{ width: '100%'}}/>
                            : 
                              <Select 
                                value={
                                  attr.control_type === 'CheckBox' ? (_.uniq(attr?.attribute_values?.filter(i => i.is_selected).map(i => i.value)) || [])
                                  : (attr?.attribute_values?.find(i => i.is_selected)?.value || '')
                                } 
                                style={{ width: '100%'}} mode={attr.control_type === 'CheckBox' && 'multiple'} onChange={(value) => handleNotRequiredSendoAttributeChange(value, attr.name, attr.control_type === 'CheckBox' && 'multiple')}>
                                {
                                  attr.attribute_values.map(i => <Option key={i.id} value={i.value}>{i.value}</Option>)
                                }
                              </Select>
                          }
                        </Col>
                      </Fragment>
                    ))
                  }
                  </Row>
                  {/* Sendo attribute section */}
                </>
              )
            }
            {
              isConfigLazadaAttr && (
                <>
                  {/* Sendo attribute section */}
                  <Row align="middle" gutter={[16,8]} className={"padding"} style={{ width: '100%'}}> 
                  {
                    lazadaAttr.length > 0 && lazadaAttr.map((attr, index) => {
                      if(!attr.is_mandatory && !['__images__', 'color_thumbnail'].includes(attr.name) && index < showMax) {
                        return (
                          <Fragment key={Math.random()}>
                            <Col span={8}><LazadaIcon/> &nbsp;{attr.name}</Col>
                            <Col span={16}>
                              {lazadaInputTypeSwitch(attr, index)}
                            </Col>
                          </Fragment>
                        )
                      }
                    })
                  }
                  </Row>
                  {
                    showMax === 3 ? <Row justify={"center"}><Button onClick={() => setShowMax(999)} style={{ color: blue[5], marginBottom: 16, borderRadius: 10 }}>Xem thêm <DoubleRightOutlined style={{ transform: 'rotate(90deg)'}} /></Button></Row>
                      : <Row justify={"center"}><Button onClick={() => setShowMax(3)} style={{ color: blue[5], marginBottom: 16, borderRadius: 10 }}>Thu gọn <DoubleRightOutlined style={{ transform: 'rotate(-90deg)'}} /></Button></Row>
                  }
                  {/* Sendo attribute section */}
                </>
              )
            }
          </div>
        </Col>
        <Divider/>
        <Row gutter={8} justify="end" style={{ width: '100%'}}>
          <Col><Button onClick={() => props.prev()}>Quay về</Button></Col>
          <Col><Button type={"primary"} onClick={handleFormSubmit}>Gửi</Button></Col>
        </Row>
      </Row>
      <Form.Item name="categoryId">
          <Input type={"text"} type={"hidden"}/>
      </Form.Item>
      <Form.Item name="categoryName">
          <Input type={"text"} type={"hidden"}/>
      </Form.Item>
      <Form.Item name="sendoCategoryId">
          <Input type={"text"} type={"hidden"}/>
      </Form.Item>
      <Form.Item name="sendoCategoryName">
          <Input type={"text"} type={"hidden"}/>
      </Form.Item>
    </div>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch => ({
  createMulti: payload => dispatch(AppCreators.createMultiPlatformProductStart(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreatePlatformStep)
