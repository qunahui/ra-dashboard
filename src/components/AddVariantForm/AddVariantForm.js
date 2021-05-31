import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Space, Row, Col, Input, InputNumber, Modal, Button, Typography, Select, AutoComplete } from 'antd'
import { InboxOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Creators from 'Redux/product'
import ImageUpload from 'Components/ImageUpload'
import { removeVI } from 'jsrmvi'
import { amountFormatter, amountParser, moneyFormatter, moneyParser } from 'Utils/inputFormatter'

const { Text } = Typography
const { Option } = Select

const AddSupplierForm = (props) => {  
  //<---------------------------------------form handler -------------------------------------------->
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    sku: '',
    avatar: '',
    options: [],
    importPrice: 0,
    wholeSalePrice: 0,
    retailPrice: 0,
    weightValue: 0,
    weightUnit: 'g',
    initPrice: 0,
    initStock: 0,
    productId: ''
  })

  useEffect(() => {
    setFormState({ 
      ...formState,
      name: props.initialValues?.suggestName,
      options: props.initialValues?.suggestOptions?.map(opt => ({ optionName: opt.optionName, optionValue: '' })),
      productId: props.initialValues?.productId,
      sku: props.initialValues?.suggestName && removeVI(props.initialValues?.suggestName, { replaceSpecialCharacters: true})
    })

  }, [props.initialValues])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState({ ...formState, [name]: value })
  }

  const handleInputNumberChange = (name) =>  (value) => {
    console.log(name, value)
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const handleWeightUnitChange = (value) => {
    setFormState({
      ...formState,
      weightUnit: value
    })
  }

  const handleSelectChange = (value, name)  => {
    console.log(value, name)
    let oldVal = ''
    setFormState({
      ...formState,
      options: formState.options.map((opt) => {
        if(opt.optionName === name) {
          oldVal = opt.optionValue
          return {
            ...opt,
            optionValue: value
          }
        } else return opt
      }),
      name: oldVal.length === 0 ? formState.name.concat(` - ${value}`) : formState.name.replace(` - ${oldVal}`, value === '' ? value : ` - ${value}`),
      sku: oldVal.length === 0 ? formState.sku.concat(`-${removeVI(value, { replaceSpecialCharacters: true })}`) : formState.sku.replace(`-${removeVI(oldVal, { replaceSpecialCharacters: true })}`, value === '' ? removeVI(value, { replaceSpecialCharacters: true }) : `-${removeVI(value, { replaceSpecialCharacters: true })}`),
    })
  }

  useEffect(() => {
    console.log(formState.options)
  }, [formState.options])

  const handleFormSubmit = () => {
    setLoading(true)
    const finalData = {
      ...formState,
      inventories: {
        initPrice: formState.initPrice,
        initStock: formState.initStock,
      },
      avatar: variantAvatar
    }

    props.createVariantStart(finalData)
  }

  useEffect(() => {
    const { isWorking } = props;
    if(!isWorking) {
      setLoading(false)
      setShowModal(false)
    }
  }, [props.isWorking])
  //<---------------------------------------form handler -------------------------------------------->
  
  //<--------------------------------------- add new variant modal handler -------------------------------------------->
  const [showModal, setShowModal] = useState(false)
  const handleShowModal = () => {
    setShowModal(true)
  }
  const handleHideModal = () => {
    setFormState({})
    setShowModal(false)
  }
  //<--------------------------------------- add new variant modal handler -------------------------------------------->

  //<--------------------------------------- image change handler -------------------------------------------->
  const [variantAvatar, setVariantAvatar] = useState('')
  const handleImageChange = (file) => {
    setVariantAvatar(file.url)
  }
  //<--------------------------------------- image change handler -------------------------------------------->

  return (
    <>
        <Modal
          title={"Thêm mới biến thể"}
          visible={showModal}
          onCancel={handleHideModal}
          onOk={handleFormSubmit}
          footer={[
            <Button key={"cancelVariantForm"} onClick={handleHideModal}>Cancel</Button>,
            <Button loading={loading} type="primary" key={"submitVariantForm"} onClick={handleFormSubmit}>OK</Button>
          ]}
          width={800}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Space size={"middle"} direction={"vertical"} style={{ width: '100%' }}>
                {
                  formState.options.map((option, index) => (
                    <div key={index}>
                      <Text style={{ display: 'inline-block', marginBottom: '5px' }}>{option.optionName}: </Text>
                      <AutoComplete
                        style={{ width: '100%'}}
                        size={"large"}
                        options={props.initialValues?.suggestOptions[index].optionValue.map(opt => ({ value: opt }))}
                        onChange={(value) => handleSelectChange(value, option.optionName)}
                        placeholder={"Chọn giá trị cho thuộc tính tùy chọn hoặc sử dụng các giá trị cũ."}
                      />
                    </div>
                  ))
                }
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Tên biến thể: </Text>
                  <Input size={"large"} name="name" onChange={handleChange} value={formState.name} placeholder={"Nhập vào tên biến thể"}/>
                </div>
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> SKU: </Text>
                  <Input size={"large"} name="sku" onChange={handleChange} value={formState.sku} style={{ width: '100%' }} placeholder={"Nhập vào SKU"}/>
                </div>
              </Space>
            </Col>
            <Col span={8} style={{ height: 150 }}>
              <ImageUpload 
                type="drag"
                handleChange={handleImageChange}
                maxCount={1}
                style={{ height: 100 }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Thả tập tin ảnh để cập nhật ảnh của phiên bản này</p>
              </ImageUpload>
              <Space size={"middle"} direction={"vertical"} style={{ width: '100%', marginTop: 16}}>
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Giá nhập: </Text>
                  <InputNumber style={{ width: '100%'}} formatter={moneyFormatter} parser={moneyParser} size={"large"} name={"importPrice"} onChange={(value) => handleInputNumberChange("importPrice")(value)} value={formState.importPrice} placeholder={"Nhập vào giá nhập"}/>
                </div>
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Giá bán lẻ: </Text>
                  <InputNumber style={{ width: '100%'}} formatter={moneyFormatter} parser={moneyParser} size={"large"} name={"retailPrice"} onChange={(value) => handleInputNumberChange("retailPrice")(value)} value={formState.retailPrice} placeholder={"Nhập vào giá bán lẻ"}/>
                </div>
                <div>
                  <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Giá bán buôn: </Text>
                  <InputNumber style={{ width: '100%'}} formatter={moneyFormatter} parser={moneyParser} size={"large"} name={"wholeSalePrice"} onChange={(value) => handleInputNumberChange("wholeSalePrice")(value)} value={formState.wholeSalePrice} placeholder={"Nhập vào giá bán buôn"}/>
                </div>
              </Space>
            </Col>
            <Col span={16}>
              <div style={{ marginTop: 16}}>
                <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Trọng lượng: </Text>
                <InputNumber style={{ width: '100%'}} formatter={amountFormatter} parser={amountParser} size={"large"} name={"weightValue"} onChange={(value) => handleInputNumberChange("weightValue")(value)} value={formState.weightValue} placeholder={"Nhập vào trọng lượng"}/>
              </div>
            </Col>
            <Col span={8}>
               <div style={{ marginTop: 16}}>
                <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Đơn vị khối lượng: </Text>
                <Select size={"large"} defaultValue={formState.weightUnit} onChange={handleWeightUnitChange} style={{ border: 'none', width: '100%' }} id="weight-unit-selector">
                  <Option key="g" value="g">g</Option>
                  <Option key="kg" value="kg">kg</Option>
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: 16}}>
                <Text style={{ display: 'inline-block', marginBottom: '5px' }}> Tồn kho ban đầu: </Text>
                <InputNumber style={{ width: '100%'}} formatter={amountFormatter} parser={amountParser} size={"large"} name={"initStock"} onChange={(value) => handleInputNumberChange("initStock")(value)} value={formState.initStock} placeholder={"Nhập vào trọng lượng"}/>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: 16}}>
                <Text style={{ display: 'inline-block', marginBottom: '5px', marginRight: 5 }}> Giá vốn ban đầu: </Text> <a href="#" onClick={(e) => { e.preventDefault(); console.log(formState.importPrice); setFormState({ ...formState, initPrice: formState.importPrice })}}>Sử dụng giá nhập</a>
                <InputNumber style={{ width: '100%'}} formatter={amountFormatter} parser={amountParser} size={"large"} name={"initPrice"} onChange={(value) => handleInputNumberChange("initPrice")(value)} value={formState.initPrice} placeholder={"Nhập vào trọng lượng"}/>
              </div>  
            </Col>
          </Row>
        </Modal>
        {
          (!props.trigger || props.trigger === 'button') ? 
            <Button style={{ marginRight: 10}} onClick={handleShowModal} type={"primary"}>{props.label || (<><PlusCircleOutlined/>Thêm</>)}</Button>
            : props.trigger === 'link' ?
            <a style={{ marginRight: 10}} href={"#"} onClick={(e) => { e.preventDefault(); handleShowModal(); }} >{props.label || (<><PlusCircleOutlined/>Thêm</>)}</a>
            : null
        }
    </>
  )
}

export default connect(state => ({
  isWorking: state.product.toJS().isWorking
}), dispatch => ({
  createVariantStart: (payload) => dispatch(Creators.createVariantStart(payload))
}))(AddSupplierForm)